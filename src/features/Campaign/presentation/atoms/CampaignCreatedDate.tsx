'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks/useTranslations'

interface CampaignCreatedDateProps {
  createdAt: string
  className?: string
}

export const CampaignCreatedDate = ({ createdAt, className }: CampaignCreatedDateProps) => {
  const t = useTranslations()
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Icons.calendarDays className="h-4 w-4 text-primary" />
      <span className="text-sm text-muted-foreground">
        {t('Created on')}{' '}
        <span className="font-medium text-foreground">
          {new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </span>
    </div>
  )
}
