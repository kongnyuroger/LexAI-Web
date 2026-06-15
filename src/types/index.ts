// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  fullName: string
  plan: 'FREE' | 'PREMIUM'
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse extends AuthTokens {
  user?: User
}

// ─── Documents ───────────────────────────────────────────────────────────────

export type DocumentStatus = 'UPLOADED' | 'TEXT_EXTRACTED' | 'ANALYZED' | 'FAILED'

export interface LexDocument {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  status: DocumentStatus
  createdAt: string
  updatedAt: string
}

export interface DocumentsResponse {
  data: LexDocument[]
  total: number
  page: number
  limit: number
}

// ─── Analysis ────────────────────────────────────────────────────────────────

export type RiskSeverity = 'HIGH' | 'MEDIUM' | 'LOW'

export interface RiskFlag {
  id: string
  severity: RiskSeverity
  clauseText: string
  explanation: string
  category?: string
}

export interface DocumentAnalysis {
  id: string
  documentId: string
  summary: {
    purpose: string
    mainParties: string[]
    importantDates: string[]
    moneyInvolved: string[]
    responsibilities: string[]
  }
  riskFlags: RiskFlag[]
  createdAt: string
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface ChatResponse {
  message: ChatMessage
}

// ─── Usage ───────────────────────────────────────────────────────────────────

export interface UsageStats {
  used: number
  limit: number
  plan: 'FREE' | 'PREMIUM'
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
