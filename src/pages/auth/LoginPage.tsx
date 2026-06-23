import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'
import { Button, Input, Card, GoogleSignInButton } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { login } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'
import { tokenStorage } from '@/lib/api'
import { getMe } from '@/lib/authApi'
import { fadeUp, staggerContainer } from '@/lib/motion'

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()
  const { error: toastError } = useToast()

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const tokens = await login(values)
      tokenStorage.set(tokens)
      const user = await getMe()
      setUser(user)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Could not sign in. Please check your credentials and try again.'
      toastError('Sign in failed', msg)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-glow overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-30" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-6">
            <span className="w-10 h-10 rounded-2xl bg-primary-900 flex items-center justify-center shadow-soft">
              <Scale className="w-5 h-5 text-white" />
            </span>
            <span className="text-2xl font-semibold text-slate-900 tracking-tight">LexAI</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue.</p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="shadow-soft-lg">
            <GoogleSignInButton />

            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
                Sign in
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-900 font-medium hover:underline">
            Create one free
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
