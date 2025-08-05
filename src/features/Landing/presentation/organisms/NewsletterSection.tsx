'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

export default function NewsletterSection() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/20">
              <Icons.mail className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">{t('Newsletter')}</h2>
          <p className="text-xl mb-8 opacity-90">{t('Stay updated')}</p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t('Email')}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-blue-600 hover:bg-white/90">{t('Subscribe')}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
