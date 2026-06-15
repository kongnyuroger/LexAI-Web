import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RegisterPage from '@/pages/auth/RegisterPage'
import { ToastProvider } from '@/contexts/ToastContext'

vi.mock('@/lib/authApi', () => ({
  register: vi.fn(),
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

import { register as registerUser, login, getMe } from '@/lib/authApi'

function renderRegister() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

describe('RegisterPage', () => {
  const user = userEvent.setup()

  beforeEach(() => vi.clearAllMocks())

  it('renders the registration form', () => {
    renderRegister()
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('shows password mismatch error', async () => {
    renderRegister()
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Different1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('shows weak password error', async () => {
    renderRegister()
    await user.type(screen.getByLabelText(/^password/i), 'weak')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('calls register then login on valid submission', async () => {
    vi.mocked(registerUser).mockResolvedValue({ accessToken: '', refreshToken: '' })
    vi.mocked(login).mockResolvedValue({ accessToken: 'acc', refreshToken: 'ref' })
    vi.mocked(getMe).mockResolvedValue({
      id: '1',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      plan: 'FREE' as const,
      createdAt: '',
    })

    renderRegister()
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Password1',
      })
      expect(login).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'Password1' })
    })
  })

  it('shows error toast when registration fails', async () => {
    vi.mocked(registerUser).mockRejectedValue({
      response: { data: { message: 'Email already in use' } },
    })

    renderRegister()
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email address/i), 'taken@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })
})
