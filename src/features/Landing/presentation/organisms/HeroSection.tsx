'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from '@/shared/hooks'
import Image from 'next/image'

export default function HeroSection() {
  const t = useTranslations()

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-section.jpg"
          alt="Charity and blockchain technology"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t('Hero Title')}
          </h1>
          <p className="mb-8 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl opacity-90">{t('Hero Subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90">
              {t('Get Started')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('Learn More')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
