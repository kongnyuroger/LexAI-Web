import { Outlet, useLocation } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

// Don't show the public header/footer on the landing page itself
// (it has its own hero-style header)
const BARE_ROUTES = ['/']

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
