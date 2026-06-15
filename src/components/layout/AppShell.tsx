import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Scale,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile & plan', to: '/profile', icon: User },
]

interface AppShellProps {
  children: React.ReactNode
  /** User display name shown in the header menu */
  userName?: string
  onLogout?: () => void
}

export default function AppShell({ children, userName, onLogout }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUserMenuOpen(false)
    onLogout?.()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ── Top nav ── */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-4 z-30 sticky top-0 shadow-sm">
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <Scale className="w-6 h-6 text-[#1E4D8C]" />
          <span className="font-bold text-[#1E4D8C] text-lg hidden sm:block">LexAI</span>
        </Link>

        <div className="flex-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium"
          >
            <span className="w-7 h-7 rounded-full bg-[#1E4D8C] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {userName ? userName[0].toUpperCase() : <User className="w-4 h-4" />}
            </span>
            <span className="hidden sm:block max-w-32 truncate">{userName ?? 'Account'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile & plan
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar (desktop) ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 p-3 gap-1 shrink-0"
        >
          <SidebarNav items={navItems} />
        </nav>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <nav
              aria-label="Main navigation"
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col p-4 gap-1 shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#1E4D8C]" />
                  <span className="font-bold text-[#1E4D8C]">LexAI</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarNav items={navItems} onNav={() => setSidebarOpen(false)} />
            </nav>
          </>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

function SidebarNav({
  items,
  onNav,
}: {
  items: NavItem[]
  onNav?: () => void
}) {
  return (
    <>
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNav}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-[#1E4D8C]/10 text-[#1E4D8C]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )
          }
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </>
  )
}
