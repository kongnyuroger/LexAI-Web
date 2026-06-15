import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '@/pages/auth/LoginPage'
import { ToastProvider } from '@/contexts/ToastContext'

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/lib/authApi', () => ({
  login: vi.fn(),
  getMe: vi.fn(),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    setUser: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
  })),
}))

import { login, getMe } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'

// ── Helpers ────────────────────────────────────────────────────────────────

function renderLogin() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('LoginPage', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the sign-in form', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    renderLogin()
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows a validation error for an invalid email', async () => {
    renderLogin()
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('calls login and getMe on valid submission', async () => {
    const mockTokens = { accessToken: 'acc', refreshToken: 'ref' }
    const mockUser = { id: '1', email: 'a@b.com', fullName: 'Ada', plan: 'FREE' as const, createdAt: '' }
    vi.mocked(login).mockResolvedValue(mockTokens)
    vi.mocked(getMe).mockResolvedValue(mockUser)

    const setUser = vi.fn()
    vi.mocked(useAuthStore).mockReturnValue({ setUser, isAuthenticated: false, isLoading: false } as ReturnType<typeof useAuthStore>)

    renderLogin()
    await user.type(screen.getByLabelText(/email address/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'mypassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'mypassword' })
      expect(getMe).toHaveBeenCalled()
      expect(setUser).toHaveBeenCalledWith(mockUser)
    })
  })

  it('shows an error toast when login fails', async () => {
    vi.mocked(login).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    })

    renderLogin()
    await user.type(screen.getByLabelText(/email address/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Sign in failed')).toBeInTheDocument()
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
