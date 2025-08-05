'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const features = [
  {
    icon: Icons.shield,
    title: 'Transparency',
    description: 'Transparency Description',
  },
  {
    icon: Icons.lock,
    title: 'Security',
    description: 'Security Description',
  },
  {
    icon: Icons.trendingUp,
    title: 'Impact',
    description: 'Impact Description',
  },
  {
    icon: Icons.globe,
    title: 'Global Reach',
    description: 'Global Reach Description',
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
            Our blockchain-powered platform ensures transparency, security, and maximum impact for every donation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon as React.ComponentType<{ className?: string }>
            return (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">{t(feature.title)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(feature.description)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
