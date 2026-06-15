/**
 * Shared mock API payloads for Playwright e2e tests.
 * All tests use route interception so no real backend is required.
 */

export const MOCK_USER = {
  id: 'user-1',
  email: 'test@example.com',
  fullName: 'Test User',
  plan: 'FREE' as const,
  createdAt: '2025-01-01T00:00:00Z',
}

export const MOCK_TOKENS = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

export const MOCK_USAGE = {
  used: 1,
  limit: 3,
  plan: 'FREE' as const,
}

export const MOCK_DOCUMENTS = {
  data: [
    {
      id: 'doc-1',
      filename: 'employment-contract.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 102400,
      status: 'ANALYZED' as const,
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2025-06-01T10:01:00Z',
    },
  ],
  total: 1,
  page: 1,
  limit: 20,
}

export const MOCK_DOCUMENT = MOCK_DOCUMENTS.data[0]
