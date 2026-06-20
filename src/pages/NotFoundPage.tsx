import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion'

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-glow overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-30" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative max-w-sm text-center"
      >
        <motion.div
          variants={fadeUp}
          className="w-16 h-16 rounded-2xl bg-primary-900/8 flex items-center justify-center mx-auto mb-5"
        >
          <FileQuestion className="w-8 h-8 text-primary-900" aria-hidden="true" />
        </motion.div>
        <motion.p variants={fadeUp} className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          404
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-display text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
          Page not found
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-slate-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-primary-900 text-white shadow-soft hover:bg-primary-950 hover:shadow-glow transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
