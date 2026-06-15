import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Scale } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { login } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'
import { tokenStorage } from '@/lib/api'
import { getMe } from '@/lib/authApi'

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="w-7 h-7 text-[#1E4D8C]" />
            <span className="text-2xl font-bold text-[#1E4D8C]">LexAI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue.</p>
        </div>

        <Card>
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

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#1E4D8C] font-medium hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
