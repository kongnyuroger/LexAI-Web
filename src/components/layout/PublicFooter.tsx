import { Scale } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Scale className="w-4 h-4 text-[#1E4D8C]" />
          <span className="text-sm font-medium text-[#1E4D8C]">LexAI</span>
          <span className="text-sm text-slate-400">— AI-powered legal assistant</span>
        </div>

        <p className="text-xs text-slate-400 text-center sm:text-right max-w-sm">
          LexAI provides general information about legal documents, not legal advice. For complex
          situations, please consult a qualified lawyer.
        </p>
      </div>
    </footer>
  )
}
