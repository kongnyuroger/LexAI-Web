import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { register as registerUser, login } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'
import { tokenStorage } from '@/lib/api'
import { getMe } from '@/lib/authApi'
import { fadeUp, staggerContainer } from '@/lib/motion'

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters).'),
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { error: toastError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      // Auto-login after successful registration
      const tokens = await login({ email: values.email, password: values.password })
      tokenStorage.set(tokens)
      const user = await getMe()
      setUser(user)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Could not create your account. Please try again.'
      toastError('Registration failed', msg)
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
          <h1 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm text-center">
            Free to start — no credit card required.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="shadow-soft-lg">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                required
                error={errors.fullName?.message}
                {...register('fullName')}
              />

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
                autoComplete="new-password"
                placeholder="••••••••"
                required
                hint="At least 8 characters, one uppercase letter, and one number."
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
                Create account
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 text-center text-xs text-slate-400 leading-relaxed">
          By creating an account you agree that LexAI provides general information, not legal
          advice. Consult a qualified lawyer for complex legal matters.
        </motion.p>

        <motion.p variants={fadeUp} className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-900 font-medium hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
