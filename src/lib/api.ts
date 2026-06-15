import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { AuthTokens } from '@/types'

// Token storage keys
const ACCESS_TOKEN_KEY = 'lexai_access_token'
const REFRESH_TOKEN_KEY = 'lexai_refresh_token'

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token
// ---------------------------------------------------------------------------

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — transparent token refresh on 401
// ---------------------------------------------------------------------------

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const processQueue = (token: string) => {
  refreshQueue.forEach((resolve) => resolve(token))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefresh()

      if (!refreshToken) {
        // No refresh token → force logout (store will subscribe to this event)
        window.dispatchEvent(new Event('lexai:logout'))
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Another refresh is in flight — queue this request
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<AuthTokens>(
          `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'}/auth/refresh`,
          { refreshToken }
        )
        tokenStorage.set(data)
        processQueue(data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        tokenStorage.clear()
        window.dispatchEvent(new Event('lexai:logout'))
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
