import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage'

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn() } },
}))

vi.mock('@/lib/authApi', () => ({
  googleLogin: vi.fn(),
  getMe: vi.fn(),
}))

const setUser = vi.fn()
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({ setUser })),
}))

import { supabase } from '@/lib/supabase'
import { googleLogin, getMe } from '@/lib/authApi'
import { tokenStorage } from '@/lib/api'

// ── Helpers ────────────────────────────────────────────────────────────────

function renderCallback() {
  return render(
    <MemoryRouter initialEntries={['/auth/callback']}>
      <Routes>
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('GoogleCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows a signing-in spinner while exchanging the session', () => {
    vi.mocked(supabase.auth.getSession).mockReturnValue(new Promise(() => {}) as never)
    renderCallback()
    expect(screen.getByText(/signing you in/i)).toBeInTheDocument()
  })

  it('exchanges the Supabase session for backend tokens and redirects to the dashboard', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'supabase-access-token' } },
    } as never)
    const mockTokens = { accessToken: 'acc', refreshToken: 'ref' }
    const mockUser = { id: '1', email: 'a@b.com', fullName: 'Ada', plan: 'FREE' as const, createdAt: '' }
    vi.mocked(googleLogin).mockResolvedValue(mockTokens)
    vi.mocked(getMe).mockResolvedValue(mockUser)

    renderCallback()

    await waitFor(() => {
      expect(googleLogin).toHaveBeenCalledWith('supabase-access-token')
      expect(setUser).toHaveBeenCalledWith(mockUser)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    expect(tokenStorage.getAccess()).toBe(mockTokens.accessToken)
    expect(tokenStorage.getRefresh()).toBe(mockTokens.refreshToken)
  })

  it('redirects to login when there is no Supabase session to exchange', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as never)

    renderCallback()

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument()
    })
    expect(googleLogin).not.toHaveBeenCalled()
  })

  it('shows a clear error with a retry link when the exchange fails', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'supabase-access-token' } },
    } as never)
    vi.mocked(googleLogin).mockRejectedValue(new Error('Network Error'))

    renderCallback()

    await waitFor(() => {
      expect(screen.getByText('Sign-in failed')).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: /try again/i })).toHaveAttribute('href', '/login')
  })
})
