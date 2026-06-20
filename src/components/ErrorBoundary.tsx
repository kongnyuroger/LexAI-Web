import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this would be reported to an error-tracking service (e.g. Sentry)
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-semibold text-slate-900 mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-sm text-slate-500 mb-6">
            An unexpected error occurred. This has been logged and we'll look into it. You can
            try refreshing the page — your work should not be affected.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-primary-900 text-white shadow-soft hover:bg-[#173d70] hover:shadow-glow transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh page
          </button>
        </div>
      </div>
    )
  }
}
