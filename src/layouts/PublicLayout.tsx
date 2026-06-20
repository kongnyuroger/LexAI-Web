import { Outlet, useLocation } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

// Landing page has its own hero-style header; auth pages are self-contained
// full-screen cards with their own logo lockup — showing PublicHeader/Footer
// on top of them duplicates the branding and the "Sign in" CTA.
const BARE_ROUTES = ['/', '/login', '/register']

export default function PublicLayout() {
  const { pathname } = useLocation()
  const bare = BARE_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!bare && <PublicHeader />}
      <Outlet />
      {!bare && <PublicFooter />}
    </div>
  )
}
