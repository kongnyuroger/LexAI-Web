import api from './api'
import type { LexDocument } from '@/types'

export interface UploadProgressCallback {
  (percent: number): void
}

export async function uploadDocument(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<LexDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post<LexDocument>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (evt.total && onProgress) {
        onProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    },
  })

  return res.data
}
