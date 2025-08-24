'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks/useTranslations'

interface CampaignSupporterCountProps {
  count: number
  className?: string
}

export const CampaignSupporterCount = ({ count, className }: CampaignSupporterCountProps) => {
  const t = useTranslations()
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Icons.users className="h-4 w-4 text-primary" />
      <span className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{count}</span> {t('supporters')}
      </span>
    </div>
  )
}
