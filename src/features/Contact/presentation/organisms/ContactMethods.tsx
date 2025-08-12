'use client'

import { useTranslations } from '@/shared/hooks'
import { CONTACT_CONSTANTS } from '../../data/constants/contact.constants'
import ContactMethodCard from '../molecules/ContactMethodCard'

export default function ContactMethods() {
  const t = useTranslations()

  return (
    <div className="space-y-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {t('Contact Information')}
        </h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t('Choose your preferred way to get in touch with us. We are here to help!')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {CONTACT_CONSTANTS.CONTACT_METHODS.map((method, index) => (
          <div
            key={method.id}
            className="transform transition-all duration-500 hover:scale-105"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <ContactMethodCard
              icon={method.icon as keyof typeof import('@/components/icons').Icons}
              title={method.title}
              value={method.value}
              description={method.description}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
