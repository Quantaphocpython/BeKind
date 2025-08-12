'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks'

const features = [
  {
    id: 1,
    title: 'Transparency',
    description: 'Every transaction is recorded on the blockchain, ensuring complete transparency and accountability.',
    icon: Icons.shield,
  },
  {
    id: 2,
    title: 'Security',
    description: 'Advanced blockchain technology protects your donations and personal information.',
    icon: Icons.lock,
  },
  {
    id: 3,
    title: 'Impact',
    description: 'We focus on measurable outcomes and real-world impact for every donation made.',
    icon: Icons.trendingUp,
  },
  {
    id: 4,
    title: 'Global Reach',
    description: 'Support causes worldwide with instant, borderless transactions.',
    icon: Icons.globe,
  },
]

export default function FeaturesSection() {
  const t = useTranslations()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Why Choose BeKind?')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('Support meaningful causes and track the impact of your donations in real-time')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon as React.ComponentType<{ className?: string }>
            return (
              <div key={feature.id} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t(feature.title)}</h3>
                <p className="text-muted-foreground">{t(feature.description)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
