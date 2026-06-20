import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leadingIcon, trailingIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {leadingIcon && (
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              'w-full rounded-xl border bg-white text-slate-900 text-sm placeholder:text-slate-400',
              'px-3.5 py-2 h-11 shadow-soft-sm',
              'transition-[border-color,box-shadow] duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-900/30 focus:ring-offset-0 focus:border-primary-900',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none',
              error
                ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                : 'border-slate-200 hover:border-slate-300',
              leadingIcon && 'pl-9',
              trailingIcon && 'pr-9',
              className
            )}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
