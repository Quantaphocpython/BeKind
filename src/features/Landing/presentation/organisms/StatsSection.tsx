'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks'

const stats = [
  {
    id: 1,
    value: '$2.5M+',
    label: 'Total Donations',
    icon: Icons.heart,
  },
  {
    id: 2,
    value: '150+',
    label: 'Active Projects',
    icon: Icons.globe,
  },
  {
    id: 3,
    value: '50K+',
    label: 'People Helped',
    icon: Icons.users,
  },
  {
    id: 4,
    value: '99.9%',
    label: 'Transparency Rate',
    icon: Icons.shield,
  },
]

export default function StatsSection() {
  const t = useTranslations()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-muted-foreground">
            {t('Trusted by')} <span className="font-semibold">500+</span> {t('organizations worldwide')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon as React.ComponentType<{ className?: string }>
            return (
              <div key={stat.id} className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{t(stat.label)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
