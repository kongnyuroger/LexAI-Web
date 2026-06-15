import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

export default function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}
