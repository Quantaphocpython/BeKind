'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const stats = [
  {
    icon: Icons.handCoins,
    label: 'Total Donations',
    value: '$2.5M+',
    description: 'Raised through our platform',
  },
  {
    icon: Icons.users,
    label: 'Active Projects',
    value: '150+',
    description: 'Ongoing charitable projects',
  },
  {
    icon: Icons.heart,
    label: 'People Helped',
    value: '50K+',
    description: 'Lives impacted worldwide',
  },
  {
    icon: Icons.globe,
    label: 'Countries',
    value: '25+',
    description: 'Global reach and impact',
  },
]

export default function StatsSection() {
  const t = useTranslations()

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t('Trusted by')} <span className="text-primary">100+</span> {t('organizations worldwide')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-1">{t(stat.label)}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
