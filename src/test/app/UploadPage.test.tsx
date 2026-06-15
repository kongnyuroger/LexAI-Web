import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UploadPage from '@/pages/app/UploadPage'
import { ToastProvider } from '@/contexts/ToastContext'

vi.mock('@/lib/uploadApi', () => ({
  uploadDocument: vi.fn(),
}))

import { uploadDocument } from '@/lib/uploadApi'

function renderUpload() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/upload']}>
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents/:id" element={<div>Document detail</div>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

function makeFile(name: string, type: string, sizeBytes = 1024) {
  return new File(['x'.repeat(sizeBytes)], name, { type })
}

describe('UploadPage', () => {
  const user = userEvent.setup()

  beforeEach(() => vi.clearAllMocks())

  it('renders the drop zone', () => {
    renderUpload()
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
    expect(screen.getByText(/supported: pdf, docx, jpg, png/i)).toBeInTheDocument()
  })

  it('shows validation error for an unsupported file type', async () => {
    renderUpload()
    // user.upload() respects the <input accept> attribute, so simulate a drop instead
    const dropzone = screen.getByRole('button', { name: /drop zone/i })
    const file = makeFile('test.txt', 'text/plain')
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for a file over 10 MB', async () => {
    renderUpload()
    const bigFile = makeFile('big.pdf', 'application/pdf', 11 * 1024 * 1024)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, bigFile)
    await waitFor(() => {
      expect(screen.getByText(/too large/i)).toBeInTheDocument()
    })
  })

  it('shows the file preview for a valid PDF', async () => {
    renderUpload()
    const file = makeFile('contract.pdf', 'application/pdf')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)
    await waitFor(() => {
      expect(screen.getByText('contract.pdf')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /upload$/i })).toBeInTheDocument()
    })
  })

  it('calls uploadDocument and navigates on success', async () => {
    const mockDoc = { id: 'doc-1', filename: 'contract.pdf', status: 'UPLOADED' as const, createdAt: '', updatedAt: '', mimeType: 'application/pdf', sizeBytes: 1024 }
    vi.mocked(uploadDocument).mockResolvedValue(mockDoc)

    renderUpload()
    const file = makeFile('contract.pdf', 'application/pdf')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: /upload$/i }))

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith(file, expect.any(Function))
      expect(screen.getByText('Document detail')).toBeInTheDocument()
    })
  })

  it('shows error toast on upload failure', async () => {
    vi.mocked(uploadDocument).mockRejectedValue({
      response: { data: { message: 'Storage error' } },
    })

    renderUpload()
    const file = makeFile('contract.pdf', 'application/pdf')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: /upload$/i }))

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
      expect(screen.getByText('Storage error')).toBeInTheDocument()
    })
  })
})
