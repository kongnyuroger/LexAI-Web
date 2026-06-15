import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/app/DashboardPage'
import UploadPage from '@/pages/app/UploadPage'
import { GuestRoute } from '@/components/auth/ProtectedRoute'

// Dev-only component showcase — tree-shaken in production
const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/components',
        lazy: async () => {
          const { default: ComponentsPage } = await import('@/pages/dev/ComponentsPage')
          return { Component: ComponentsPage }
        },
      },
    ]
  : []

const router = createBrowserRouter([
  ...devRoutes,

  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        path: '/login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/upload', element: <UploadPage /> },
      { path: '/app', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  // 404 — replaced with proper NotFoundPage in Task 10
  { path: '*', element: <Navigate to="/" replace /> },
])

export default router
