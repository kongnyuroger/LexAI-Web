import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DocumentChatPage from '@/pages/app/DocumentChatPage'
import { ToastProvider } from '@/contexts/ToastContext'
import type { ChatMessage } from '@/types'

vi.mock('@/lib/analysisApi', () => ({
  getChatHistory: vi.fn(),
  sendChatMessage: vi.fn(),
}))

vi.mock('@/lib/documentsApi', () => ({
  getDocument: vi.fn(),
}))

import { getChatHistory, sendChatMessage } from '@/lib/analysisApi'
import { getDocument } from '@/lib/documentsApi'

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: `msg-${Math.random()}`,
    role: 'user',
    content: 'Hello',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

function renderChat() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/documents/doc-1/chat']}>
          <Routes>
            <Route path="/documents/:id/chat" element={<DocumentChatPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

describe('DocumentChatPage', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getDocument).mockResolvedValue({
      id: 'doc-1',
      filename: 'contract.pdf',
      status: 'ANALYZED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mimeType: 'application/pdf',
      sizeBytes: 1024,
    })
  })

  it('renders starter questions when there is no chat history', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    renderChat()
    await waitFor(() => {
      expect(screen.getByText(/ask lexai about this document/i)).toBeInTheDocument()
      expect(screen.getByText(/main obligations/i)).toBeInTheDocument()
    })
  })

  it('renders existing chat history messages', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([
      makeMessage({ role: 'user', content: 'What are the payment terms?' }),
      makeMessage({ role: 'assistant', content: 'Payment is due within 30 days.' }),
    ])
    renderChat()
    await waitFor(() => {
      expect(screen.getByText('What are the payment terms?')).toBeInTheDocument()
      expect(screen.getByText('Payment is due within 30 days.')).toBeInTheDocument()
    })
  })

  it('sends a message and shows the response', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    const assistantReply = makeMessage({
      role: 'assistant',
      content: 'Your main obligations are to pay on time.',
    })
    vi.mocked(sendChatMessage).mockResolvedValue(assistantReply)

    renderChat()
    await waitFor(() => screen.getByRole('textbox', { name: /chat message/i }))

    const input = screen.getByRole('textbox', { name: /chat message/i })
    await user.type(input, 'What are my obligations?')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith('doc-1', 'What are my obligations?')
    })
  })

  it('submits message on Enter key', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    vi.mocked(sendChatMessage).mockResolvedValue(makeMessage({ role: 'assistant', content: 'ok' }))

    renderChat()
    await waitFor(() => screen.getByRole('textbox', { name: /chat message/i }))

    const input = screen.getByRole('textbox', { name: /chat message/i })
    await user.type(input, 'Quick question{Enter}')

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith('doc-1', 'Quick question')
    })
  })

  it('does not submit on Shift+Enter (newline instead)', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    renderChat()
    await waitFor(() => screen.getByRole('textbox', { name: /chat message/i }))

    const input = screen.getByRole('textbox', { name: /chat message/i })
    await user.type(input, 'Line one{Shift>}{Enter}{/Shift}Line two')

    expect(sendChatMessage).not.toHaveBeenCalled()
  })

  it('sends a starter question when clicked', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    vi.mocked(sendChatMessage).mockResolvedValue(makeMessage({ role: 'assistant', content: 'Answer.' }))

    renderChat()
    await waitFor(() => screen.getByText(/main obligations/i))

    await user.click(screen.getByText(/main obligations/i))
    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith(
        'doc-1',
        'What are my main obligations under this agreement?'
      )
    })
  })

  it('shows an error toast when sending fails', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    vi.mocked(sendChatMessage).mockRejectedValue(new Error('network error'))

    renderChat()
    await waitFor(() => screen.getByRole('textbox', { name: /chat message/i }))

    const input = screen.getByRole('textbox', { name: /chat message/i })
    await user.type(input, 'test{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Message failed')).toBeInTheDocument()
    })
  })

  it('displays the legal disclaimer', async () => {
    vi.mocked(getChatHistory).mockResolvedValue([])
    renderChat()
    await waitFor(() => {
      expect(screen.getByText(/general information, not legal advice/i)).toBeInTheDocument()
    })
  })
})
