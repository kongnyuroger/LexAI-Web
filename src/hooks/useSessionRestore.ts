import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/lib/api'
import { getMe } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'

/**
 * Called once at the app root. Validates stored tokens via GET /auth/me and
 * either restores the session or clears stale state. Also listens for the
 * global 'lexai:logout' event fired by the Axios interceptor on 401 refresh
 * failure.
 */
export function useSessionRestore() {
  const { setUser, logout, setLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const restore = async () => {
      const token = tokenStorage.getAccess()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const user = await getMe()
        setUser(user)
      } catch {
        logout()
      }
    }

    restore()
  }, [setUser, logout, setLoading])

  // Listen for forced logouts triggered by the Axios interceptor
  useEffect(() => {
    const handler = () => {
      logout()
      navigate('/login', { replace: true })
    }
    window.addEventListener('lexai:logout', handler)
    return () => window.removeEventListener('lexai:logout', handler)
  }, [logout, navigate])
}
