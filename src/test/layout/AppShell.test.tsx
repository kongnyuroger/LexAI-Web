import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'

function renderShell(props: Partial<React.ComponentProps<typeof AppShell>> = {}) {
  return render(
    <MemoryRouter>
      <AppShell {...props}>
        <div>Content</div>
      </AppShell>
    </MemoryRouter>
  )
}

describe('AppShell', () => {
  it('shows the avatar image with referrerPolicy when avatarUrl is present', () => {
    const { container } = renderShell({
      userName: 'Ada Lovelace',
      avatarUrl: 'https://lh3.googleusercontent.com/a/avatar.jpg',
    })
    const avatar = container.querySelector('img')
    expect(avatar).toHaveAttribute('src', 'https://lh3.googleusercontent.com/a/avatar.jpg')
    expect(avatar).toHaveAttribute('referrerpolicy', 'no-referrer')
  })

  it('falls back to initials when there is no avatarUrl', () => {
    const { container } = renderShell({ userName: 'Ada Lovelace' })
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
