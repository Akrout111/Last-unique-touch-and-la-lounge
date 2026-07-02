'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import PurpleWaves3D from './purple-waves-3d'

export default function LaLoungeView() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* High-fidelity 3D Wires Background */}
      <div className="absolute inset-0 z-0">
        <PurpleWaves3D />
      </div>

      {/* Floating Back Button */}
      <div className="absolute top-6 sm:top-10 start-6 sm:start-10 z-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ x: locale === 'ar' ? 4 : -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-purple-100/30 shadow-sm hover:shadow-md text-purple-800 transition-all font-medium text-xs cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span className="font-sans font-medium tracking-wide">
            {t('laLounge.back')}
          </span>
        </motion.button>
      </div>

      {/* Centered Luxury Brand Title Block */}
      <main className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-purple-950 tracking-widest drop-shadow-sm"
        >
          {t('brandSelector.lalounge.name')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
          className="mt-4 text-sm sm:text-base text-purple-700/70 font-sans tracking-wide max-w-md"
        >
          {t('laLounge.subtitle')}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-10 py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(126,34,206,0.3)] hover:shadow-[0_6px_25px_rgba(126,34,206,0.4)] transition-all cursor-pointer border border-purple-500/30"
        >
          {t('laLounge.explore')}
        </motion.button>
      </main>
    </div>
  )
}
