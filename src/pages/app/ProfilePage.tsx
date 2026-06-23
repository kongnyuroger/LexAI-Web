import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  CreditCard,
  LogOut,
  Star,
  BarChart2,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Skeleton,
} from '@/components/ui'
import { getMe } from '@/lib/authApi'
import { getUsage } from '@/lib/documentsApi'
import { useAuthStore } from '@/stores/authStore'
import { fadeUp, staggerContainer } from '@/lib/motion'

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
      <span className="text-sm text-slate-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-slate-900 font-medium truncate">{value}</span>
    </div>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['usage'],
    queryFn: getUsage,
  })

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isLoading = userLoading || usageLoading
  const usagePct = usage ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Your profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account and plan.</p>
      </motion.div>

      {/* ── Account info ── */}
      <motion.div variants={fadeUp}>
        <Card className="mb-5">
          <CardHeader>
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-soft"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-lg font-semibold shrink-0 shadow-soft">
                  {isLoading ? (
                    <User className="w-5 h-5" />
                  ) : (
                    user?.fullName?.[0]?.toUpperCase() ?? <User className="w-5 h-5" />
                  )}
                </div>
              )}
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-44" />
                  </>
                ) : (
                  <>
                    <CardTitle>{user?.fullName ?? '—'}</CardTitle>
                    <p className="text-sm text-slate-500">{user?.email ?? '—'}</p>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <InfoRow icon={User} label="Full name" value={user?.fullName ?? '—'} />
                <InfoRow icon={Mail} label="Email" value={user?.email ?? '—'} />
                <InfoRow
                  icon={KeyRound}
                  label="Signed in with"
                  value={user?.authProvider === 'GOOGLE' ? 'Google' : 'Email & Password'}
                />
                <InfoRow
                  icon={CreditCard}
                  label="Member since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Plan & usage ── */}
      <motion.div variants={fadeUp}>
        <Card className="mb-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Plan & usage</CardTitle>
              {!isLoading && (
                <Badge variant={usage?.plan === 'PREMIUM' ? 'info' : 'muted'}>
                  {usage?.plan === 'PREMIUM' ? 'Premium' : 'Free plan'}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2.5">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{usage?.used ?? 0}</span> of{' '}
                    <span className="font-semibold">{usage?.limit ?? 0}</span> documents used this
                    month
                  </p>
                </div>

                {/* Progress bar */}
                {usage && (
                  <div
                    role="progressbar"
                    aria-valuenow={usagePct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${usagePct}% of monthly document limit used`}
                    className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-primary-900 rounded-full"
                    />
                  </div>
                )}

                <p className="text-sm text-slate-500">
                  {usage && usage.limit - usage.used > 0
                    ? `${usage.limit - usage.used} document${usage.limit - usage.used !== 1 ? 's' : ''} remaining this month`
                    : 'You have reached your monthly limit.'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Upgrade CTA (Free plan only) ── */}
      {!isLoading && usage?.plan === 'FREE' && (
        <motion.div variants={fadeUp}>
          <Card className="mb-5 border-primary-900/15 bg-linear-to-br from-primary-900/5 to-white">
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-900/8 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-primary-900" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-900 mb-1 tracking-tight">Upgrade to Premium</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Get unlimited document analysis, priority processing, and advanced risk
                    detection. Premium billing integration is coming soon.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.alert('Premium billing coming soon! Stay tuned.')}
                  >
                    <Star className="w-4 h-4" />
                    Coming soon — notify me
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Billing integration is planned for a future release.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Sign out ── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Sign out</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  You will be redirected to the login page.
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
