import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { tokenStorage } from '@/lib/api'

// ---------------------------------------------------------------------------
// SECURITY NOTE: Access and refresh tokens are stored in localStorage for
// the MVP. This is convenient but exposes tokens to XSS attacks. Before a
// production launch, revisit using httpOnly cookies set by the backend, which
// removes token access from client-side JavaScript entirely.
// ---------------------------------------------------------------------------

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      logout: () => {
        tokenStorage.clear()
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'lexai-auth',
      // Only persist the user object — tokens are handled by tokenStorage separately
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
