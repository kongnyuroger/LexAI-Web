import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/app/DashboardPage'

// Lazy-load the dev-only component showcase (stripped from production builds)
const ComponentsPage =
  import.meta.env.DEV
    ? (await import('@/pages/dev/ComponentsPage')).default
    : () => <Navigate to="/" replace />

const router = createBrowserRouter([
  // Dev-only component showcase
  ...(import.meta.env.DEV
    ? [{ path: '/dev/components', element: <ComponentsPage /> }]
    : []),

  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/app', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  // 404 — replaced with proper NotFoundPage in Task 10
  { path: '*', element: <Navigate to="/" replace /> },
])

export default router
