'use client'

import { useTranslations } from '@/shared/hooks'

export default function AboutHero() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t('About BeKind')}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {t(
              'We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.',
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
