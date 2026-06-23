import api from './api'
import { supabase } from './supabase'
import type { AuthResponse, AuthTokens, LoginRequest, RegisterRequest, User } from '@/types'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data)
  return res.data
}

/**
 * Redirects the browser to Google's OAuth consent screen via Supabase.
 * Returns nothing meaningful — this is a redirect, not a request/response.
 */
export function initiateGoogleLogin(): void {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

/** Exchanges a Supabase access token for our backend's own JWT tokens. */
export async function googleLogin(supabaseAccessToken: string): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>('/auth/google', { accessToken: supabaseAccessToken })
  return res.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data)
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me')
  return res.data
}
