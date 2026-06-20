import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import { easePremium } from '@/lib/motion'

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
      <header className="h-16 glass border-b border-slate-200/70 flex items-center px-4 md:px-6 gap-4 z-30 sticky top-0">
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-xl bg-primary-900 flex items-center justify-center shadow-soft">
            <Scale className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="font-semibold text-slate-900 text-lg hidden sm:block tracking-tight">LexAI</span>
        </Link>

        <div className="flex-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium"
          >
            <span className="w-7 h-7 rounded-full bg-primary-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {userName ? userName[0].toUpperCase() : <User className="w-4 h-4" />}
            </span>
            <span className="hidden sm:block max-w-32 truncate">{userName ?? 'Account'}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', userMenuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.18, ease: easePremium }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-2xl shadow-soft-lg z-20 overflow-hidden origin-top-right"
                >
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar (desktop) ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200/70 p-3 gap-1 shrink-0"
        >
          <SidebarNav items={navItems} />
        </nav>

        {/* ── Mobile sidebar overlay ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/30 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <motion.nav
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: easePremium }}
                aria-label="Main navigation"
                className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col p-4 gap-1 shadow-soft-lg md:hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary-900 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-white" />
                    </span>
                    <span className="font-semibold text-slate-900 tracking-tight">LexAI</span>
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
              </motion.nav>
            </>
          )}
        </AnimatePresence>

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
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-900/8 text-primary-900'
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
