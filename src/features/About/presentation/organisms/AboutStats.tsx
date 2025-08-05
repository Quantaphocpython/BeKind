'use client'

import { useTranslations } from '@/shared/hooks'
import { ABOUT_CONSTANTS } from '../../data/constants/about.constants'
import StatCard from '../atoms/StatCard'

export default function AboutStats() {
  const t = useTranslations()

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('Our Impact')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t(
              'These numbers represent the real impact we have made together with our community of donors and partners.',
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_CONSTANTS.STATS.map((stat) => (
            <StatCard key={stat.id} value={stat.value} label={t(stat.label)} description={stat.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
