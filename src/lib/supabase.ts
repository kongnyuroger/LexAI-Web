import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// SCOPE: this client exists ONLY to initiate Google OAuth and to read the
// session Supabase places in the URL after the redirect back from Google
// (see src/pages/auth/GoogleCallbackPage.tsx). Do not use it for database
// queries, storage, realtime, or as a source of session/user truth anywhere
// else in the app. Once we exchange the Supabase access token for our own
// backend JWT (POST /auth/google), Supabase's session is discarded — the
// existing auth store (src/stores/authStore.ts) remains the single source
// of truth for "is this user logged in."
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
