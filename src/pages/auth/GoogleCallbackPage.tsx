import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Scale } from 'lucide-react'
import { Spinner } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { googleLogin, getMe } from '@/lib/authApi'
import { tokenStorage } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { fadeUp, staggerContainer } from '@/lib/motion'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        // Landed here directly without going through the Google OAuth
        // redirect — nothing to exchange, send them to log in normally.
        if (!data.session) {
          navigate('/login', { replace: true })
          return
        }

        const tokens = await googleLogin(data.session.access_token)

        // Same handoff email/password login uses: store tokens, fetch the
        // user, update the auth store. From here Supabase's session is done.
        tokenStorage.set(tokens)
        const user = await getMe()
        setUser(user)
        navigate('/dashboard', { replace: true })
      } catch {
        setError('We could not sign you in with Google. Please try again.')
      }
    }

    completeSignIn()
  }, [navigate, setUser])

  if (error) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-glow overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-30" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative max-w-sm text-center"
        >
          <motion.div
            variants={fadeUp}
            className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5"
          >
            <AlertCircle className="w-7 h-7 text-red-500" aria-hidden="true" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-xl font-semibold text-slate-900 mb-2 tracking-tight"
          >
            Sign-in failed
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-slate-500 mb-6">
            {error}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-primary-900 text-white shadow-soft hover:bg-primary-950 hover:shadow-glow transition-all duration-200"
            >
              Try again
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-glow overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-30" />

      <div className="relative flex flex-col items-center text-center">
        <span className="w-10 h-10 rounded-2xl bg-primary-900 flex items-center justify-center shadow-soft mb-6">
          <Scale className="w-5 h-5 text-white" />
        </span>
        <Spinner size="lg" className="text-primary-900 mb-4" />
        <p className="text-sm text-slate-500">Signing you in…</p>
      </div>
    </div>
  )
}
