import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'

export default function PublicHeader() {
  return (
    <header className="h-16 glass border-b border-slate-200/70 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-primary-900 flex items-center justify-center shadow-soft">
            <Scale className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">LexAI</span>
        </Link>

        <nav aria-label="Public navigation" className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-medium bg-primary-900 text-white shadow-soft hover:bg-[#173d70] hover:shadow-glow transition-all duration-200"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  )
}
