import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { easePremium } from '@/lib/motion'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Icons & styles per type ─────────────────────────────────────────────────

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; containerClass: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle,
    containerClass: 'border-green-200 bg-white',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'border-red-200 bg-white',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'border-amber-200 bg-white',
    iconClass: 'text-amber-500',
  },
  info: {
    icon: Info,
    containerClass: 'border-blue-200 bg-white',
    iconClass: 'text-blue-500',
  },
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { icon: Icon, containerClass, iconClass } = toastConfig[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: easePremium }}
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-80 rounded-2xl border shadow-soft-lg p-4',
        containerClass
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconClass)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.message && <p className="text-sm text-slate-600 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const duration = toast.duration ?? (toast.type === 'error' ? 6000 : 4000)

      setToasts((prev) => [...prev, { ...toast, id }])

      const timer = setTimeout(() => removeToast(id), duration)
      timers.current.set(id, timer)
    },
    [removeToast]
  )

  // Global 5xx handler fired by the Axios response interceptor
  useEffect(() => {
    const handler = () =>
      addToast({
        type: 'error',
        title: 'Something went wrong',
        message: 'A server error occurred. Please try again in a moment.',
      })
    window.addEventListener('lexai:server-error', handler)
    return () => window.removeEventListener('lexai:server-error', handler)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {createPortal(
        <div
          aria-label="Notifications"
          className="fixed bottom-5 right-5 z-100 flex flex-col gap-3 pointer-events-none"
        >
          <AnimatePresence>
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <ToastItem toast={toast} onRemove={removeToast} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

// ─── Hook (exported separately to satisfy react-refresh lint rules) ──────────

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')

  return {
    toast: ctx.addToast,
    dismiss: ctx.removeToast,
    success: (title: string, message?: string) => ctx.addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => ctx.addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => ctx.addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => ctx.addToast({ type: 'info', title, message }),
  }
}
