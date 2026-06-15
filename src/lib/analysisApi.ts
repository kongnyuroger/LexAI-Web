import api from './api'
import type { DocumentAnalysis, ChatMessage } from '@/types'

export async function triggerAnalysis(documentId: string): Promise<DocumentAnalysis> {
  const res = await api.post<DocumentAnalysis>(`/documents/${documentId}/analyze`)
  return res.data
}

export async function getAnalysis(documentId: string): Promise<DocumentAnalysis> {
  const res = await api.get<DocumentAnalysis>(`/documents/${documentId}/analysis`)
  return res.data
}

export async function getChatHistory(documentId: string): Promise<ChatMessage[]> {
  const res = await api.get<ChatMessage[]>(`/documents/${documentId}/chat`)
  return res.data
}

export async function sendChatMessage(
  documentId: string,
  message: string
): Promise<ChatMessage> {
  const res = await api.post<{ message: ChatMessage }>(`/documents/${documentId}/chat`, {
    message,
  })
  return res.data.message
}
