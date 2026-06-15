import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Scale } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { register as registerUser, login } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'
import { tokenStorage } from '@/lib/api'
import { getMe } from '@/lib/authApi'

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="w-7 h-7 text-[#1E4D8C]" />
            <span className="text-2xl font-bold text-[#1E4D8C]">LexAI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm text-center">
            Free to start — no credit card required.
          </p>
        </div>

        <Card>
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

        <p className="mt-4 text-center text-xs text-slate-400 leading-relaxed">
          By creating an account you agree that LexAI provides general information, not legal
          advice. Consult a qualified lawyer for complex legal matters.
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1E4D8C] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
