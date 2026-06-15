import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      <div className="flex items-center gap-3">
        <Scale className="w-10 h-10 text-primary-900" />
        <span className="text-3xl font-bold text-primary-900">LexAI</span>
      </div>
      <h1 className="text-4xl font-bold text-slate-900 max-w-2xl leading-tight">
        Understand any contract before you sign it — in plain language, in minutes.
      </h1>
      <p className="text-lg text-slate-600 max-w-xl">
        Upload a legal document and get an instant plain-English summary, risk flag analysis, and
        an AI assistant you can ask questions — no legal background required.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary-800 transition-colors"
          style={{ backgroundColor: '#1E4D8C' }}
        >
          Get started free
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
        >
          Sign in
        </Link>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Full landing page — coming in Task 9.
      </p>
    </div>
  )
}
