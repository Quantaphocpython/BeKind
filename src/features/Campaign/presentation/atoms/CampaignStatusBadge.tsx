'use client'

import { Badge } from '@/components/ui/badge'

interface CampaignStatusBadgeProps {
  status: 'active' | 'completed' | 'closed'
  className?: string
}

export const CampaignStatusBadge = ({ status, className }: CampaignStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
        }
      case 'completed':
        return {
          label: 'Completed',
          className:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
        }
      case 'closed':
        return {
          label: 'Closed',
          className:
            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700',
        }
    }
  }

  const config = getStatusConfig()

  return <Badge className={`${config.className} ${className || ''}`}>{config.label}</Badge>
}
