'use client'

import { useTranslations } from '@/shared/hooks'
import { CONTACT_CONSTANTS } from '../../data/constants/contact.constants'
import ContactMethodCard from '../molecules/ContactMethodCard'

export default function ContactMethods() {
  const t = useTranslations()

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-6">{t('Contact Information')}</h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('Choose your preferred way to get in touch with us. We are here to help!')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CONTACT_CONSTANTS.CONTACT_METHODS.map((method) => (
          <ContactMethodCard
            key={method.id}
            icon={method.icon as keyof typeof import('@/components/icons').Icons}
            title={method.title}
            value={method.value}
            description={method.description}
          />
        ))}
      </div>
    </div>
  )
}
