import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
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
  Smartphone,
} from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import { fadeUp, staggerContainer, easePremium } from '@/lib/motion'
import { WHATSAPP_LINK, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp'

// ── Nav ────────────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <header className="h-16 glass border-b border-slate-200/70 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-primary-900 flex items-center justify-center shadow-soft">
            <Scale className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">LexAI</span>
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
            className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-medium bg-primary-900 text-white shadow-soft hover:bg-primary-950 hover:shadow-glow transition-all duration-200"
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
    <section className="relative overflow-hidden bg-glow py-24 md:py-36 px-4">
      {/* Dot-grid texture, fades out toward the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-dot-grid opacity-40"
        style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-primary-900/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-primary-900/8 text-primary-900 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-full mb-8 tracking-widest"
        >
          <Zap className="w-3.5 h-3.5" />
          AI-powered legal document analysis
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-slate-900 leading-[1.02] mb-8 tracking-[-0.03em]"
        >
          Understand any contract{' '}
          <span className="text-gradient-primary">before you sign it</span>
          {' '}— in plain language, in minutes.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload a legal document and LexAI will explain what it means, flag the risky clauses,
          and answer your questions in plain English. No legal jargon. No surprises.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-xl text-base font-semibold bg-primary-900 text-white shadow-soft-lg hover:bg-primary-950 hover:shadow-glow transition-all duration-200"
          >
            Analyse my document free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-13 px-7 rounded-xl text-base font-medium border border-slate-200 text-slate-700 bg-white shadow-soft-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            Sign in
          </Link>
        </motion.div>

        <motion.p variants={fadeUp} className="text-xs text-slate-400 mt-5">
          Free to start · No credit card required · 3 documents per month
        </motion.p>
      </motion.div>
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
    <section className="py-20 md:py-28 px-4 bg-white" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            id="how-it-works-heading"
            className="font-display text-4xl md:text-5xl font-semibold text-slate-900 mb-3 tracking-tight"
          >
            How it works
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
            From upload to insight in under a minute.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
        >
          {/* Connecting line behind icons, desktop only */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] border-t border-dashed border-slate-200"
          />

          {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
            <motion.div key={step} variants={fadeUp} className="relative flex flex-col items-start gap-4">
              <div className="relative bg-white">
                <div className="w-12 h-12 rounded-2xl bg-primary-900/8 flex items-center justify-center ring-4 ring-white">
                  <Icon className="w-6 h-6 text-primary-900" aria-hidden="true" />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-900 text-white text-xs font-bold flex items-center justify-center"
                >
                  {step}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1 tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
    <section className="py-20 md:py-28 px-4 bg-slate-50" aria-labelledby="risk-detection-heading">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-red-200"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Risk detection
            </motion.div>
            <motion.h2
              variants={fadeUp}
              id="risk-detection-heading"
              className="font-display text-3xl font-semibold text-slate-900 mb-4 tracking-tight"
            >
              What LexAI checks for
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-6">
              Most people sign contracts without reading the fine print. LexAI is trained to spot
              the clauses that matter most — the ones that are often buried in legal language
              deliberately designed to be overlooked.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary-900 hover:underline"
              >
                Try it on your document
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="space-y-3"
            aria-label="Types of risk LexAI detects"
          >
            {RISK_ITEMS.map((item) => (
              <motion.li key={item} variants={fadeUp} className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-soft-sm border border-slate-100">
                <CheckCircle
                  className="w-5 h-5 text-primary-900 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-slate-700">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

// ── WhatsApp bot ──────────────────────────────────────────────────────────────

function WhatsAppSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-white" aria-labelledby="whatsapp-heading">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#1a8a4a] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              No app required
            </motion.div>
            <motion.h2
              variants={fadeUp}
              id="whatsapp-heading"
              className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight"
            >
              Prefer WhatsApp? Chat with LexAI there too
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-6">
              Send your document straight to our WhatsApp number and get the same plain-language
              summary, risk flags, and follow-up Q&A — no account, no download, just a chat.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-base font-semibold text-white bg-[#25D366] shadow-soft-lg hover:bg-[#1ebd5a] transition-all duration-200"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <span className="text-sm text-slate-500 font-medium">{WHATSAPP_DISPLAY_NUMBER}</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-lg p-6 flex flex-col items-center gap-4">
              <div className="rounded-xl overflow-hidden p-2 bg-white">
                <QRCodeSVG
                  value={WHATSAPP_LINK}
                  size={180}
                  fgColor="#1a3327"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">Scan to start chatting</p>
                <p className="text-xs text-slate-500 mt-0.5">Opens WhatsApp with a message ready to send</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Trust / disclaimer ────────────────────────────────────────────────────────

function TrustSection() {
  return (
    <section
      className="py-20 px-4 bg-white border-t border-slate-100"
      aria-labelledby="trust-heading"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.div
          variants={fadeUp}
          className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5"
        >
          <ShieldCheck className="w-7 h-7 text-amber-600" aria-hidden="true" />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          id="trust-heading"
          className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight"
        >
          General information, not legal advice
        </motion.h2>

        <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-8">
          LexAI helps you understand what a document says — in language you can actually follow.
          It is not a law firm and does not provide legal advice. For matters with significant
          financial, employment, or legal consequences, we recommend consulting a qualified
          solicitor or lawyer who can advise on your specific situation.
        </motion.p>

        <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4 text-left">
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
            <div
              key={title}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-900/8 flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-primary-900" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1 tracking-tight">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 bg-primary-900" aria-labelledby="cta-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: easePremium }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <h2 id="cta-heading" className="font-display text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
          Ready to understand your contract?
        </h2>
        <p className="text-primary-200 text-lg mb-8">
          Upload your first document free. No credit card, no commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-xl text-base font-semibold bg-white text-primary-900 shadow-soft-lg hover:bg-primary-50 transition-all duration-200"
          >
            Get started free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-13 px-7 rounded-xl text-base font-medium border border-white/25 text-white hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
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
        <WhatsAppSection />
        <TrustSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  )
}
