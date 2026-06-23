import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProfilePage from '@/pages/app/ProfilePage'

vi.mock('@/lib/authApi', () => ({
  getMe: vi.fn(),
}))

vi.mock('@/lib/documentsApi', () => ({
  getUsage: vi.fn(),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({ logout: vi.fn() })),
}))

import { getMe } from '@/lib/authApi'
import { getUsage } from '@/lib/documentsApi'

function renderProfile() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const baseUser = {
  id: '1',
  email: 'a@b.com',
  fullName: 'Ada Lovelace',
  plan: 'FREE' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
}

const usage = { used: 2, limit: 5, plan: 'FREE' as const }

describe('ProfilePage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows a Google avatar image with referrerPolicy when avatarUrl is present', async () => {
    vi.mocked(getMe).mockResolvedValue({
      ...baseUser,
      avatarUrl: 'https://lh3.googleusercontent.com/a/avatar.jpg',
      authProvider: 'GOOGLE',
    })
    vi.mocked(getUsage).mockResolvedValue(usage)

    const { container } = renderProfile()

    await waitFor(() => {
      const avatar = container.querySelector('img')
      expect(avatar).toHaveAttribute('src', 'https://lh3.googleusercontent.com/a/avatar.jpg')
      expect(avatar).toHaveAttribute('referrerpolicy', 'no-referrer')
    })
    expect(screen.getByText('Google')).toBeInTheDocument()
  })

  it('falls back to initials and shows Email & Password when there is no avatarUrl', async () => {
    vi.mocked(getMe).mockResolvedValue({ ...baseUser, authProvider: 'EMAIL' })
    vi.mocked(getUsage).mockResolvedValue(usage)

    const { container } = renderProfile()

    await waitFor(() => {
      expect(container.querySelector('img')).not.toBeInTheDocument()
      expect(screen.getByText('A')).toBeInTheDocument()
    })
    expect(screen.getByText('Email & Password')).toBeInTheDocument()
  })
})
