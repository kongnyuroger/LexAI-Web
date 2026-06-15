import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Upload, FileText, X, ShieldCheck, AlertCircle } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { uploadDocument } from '@/lib/uploadApi'
import { cn } from '@/lib/utils'

// ── Validation ──────────────────────────────────────────────────────────────

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
}
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES[file.type]) {
    return `Unsupported file type. Please upload a PDF, JPG, PNG, or DOCX file.`
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`
  }
  return null
}

// ── Drop zone ────────────────────────────────────────────────────────────────

interface DropZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

function DropZone({ onFile, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) onFile(file)
    },
    [disabled, onFile]
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    // Reset so the same file can be re-selected after an error
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Drop zone: drag and drop a file here, or click to browse"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) inputRef.current?.click()
      }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4',
        'border-2 border-dashed rounded-2xl p-12 text-center',
        'transition-colors duration-150 cursor-pointer',
        isDragging
          ? 'border-[#1E4D8C] bg-blue-50'
          : 'border-slate-300 bg-slate-50 hover:border-[#1E4D8C]/50 hover:bg-blue-50/30',
        disabled && 'pointer-events-none opacity-60'
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#1E4D8C]/10 flex items-center justify-center">
        <Upload className="w-7 h-7 text-[#1E4D8C]" />
      </div>

      <div>
        <p className="text-base font-semibold text-slate-900">
          {isDragging ? 'Drop your file here' : 'Drag & drop your document here'}
        </p>
        <p className="text-sm text-slate-500 mt-1">or click to browse your files</p>
      </div>

      <p className="text-xs text-slate-400">
        Supported: PDF, DOCX, JPG, PNG &middot; Max 10 MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

// ── Selected file preview ────────────────────────────────────────────────────

function FilePreview({
  file,
  error,
  progress,
  onRemove,
}: {
  file: File
  error: string | null
  progress: number | null
  onRemove: () => void
}) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(2)

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        error ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        {error ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : (
          <FileText className="w-5 h-5 text-slate-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
        <p className="text-xs text-slate-500">{sizeMB} MB</p>

        {error && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {error}
          </p>
        )}

        {progress !== null && !error && (
          <div className="mt-2">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E4D8C] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${progress}%`}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {progress < 100 ? `Uploading… ${progress}%` : 'Processing…'}
            </p>
          </div>
        )}
      </div>

      {progress === null && (
        <button
          onClick={onRemove}
          aria-label="Remove selected file"
          className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ── Upload page ──────────────────────────────────────────────────────────────

export default function UploadPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { success, error: toastError } = useToast()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file)
    setSelectedFile(file)
    setValidationError(err)
    setProgress(null)
  }, [])

  const handleRemove = () => {
    setSelectedFile(null)
    setValidationError(null)
    setProgress(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || validationError) return

    setIsUploading(true)
    setProgress(0)

    try {
      const doc = await uploadDocument(selectedFile, (pct) => setProgress(pct))
      // Invalidate document list so dashboard refreshes
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      success('Document uploaded', `${doc.filename} is ready — starting analysis.`)
      navigate(`/documents/${doc.id}`)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Upload failed. Please try again.'
      toastError('Upload failed', msg)
      setProgress(null)
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Upload a document</h1>
        <p className="text-slate-500 text-sm mt-1">
          LexAI will read your document and produce a plain-English summary with risk flags.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          {!selectedFile ? (
            <DropZone onFile={handleFile} />
          ) : (
            <FilePreview
              file={selectedFile}
              error={validationError}
              progress={progress}
              onRemove={handleRemove}
            />
          )}

          {selectedFile && !isUploading && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleRemove}
                className="flex-1"
              >
                Choose a different file
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!!validationError}
                className="flex-1"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          )}

          {/* Trust message */}
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
            <ShieldCheck className="w-4 h-4 text-[#1E4D8C] mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">
              Your document is analyzed securely and is never shared with anyone. Only you can see
              your documents and analysis results.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
