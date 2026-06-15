import api from './api'
import type { DocumentsResponse, LexDocument, UsageStats } from '@/types'

// NOTE: GET /documents pagination shape is assumed — verify with lexai-backend.
// Assumed query params: ?page=1&limit=20
export async function getDocuments(page = 1, limit = 20): Promise<DocumentsResponse> {
  const res = await api.get<DocumentsResponse>('/documents', { params: { page, limit } })
  return res.data
}

export async function getDocument(id: string): Promise<LexDocument> {
  const res = await api.get<LexDocument>(`/documents/${id}`)
  return res.data
}

export async function getUsage(): Promise<UsageStats> {
  const res = await api.get<UsageStats>('/users/me/usage')
  return res.data
}
