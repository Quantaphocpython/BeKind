'use client'

import { TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from '@/shared/hooks/useTranslations'
import React from 'react'

interface CampaignTabTriggerProps {
  value: string
  icon: React.ReactNode
  labelKey: string
  shortLabelKey: string
  badgeCount?: number
  className?: string
}

export const CampaignTabTrigger: React.FC<CampaignTabTriggerProps> = ({
  value,
  icon,
  labelKey,
  shortLabelKey,
  badgeCount,
  className = '',
}) => {
  const t = useTranslations()

  return (
    <TabsTrigger
      value={value}
      className={`flex flex-col items-center gap-2 px-4 py-3 text-xs font-medium rounded-lg bg-none! data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none data-[state=active]:border-border/50 transition-all duration-200 hover:bg-none! cursor-pointer ${className}`}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div className="relative">
        {icon}
        {badgeCount && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">{t(labelKey)}</span>
      <span className="sm:hidden">{t(shortLabelKey)}</span>
    </TabsTrigger>
  )
}
