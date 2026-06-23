import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage'
import DashboardPage from '@/pages/app/DashboardPage'
import UploadPage from '@/pages/app/UploadPage'
import DocumentDetailPage from '@/pages/app/DocumentDetailPage'
import DocumentChatPage from '@/pages/app/DocumentChatPage'
import ProfilePage from '@/pages/app/ProfilePage'
import NotFoundPage from '@/pages/NotFoundPage'
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

  // Unguarded — the user is mid-OAuth-handoff here, neither authenticated
  // (ProtectedRoute) nor a plain guest on a login/register form (GuestRoute).
  // Not nested under PublicLayout either, so it gets no header/footer chrome,
  // matching the full-screen treatment of /login and /register.
  { path: '/auth/callback', element: <GoogleCallbackPage /> },

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
      { path: '/documents/:id', element: <DocumentDetailPage /> },
      { path: '/documents/:id/chat', element: <DocumentChatPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/app', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router
