import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-900/8 text-primary-900">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 mb-1.5 tracking-tight">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
