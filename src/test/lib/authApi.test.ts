import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  default: { post: vi.fn(), get: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { signInWithOAuth: vi.fn(), getSession: vi.fn() } },
}))

import api from '@/lib/api'
import { googleLogin } from '@/lib/authApi'

describe('googleLogin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exchanges a valid Supabase access token for backend JWT tokens', async () => {
    const mockTokens = { accessToken: 'backend-access', refreshToken: 'backend-refresh' }
    vi.mocked(api.post).mockResolvedValue({ data: mockTokens })

    const result = await googleLogin('supabase-access-token')

    expect(api.post).toHaveBeenCalledWith('/auth/google', {
      accessToken: 'supabase-access-token',
    })
    expect(result).toEqual(mockTokens)
  })

  it('throws when the backend request fails', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network Error'))

    await expect(googleLogin('supabase-access-token')).rejects.toThrow('Network Error')
  })
})
