import { Outlet } from 'react-router-dom'
import { Scale } from 'lucide-react'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Placeholder nav — replaced in Task 2 with full AppShell */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-3 shadow-sm">
        <Scale className="w-6 h-6 text-primary-900" />
        <span className="font-semibold text-primary-900 text-lg">LexAI</span>
      </header>

      <div className="flex flex-1">
        {/* Placeholder sidebar */}
        <nav className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 p-4 gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-1">
            Navigation
          </span>
          <a
            href="/dashboard"
            className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Dashboard
          </a>
        </nav>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
