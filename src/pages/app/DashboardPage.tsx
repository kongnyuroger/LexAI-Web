import { Link } from 'react-router-dom'
import { FileText, Upload, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { useDocuments, useUsage } from '@/hooks/useDocuments'
import { Button, Card, CardContent, EmptyState, StatusBadge, SkeletonCard, Skeleton } from '@/components/ui'
import type { LexDocument } from '@/types'
import { formatDistanceToNow } from '@/lib/dateUtils'

// ── Usage widget ────────────────────────────────────────────────────────────

function UsageWidget() {
  const { data, isLoading, isError } = useUsage()

  if (isLoading) {
    return (
      <Card className="mb-6">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-2 w-full rounded-full mb-2" />
        <Skeleton className="h-3 w-28" />
      </Card>
    )
  }

  if (isError || !data) return null

  const pct = Math.min(100, Math.round((data.used / data.limit) * 100))
  const remaining = data.limit - data.used
  const nearLimit = pct >= 80

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-700">
          {data.used} of {data.limit} document{data.limit !== 1 ? 's' : ''} used this month
        </p>
        {data.plan === 'FREE' && (
          <span className="text-xs font-medium text-[#1E4D8C] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Free plan
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% of monthly document limit used`}
        className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2"
      >
        <div
          className={`h-full rounded-full transition-all ${nearLimit ? 'bg-amber-500' : 'bg-[#1E4D8C]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {remaining > 0
            ? `${remaining} document${remaining !== 1 ? 's' : ''} remaining`
            : 'Monthly limit reached'}
        </p>
        {data.plan === 'FREE' && (
          <button
            className="text-xs font-medium text-[#1E4D8C] hover:underline"
            onClick={() => window.alert('Premium billing coming soon!')}
          >
            Upgrade to Premium →
          </button>
        )}
      </div>
    </Card>
  )
}

// ── Document card ───────────────────────────────────────────────────────────

function DocumentCard({ doc }: { doc: LexDocument }) {
  return (
    <Link to={`/documents/${doc.id}`} className="block group">
      <Card className="hover:border-[#1E4D8C]/40 hover:shadow-md transition-all duration-150">
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1E4D8C]/10 group-hover:text-[#1E4D8C] transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#1E4D8C] transition-colors">
                {doc.filename}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={doc.status} />
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(doc.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Loading skeleton ────────────────────────────────────────────────────────

function DocumentListSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

// ── Error state ─────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center py-10 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm font-medium text-slate-900">Couldn't load your documents</p>
          <p className="text-sm text-slate-500">Check your connection and try again.</p>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Dashboard ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDocuments()

  const docs = data?.data ?? []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your documents</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Upload a contract or legal document to get an instant plain-English summary.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload document
        </Link>
      </div>

      {/* Usage */}
      <UsageWidget />

      {/* Document list */}
      {isLoading && <DocumentListSkeleton />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && docs.length === 0 && (
        <Card>
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No documents yet"
            description="Upload your first legal document and LexAI will explain it in plain language, highlight risks, and answer your questions."
            action={
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload your first document
              </Link>
            }
          />
        </Card>
      )}

      {!isLoading && !isError && docs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
