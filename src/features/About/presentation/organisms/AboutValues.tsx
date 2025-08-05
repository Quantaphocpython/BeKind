'use client'

import { useTranslations } from 'next-intl'
import { ABOUT_CONSTANTS } from '../../data/constants/about.constants'
import ValueCard from '../molecules/ValueCard'

export default function AboutValues() {
  const t = useTranslations()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Our Values')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('Our Values Description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ABOUT_CONSTANTS.VALUES.map((value) => (
            <ValueCard
              key={value.id}
              icon={value.icon as keyof typeof import('@/components/icons').Icons}
              title={t(value.title)}
              description={t(value.description)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
