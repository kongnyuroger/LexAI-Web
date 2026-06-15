import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FileText,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Calendar,
  Users,
  DollarSign,
  ClipboardList,
  Target,
  ArrowLeft,
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
  RiskBadge,
  Spinner,
  SkeletonCard,
  Skeleton,
} from '@/components/ui'
import { getDocument } from '@/lib/documentsApi'
import { triggerAnalysis, getAnalysis } from '@/lib/analysisApi'
import { useToast } from '@/contexts/ToastContext'
import { formatDate } from '@/lib/dateUtils'
import type { DocumentAnalysis, RiskFlag, RiskSeverity } from '@/types'
import { cn } from '@/lib/utils'

// ── Summary card ─────────────────────────────────────────────────────────────

function SummarySection({ summary }: { summary: DocumentAnalysis['summary'] }) {
  const sections = [
    { icon: Target, label: 'Purpose', items: [summary.purpose] },
    { icon: Users, label: 'Main parties', items: summary.mainParties },
    { icon: Calendar, label: 'Important dates', items: summary.importantDates },
    { icon: DollarSign, label: 'Money involved', items: summary.moneyInvolved },
    { icon: ClipboardList, label: 'Responsibilities', items: summary.responsibilities },
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Document summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-5">
          {sections.map(({ icon: Icon, label, items }) => {
            if (!items || items.length === 0) return null
            return (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {label}
                  </p>
                </div>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      {items.length > 1 && <span className="text-slate-400 mr-1">·</span>}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Risk flag card ────────────────────────────────────────────────────────────

const riskBorderColors: Record<RiskSeverity, string> = {
  HIGH: 'border-l-red-400',
  MEDIUM: 'border-l-amber-400',
  LOW: 'border-l-green-400',
}

function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 border-l-4',
        riskBorderColors[flag.severity]
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <RiskBadge severity={flag.severity} />
        {flag.category && (
          <span className="text-xs text-slate-400 font-medium">{flag.category}</span>
        )}
      </div>

      {/* Clause text */}
      <blockquote className="border-l-2 border-slate-200 pl-3 mb-3 text-sm text-slate-600 italic leading-relaxed">
        "{flag.clauseText}"
      </blockquote>

      {/* Plain-language explanation */}
      <p className="text-sm text-slate-700 leading-relaxed">{flag.explanation}</p>
    </div>
  )
}

// ── Risk flags section ────────────────────────────────────────────────────────

const SEVERITY_ORDER: RiskSeverity[] = ['HIGH', 'MEDIUM', 'LOW']

function RiskFlagsSection({ flags }: { flags: RiskFlag[] }) {
  const sorted = [...flags].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  )

  const counts = flags.reduce(
    (acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] ?? 0) + 1 }),
    {} as Record<RiskSeverity, number>
  )

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Risk flags</CardTitle>
          <div className="flex gap-2">
            {(['HIGH', 'MEDIUM', 'LOW'] as RiskSeverity[]).map((s) =>
              counts[s] ? (
                <span key={s} className="flex items-center gap-1">
                  <RiskBadge severity={s} />
                  <span className="text-xs text-slate-500">×{counts[s]}</span>
                </span>
              ) : null
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            No risk flags were identified in this document.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((flag) => (
              <RiskFlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Analyze button / in-progress state ───────────────────────────────────────

function AnalyzePrompt({
  documentId,
  onSuccess,
}: {
  documentId: string
  onSuccess: () => void
}) {
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => triggerAnalysis(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis', documentId] })
      queryClient.invalidateQueries({ queryKey: ['document', documentId] })
      onSuccess()
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message ?? 'Analysis failed. Please try again.'
      toastError('Analysis failed', msg)
    },
  })

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col items-center py-10 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E4D8C]/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#1E4D8C]" />
          </div>
          {isPending ? (
            <>
              <Spinner size="md" className="text-[#1E4D8C]" />
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Reading through your document…
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  This usually takes 10–30 seconds. You can stay on this page.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-base font-semibold text-slate-900">Ready to analyse</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  LexAI will produce a plain-English summary and highlight any clauses worth
                  knowing about.
                </p>
              </div>
              <Button onClick={() => mutate()}>Analyse this document</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-64" />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

// ── Failed state ──────────────────────────────────────────────────────────────

function FailedState({ documentId }: { documentId: string }) {
  const navigate = useNavigate()
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => triggerAnalysis(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] })
      queryClient.invalidateQueries({ queryKey: ['analysis', documentId] })
    },
    onError: () => toastError('Analysis failed', 'Please try again.'),
  })

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col items-center py-10 text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">Analysis failed</p>
            <p className="text-sm text-slate-500 mt-1">
              Something went wrong while reading your document. This is usually temporary.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </Button>
            <Button loading={isPending} onClick={() => mutate()}>
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Document Detail Page ──────────────────────────────────────────────────────

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [analysisTriggered, setAnalysisTriggered] = useState(false)

  const docQuery = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll while the document is being processed
      const status = query.state.data?.status
      return status === 'UPLOADED' || status === 'TEXT_EXTRACTED' ? 3000 : false
    },
  })

  const analysisQuery = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => getAnalysis(id!),
    enabled: !!id && (docQuery.data?.status === 'ANALYZED' || analysisTriggered),
    retry: false,
  })

  const doc = docQuery.data
  const analysis = analysisQuery.data

  if (docQuery.isLoading) return <DetailSkeleton />

  if (docQuery.isError || !doc) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-700 font-medium">Document not found</p>
        <Link to="/dashboard" className="text-sm text-[#1E4D8C] hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Document header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">{doc.filename}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <StatusBadge status={doc.status} />
            <span className="text-xs text-slate-400">Uploaded {formatDate(doc.createdAt)}</span>
          </div>
        </div>

        {/* Chat link — always visible once document exists */}
        <Link
          to={`/documents/${id}/chat`}
          className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Ask questions</span>
        </Link>
      </div>

      {/* Failed */}
      {doc.status === 'FAILED' && <FailedState documentId={id!} />}

      {/* Not yet analysed */}
      {(doc.status === 'UPLOADED' || doc.status === 'TEXT_EXTRACTED') && (
        <AnalyzePrompt documentId={id!} onSuccess={() => setAnalysisTriggered(true)} />
      )}

      {/* Analysis loading */}
      {analysisQuery.isLoading && <SkeletonCard />}

      {/* Analysis result */}
      {analysis && (
        <>
          <SummarySection summary={analysis.summary} />
          <RiskFlagsSection flags={analysis.riskFlags} />
        </>
      )}
    </div>
  )
}
