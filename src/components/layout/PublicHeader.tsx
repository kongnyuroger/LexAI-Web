import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'
export default function PublicHeader() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#1E4D8C]" />
          <span className="font-bold text-[#1E4D8C] text-lg">LexAI</span>
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
            className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-sm font-medium bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  )
}
