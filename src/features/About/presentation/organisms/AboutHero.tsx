'use client'

import { Icons } from '@/components/icons'
import Silk from '@/components/ui/silk-background'
import { useTranslations } from '@/shared/hooks'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'

export default function AboutHero() {
  const t = useTranslations()

  return (
    <section className={cn(`relative py-24 overflow-hidden h-[calc(100vh-var(--header-height))]`)}>
      {/* Silk Background */}
      <div className="absolute inset-0">
        <Silk color="#F472B6" speed={5} scale={1} noiseIntensity={1.5} rotation={0} className="w-full h-full" />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8 border border-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Icons.heart className="h-4 w-4" />
            <span>{t('BeKind')}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t('About BeKind')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12 drop-shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t(
              'We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.',
            )}
          </motion.p>

          {/* Platform Features - More Meaningful Metrics */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">100%</div>
              <div className="text-sm text-white/80">{t('Transparency')}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">24/7</div>
              <div className="text-sm text-white/80">{t('Support')}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">0%</div>
              <div className="text-sm text-white/80">{t('Fees')}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
