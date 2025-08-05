'use client'

import { useTranslations } from '@/shared/hooks'
import { CONTACT_CONSTANTS } from '../../data/constants/contact.constants'
import ContactMethodCard from '../molecules/ContactMethodCard'

export default function ContactMethods() {
  const t = useTranslations()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">{t('Get in Touch')}</h3>
        <p className="text-muted-foreground">
          {t('We would love to hear from you. Send us a message and we will respond as soon as possible.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
