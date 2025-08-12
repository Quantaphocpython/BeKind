'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from '@/shared/hooks'

export default function NewsletterSection() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('Newsletter')}</h2>
          <p className="text-lg mb-8 opacity-90">{t('Stay updated with our latest projects and impact stories')}</p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder={t('Email')} className="flex-1" />
            <Button variant="secondary" className="whitespace-nowrap">
              {t('Subscribe')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
