import { cn } from '@/lib/utils'

// ── Inline formatting ─────────────────────────────────────────────────────────
// Handles **bold**, *italic*, and `code` spans.

function parseInline(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, or `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

// ── Block classifier ──────────────────────────────────────────────────────────

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'heading'; text: string; level: 1 | 2 | 3 }

function parseBlocks(content: string): Block[] {
  // Normalise Windows line endings
  const text = content.replace(/\r\n/g, '\n').trim()

  // Split into rough chunks on blank lines
  const rawChunks = text.split(/\n{2,}/)

  const blocks: Block[] = []

  for (const chunk of rawChunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue

    // Detect ordered list: lines like "1.", "2.", "1)" etc.
    const orderedPattern = /^(\d+)[.)]\s+(.+)$/
    if (lines.length > 1 && lines.every((l) => orderedPattern.test(l))) {
      blocks.push({
        type: 'ordered-list',
        items: lines.map((l) => l.replace(orderedPattern, '$2')),
      })
      continue
    }

    // Single line that looks like a numbered intro "…are: 1. …" — split inline numbers
    // into list items. E.g. "obligations are: 1. Do X 2. Do Y 3. Do Z"
    const inlineNumbered = /:\s*1[.)]\s+/
    if (lines.length === 1 && inlineNumbered.test(lines[0])) {
      const [intro, ...rest] = lines[0].split(/(?=\d+[.)]\s+)/)
      const listItems = rest.join('').split(/\d+[.)]\s+/).filter(Boolean)
      if (listItems.length >= 2) {
        // Emit the intro sentence as a paragraph first
        const introClean = intro.replace(/:\s*$/, '').trim()
        if (introClean) blocks.push({ type: 'paragraph', text: introClean + ':' })
        blocks.push({ type: 'ordered-list', items: listItems.map((s) => s.trim()) })
        continue
      }
    }

    // Also detect a paragraph that CONTAINS inline "1. … 2. … 3. …" sequences
    const containsInlineList = /\b1[.)]\s+.+\b2[.)]\s+/s
    if (lines.length === 1 && containsInlineList.test(lines[0])) {
      // Split at the first numbered item
      const splitPoint = lines[0].search(/\b1[.)]\s+/)
      const intro = lines[0].slice(0, splitPoint).trim()
      const listPart = lines[0].slice(splitPoint)
      const items = listPart.split(/\b\d+[.)]\s+/).filter(Boolean).map((s) => s.trim())

      if (items.length >= 2) {
        if (intro) blocks.push({ type: 'paragraph', text: intro })
        blocks.push({ type: 'ordered-list', items })
        continue
      }
    }

    // Detect unordered list: lines starting with -, *, •, –
    const unorderedPattern = /^[-*•–]\s+(.+)$/
    if (lines.length > 1 && lines.every((l) => unorderedPattern.test(l))) {
      blocks.push({
        type: 'unordered-list',
        items: lines.map((l) => l.replace(unorderedPattern, '$1')),
      })
      continue
    }

    // Mixed chunk: some lines are list items, some aren't — emit each line separately
    const hasSomeListLines = lines.some(
      (l) => orderedPattern.test(l) || unorderedPattern.test(l)
    )
    if (hasSomeListLines) {
      let currentList: { type: 'ordered-list' | 'unordered-list'; items: string[] } | null = null

      for (const line of lines) {
        const orderedMatch = line.match(orderedPattern)
        const unorderedMatch = line.match(unorderedPattern)

        if (orderedMatch) {
          if (currentList?.type !== 'ordered-list') {
            if (currentList) blocks.push(currentList)
            currentList = { type: 'ordered-list', items: [] }
          }
          currentList.items.push(orderedMatch[2])
        } else if (unorderedMatch) {
          if (currentList?.type !== 'unordered-list') {
            if (currentList) blocks.push(currentList)
            currentList = { type: 'unordered-list', items: [] }
          }
          currentList.items.push(unorderedMatch[1])
        } else {
          if (currentList) {
            blocks.push(currentList)
            currentList = null
          }
          if (line) blocks.push({ type: 'paragraph', text: line })
        }
      }
      if (currentList) blocks.push(currentList)
      continue
    }

    // Heading: lines starting with ## or ###
    const headingMatch = lines[0].match(/^(#{1,3})\s+(.+)$/)
    if (lines.length === 1 && headingMatch) {
      blocks.push({
        type: 'heading',
        text: headingMatch[2],
        level: Math.min(headingMatch[1].length, 3) as 1 | 2 | 3,
      })
      continue
    }

    // Plain paragraph — join lines with a space
    blocks.push({ type: 'paragraph', text: lines.join(' ') })
  }

  return blocks
}

// ── Long paragraph splitter ───────────────────────────────────────────────────
// If a paragraph has 3+ sentences, break it so each sentence sits on its own
// visual line (still one <p> per sentence, not one huge wall of text).

function splitSentences(text: string): string[] {
  // Split after . ! ? followed by a space and a capital letter
  const raw = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/)
  return raw.map((s) => s.trim()).filter(Boolean)
}

// ── Renderer ──────────────────────────────────────────────────────────────────

interface MessageContentProps {
  content: string
  /** True for assistant messages — applies richer formatting */
  isAssistant?: boolean
  className?: string
}

export default function MessageContent({ content, isAssistant = false, className }: MessageContentProps) {
  if (!isAssistant) {
    return (
      <p className={cn('text-base leading-relaxed whitespace-pre-wrap', className)}>{content}</p>
    )
  }

  const blocks = parseBlocks(content)

  return (
    <div className={cn('text-base space-y-3', className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <p key={i} className="font-semibold text-slate-900 leading-snug">
                {parseInline(block.text)}
              </p>
            )

          case 'paragraph': {
            const sentences = splitSentences(block.text)
            // 3+ sentences → render each on its own line for air
            if (sentences.length >= 3) {
              return (
                <div key={i} className="space-y-1.5">
                  {sentences.map((s, j) => (
                    <p key={j} className="text-slate-700 leading-relaxed">
                      {parseInline(s)}
                    </p>
                  ))}
                </div>
              )
            }
            return (
              <p key={i} className="text-slate-700 leading-relaxed">
                {parseInline(block.text)}
              </p>
            )
          }

          case 'ordered-list':
            return (
              <ol key={i} className="list-none space-y-2.5 pl-0">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary-900/10 text-primary-900 text-xs font-semibold flex items-center justify-center mt-0.5">
                      {j + 1}
                    </span>
                    <span className="text-slate-700 flex-1">{parseInline(item)}</span>
                  </li>
                ))}
              </ol>
            )

          case 'unordered-list':
            return (
              <ul key={i} className="space-y-2 pl-0">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 leading-relaxed">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary-900/50 mt-2.5" />
                    <span className="text-slate-700 flex-1">{parseInline(item)}</span>
                  </li>
                ))}
              </ul>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
