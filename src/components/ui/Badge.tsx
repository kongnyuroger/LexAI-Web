import { cn } from '@/lib/utils'
import type { RiskSeverity } from '@/types'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'
  | 'risk-high' | 'risk-medium' | 'risk-low'
  | 'status-uploaded' | 'status-processing' | 'status-analyzed' | 'status-failed'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  muted: 'bg-slate-50 text-slate-500 border border-slate-200',
  // Risk severity — meets WCAG AA contrast on their respective backgrounds
  'risk-high': 'bg-red-50 text-red-700 border border-red-200',
  'risk-medium': 'bg-amber-50 text-amber-700 border border-amber-200',
  'risk-low': 'bg-green-50 text-green-700 border border-green-200',
  // Document status
  'status-uploaded': 'bg-slate-100 text-slate-600 border border-slate-200',
  'status-processing': 'bg-blue-50 text-blue-700 border border-blue-200',
  'status-analyzed': 'bg-green-50 text-green-700 border border-green-200',
  'status-failed': 'bg-red-50 text-red-700 border border-red-200',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Convenience: derive the correct Badge variant from a RiskSeverity string */
export function RiskBadge({ severity }: { severity: RiskSeverity }) {
  const labels: Record<RiskSeverity, string> = {
    HIGH: 'High risk',
    MEDIUM: 'Medium risk',
    LOW: 'Low risk',
  }
  return (
    <Badge variant={`risk-${severity.toLowerCase()}` as BadgeVariant}>
      {labels[severity]}
    </Badge>
  )
}

/** Convenience: derive Badge variant from a document status string */
export function StatusBadge({
  status,
}: {
  status: 'UPLOADED' | 'TEXT_EXTRACTED' | 'ANALYZED' | 'FAILED'
}) {
  const map: Record<typeof status, { variant: BadgeVariant; label: string }> = {
    UPLOADED: { variant: 'status-uploaded', label: 'Uploaded' },
    TEXT_EXTRACTED: { variant: 'status-processing', label: 'Processing' },
    ANALYZED: { variant: 'status-analyzed', label: 'Analyzed' },
    FAILED: { variant: 'status-failed', label: 'Failed' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export default Badge
