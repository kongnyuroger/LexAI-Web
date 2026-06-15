import { Link } from 'react-router-dom'
import {
  Scale,
  Upload,
  FileSearch,
  ShieldAlert,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  FileText,
  Zap,
  Lock,
} from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'

// ── Nav ────────────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#1E4D8C]" />
          <span className="font-bold text-[#1E4D8C] text-lg">LexAI</span>
        </div>

        <nav aria-label="Site navigation" className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  )
}

// ── Hero ────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#1E4D8C]/5 via-white to-blue-50 py-20 md:py-32 px-4">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-[#1E4D8C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#1E4D8C]/10 text-[#1E4D8C] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          AI-powered legal document analysis
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Understand any contract{' '}
          <span className="text-[#1E4D8C]">before you sign it</span>
          {' '}— in plain language, in minutes.
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a legal document and LexAI will explain what it means, flag the risky clauses,
          and answer your questions in plain English. No legal jargon. No surprises.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-base font-semibold bg-[#1E4D8C] text-white hover:bg-[#173d70] transition-colors shadow-lg shadow-[#1E4D8C]/20"
          >
            Analyse my document free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl text-base font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Sign in
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Free to start · No credit card required · 3 documents per month
        </p>
      </div>
    </section>
  )
}

// ── How it works ──────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: Upload,
    step: '1',
    title: 'Upload your document',
    description:
      'Drag and drop a PDF, DOCX, or scanned image — any contract, lease, NDA, or legal letter.',
  },
  {
    icon: FileSearch,
    step: '2',
    title: 'Get a plain-English summary',
    description:
      'LexAI reads the document and produces a clear summary: purpose, parties, key dates, money, and your obligations.',
  },
  {
    icon: ShieldAlert,
    step: '3',
    title: 'See the risks flagged',
    description:
      'Every clause that could affect you is highlighted and rated High, Medium, or Low — with a plain-language explanation of why.',
  },
  {
    icon: MessageSquare,
    step: '4',
    title: 'Ask follow-up questions',
    description:
      'Not sure about a specific clause? Ask LexAI in your own words. It will answer based on the actual document.',
  },
]

function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            How it works
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From upload to insight in under a minute.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="flex flex-col items-start gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[#1E4D8C]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#1E4D8C]" aria-hidden="true" />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1E4D8C] text-white text-xs font-bold flex items-center justify-center"
                >
                  {step}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── What we check for ─────────────────────────────────────────────────────────

const RISK_ITEMS = [
  'Automatic renewal clauses that are easy to miss',
  'Unusual termination fees or penalties',
  'One-sided limitation of liability clauses',
  'Overly broad intellectual property assignments',
  'Vague or unreasonable non-compete restrictions',
  'Missing refund or cancellation rights',
  'Unclear dispute resolution or jurisdiction terms',
  'Unfavourable payment or interest-rate terms',
]

function WhatWeCheck() {
  return (
    <section className="py-20 px-4 bg-slate-50" aria-labelledby="risk-detection-heading">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              Risk detection
            </div>
            <h2 id="risk-detection-heading" className="text-3xl font-bold text-slate-900 mb-4">
              What LexAI checks for
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Most people sign contracts without reading the fine print. LexAI is trained to spot
              the clauses that matter most — the ones that are often buried in legal language
              deliberately designed to be overlooked.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1E4D8C] hover:underline"
            >
              Try it on your document
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ul className="space-y-3" aria-label="Types of risk LexAI detects">
            {RISK_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 text-[#1E4D8C] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── Trust / disclaimer ────────────────────────────────────────────────────────

function TrustSection() {
  return (
    <section
      className="py-16 px-4 bg-white border-t border-slate-100"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-7 h-7 text-amber-600" aria-hidden="true" />
        </div>

        <h2 id="trust-heading" className="text-2xl font-bold text-slate-900 mb-3">
          General information, not legal advice
        </h2>

        <p className="text-slate-500 leading-relaxed mb-8">
          LexAI helps you understand what a document says — in language you can actually follow.
          It is not a law firm and does not provide legal advice. For matters with significant
          financial, employment, or legal consequences, we recommend consulting a qualified
          solicitor or lawyer who can advise on your specific situation.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: FileText,
              title: 'Document-based answers',
              body: 'All responses are grounded in the actual text of your document — not general legal knowledge.',
            },
            {
              icon: Lock,
              title: 'Your data stays private',
              body: 'Documents are processed securely and are never shared with third parties or used to train AI models.',
            },
            {
              icon: ShieldCheck,
              title: 'Designed to reduce anxiety',
              body: 'Legal documents should not be intimidating. LexAI translates complexity into clarity.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <Icon className="w-5 h-5 text-[#1E4D8C] mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-[#1E4D8C]" aria-labelledby="cta-heading">
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to understand your contract?
        </h2>
        <p className="text-blue-200 text-lg mb-8">
          Upload your first document free. No credit card, no commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-base font-semibold bg-white text-[#1E4D8C] hover:bg-blue-50 transition-colors"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl text-base font-medium border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNav />
      <main>
        <Hero />
        <HowItWorks />
        <WhatWeCheck />
        <TrustSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  )
}
