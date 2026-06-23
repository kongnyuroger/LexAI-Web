import { Outlet, useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'
import { useSessionRestore } from '@/hooks/useSessionRestore'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  useSessionRestore()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <ProtectedRoute>
      <AppShell userName={user?.fullName} avatarUrl={user?.avatarUrl} onLogout={handleLogout}>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  )
}
