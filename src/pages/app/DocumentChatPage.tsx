import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, FileText, Scale, Bot, User } from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import { getDocument } from '@/lib/documentsApi'
import { getChatHistory, sendChatMessage } from '@/lib/analysisApi'
import { useToast } from '@/contexts/ToastContext'
import type { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import MessageContent from '@/components/chat/MessageContent'
import { fadeUp, staggerContainer, easePremium } from '@/lib/motion'

// ── Starter question chips ────────────────────────────────────────────────────

const STARTER_QUESTIONS = [
  'What are my main obligations under this agreement?',
  'What happens if I want to terminate this contract early?',
  'Are there any automatic renewal clauses I should know about?',
  'What are the payment terms and penalties for late payment?',
]

// ── Individual message bubble ─────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: easePremium }}
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse self-end max-w-[80%]' : 'self-start w-full max-w-[92%]'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1',
          isUser ? 'bg-primary-900 text-white' : 'bg-primary-900/8 text-primary-900'
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      {isUser ? (
        <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-primary-900 text-white shadow-soft">
          <MessageContent content={message.content} isAssistant={false} className="text-white [&_p]:text-white" />
        </div>
      ) : (
        <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 shadow-soft-sm overflow-hidden">
          {/* Subtle navy accent bar on the left */}
          <div className="flex">
            <div className="w-1 shrink-0 bg-primary-900/20 rounded-l-2xl" />
            <div className="px-4 py-3.5 flex-1">
              <MessageContent content={message.content} isAssistant />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 max-w-[85%]"
    >
      <div className="w-8 h-8 rounded-full bg-primary-900/8 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-primary-900" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary-900/40"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: easePremium }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Chat input ────────────────────────────────────────────────────────────────

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, disabled, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-grow textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-soft-sm focus-within:border-primary-900 focus-within:ring-2 focus-within:ring-primary-900/20 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about this document…"
        aria-label="Chat message"
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400',
          'px-2 py-1.5 outline-none min-h-9 max-h-40 leading-relaxed',
          'disabled:opacity-50'
        )}
      />
      <Button
        size="sm"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        aria-label="Send message"
        className="shrink-0 mb-0.5"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  )
}

// ── Chat page ─────────────────────────────────────────────────────────────────

export default function DocumentChatPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { error: toastError } = useToast()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([])

  // Document metadata (for header display)
  const { data: doc } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
  })

  // Chat history
  const historyQuery = useQuery({
    queryKey: ['chat', id],
    queryFn: () => getChatHistory(id!),
    enabled: !!id,
  })

  const allMessages = [...(historyQuery.data ?? []), ...optimisticMessages]

  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (message: string) => sendChatMessage(id!, message),
    onMutate: (message) => {
      // Optimistic user message
      const optimistic: ChatMessage = {
        id: `opt-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      }
      setOptimisticMessages((prev) => [...prev, optimistic])
    },
    onSuccess: () => {
      // Invalidate so the full history (including the assistant reply) is fetched
      queryClient.invalidateQueries({ queryKey: ['chat', id] })
      setOptimisticMessages([])
    },
    onError: () => {
      setOptimisticMessages([])
      toastError('Message failed', 'Could not send your message. Please try again.')
    },
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length, isPending])

  const handleSend = (message: string) => sendMessage(message)

  const handleStarterQuestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)]">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 pb-4 border-b border-slate-200/80 mb-4 shrink-0"
      >
        <Link
          to={`/documents/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {doc?.filename ?? 'Document Q&A'}
          </p>
          <p className="text-xs text-slate-400">Ask anything about this document</p>
        </div>

        <Link
          to={`/documents/${id}`}
          className="text-xs text-primary-900 hover:underline shrink-0 hidden sm:block font-medium"
        >
          View analysis
        </Link>
      </motion.div>

      {/* ── Message list ── */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 pr-1"
      >
        {historyQuery.isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-16 flex-1 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Starter questions (shown when there's no history yet) */}
        {!historyQuery.isLoading && allMessages.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center justify-center flex-1 gap-6 text-center px-4 py-8"
          >
            <motion.div variants={fadeUp} className="w-14 h-14 rounded-2xl bg-primary-900/8 flex items-center justify-center">
              <Scale className="w-7 h-7 text-primary-900" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-base font-semibold text-slate-900 mb-1 tracking-tight">
                Ask LexAI about this document
              </p>
              <p className="text-sm text-slate-500 max-w-sm">
                You can ask about specific clauses, your obligations, risks, or anything else
                you're unsure about.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-2 w-full max-w-sm">
              {STARTER_QUESTIONS.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStarterQuestion(q)}
                  disabled={isPending}
                  className="text-left text-sm text-primary-900 bg-primary-900/5 hover:bg-primary-900/8 border border-primary-900/15 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
                >
                  {q}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {allMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isPending && <TypingIndicator key="typing" />}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 pt-3 border-t border-slate-200/80">
        <ChatInput onSend={handleSend} disabled={isPending} />

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
          LexAI provides general information, not legal advice. For complex situations,{' '}
          <span className="text-slate-500">consult a qualified lawyer.</span>
        </p>
      </div>
    </div>
  )
}
