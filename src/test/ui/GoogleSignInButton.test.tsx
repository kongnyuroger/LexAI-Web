import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GoogleSignInButton from '@/components/ui/GoogleSignInButton'

vi.mock('@/lib/authApi', () => ({
  initiateGoogleLogin: vi.fn(),
}))

import { initiateGoogleLogin } from '@/lib/authApi'

describe('GoogleSignInButton', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Google sign-in label', () => {
    render(<GoogleSignInButton />)
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  it('calls initiateGoogleLogin when clicked', async () => {
    render(<GoogleSignInButton />)
    await user.click(screen.getByRole('button', { name: /continue with google/i }))
    expect(initiateGoogleLogin).toHaveBeenCalledTimes(1)
  })

  it('disables itself while redirecting', async () => {
    render(<GoogleSignInButton />)
    const button = screen.getByRole('button', { name: /continue with google/i })
    await user.click(button)
    expect(button).toBeDisabled()
  })
})
