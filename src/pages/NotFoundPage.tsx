import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-8 h-8 text-slate-400" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          404
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
