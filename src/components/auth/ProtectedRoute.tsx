import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/** Redirects unauthenticated users to /login, preserving the intended destination. */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-primary-900" label="Restoring session…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

/** Redirects already-authenticated users away from /login and /register. */
export function GuestRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore()

  // Check isAuthenticated first: if the store has persisted auth state the user
  // should be sent to the dashboard immediately, without waiting for isLoading.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // isLoading is true only when a token exists and is being validated (AppLayout
  // mounts useSessionRestore). If there is no token, isLoading is false and the
  // login/register page renders without any delay.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-primary-900" label="Restoring session…" />
      </div>
    )
  }

  return <>{children}</>
}
