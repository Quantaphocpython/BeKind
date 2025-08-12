'use client'

import { useTranslations } from '@/shared/hooks'
import { motion } from 'framer-motion'
import { ABOUT_CONSTANTS } from '../../data/constants/about.constants'
import StatCard from '../atoms/StatCard'

export default function AboutStats() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('Our Impact')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'These numbers represent the real impact we have made together with our community of donors and partners.',
            )}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {ABOUT_CONSTANTS.STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StatCard value={stat.value} label={t(stat.label)} description={stat.description} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-4 text-sm text-muted-foreground">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <span>
              {t(
                'Track the real impact of your donations with detailed reports and real-time updates on project progress.',
              )}
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
