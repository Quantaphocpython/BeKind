'use client'

import { Icons } from '@/components/icons'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { useTranslations } from '@/shared/hooks'

const features = [
  {
    id: 1,
    title: 'Secure & Transparent',
    description: 'All transactions are recorded on the blockchain for complete transparency and security.',
    icon: Icons.shield,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-primary/5 to-purple-500/5',
  },
  {
    id: 2,
    title: 'Trusted Platform',
    description: 'Built on proven blockchain technology ensuring reliability and immutability.',
    icon: Icons.heart,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/5 to-emerald-500/5',
  },
  {
    id: 3,
    title: 'Global Reach',
    description: "Connect with donors from around the world to maximize your campaign's impact",
    icon: Icons.globe,
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/5 to-pink-500/5',
  },
  {
    id: 4,
    title: 'Real-time Tracking',
    description: 'Monitor your campaign progress and donations in real-time with detailed analytics.',
    icon: Icons.trendingUp,
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/5 to-red-500/5',
  },
]

export default function PlatformFeaturesSection() {
  const t = useTranslations()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedGradientText className="text-3xl md:text-4xl font-bold mb-4">
            {t('Why Choose Our Platform?')}
          </AnimatedGradientText>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('Experience the future of charitable giving with our innovative blockchain-powered platform')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon as React.ComponentType<{ className?: string }>
            return (
              <div
                key={feature.id}
                className="group relative p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{t(feature.title)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(feature.description)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
