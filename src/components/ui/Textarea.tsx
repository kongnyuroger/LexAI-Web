import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full rounded-xl border bg-white text-slate-900 text-sm placeholder:text-slate-400',
            'px-3.5 py-2.5 min-h-24 resize-y shadow-soft-sm',
            'transition-[border-color,box-shadow] duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-900/30 focus:ring-offset-0 focus:border-primary-900',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none',
            error
              ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${textareaId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
