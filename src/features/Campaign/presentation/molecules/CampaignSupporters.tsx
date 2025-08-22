'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { SupporterCard } from './SupporterCard'

interface CampaignSupportersProps {
  supporters: VoteDto[]
}

export const CampaignSupporters = ({ supporters }: CampaignSupportersProps) => {
  const t = useTranslations()
  const totalEth = supporters.filter((s) => s.amount).reduce((sum, s) => sum + parseFloat(s.amount || '0'), 0)

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 min-h-[600px] overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <CardHeader className="pb-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <Icons.users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                {t('Campaign Supporters')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{t('People who have supported this campaign')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-center sm:text-right p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-xs text-muted-foreground font-medium">{t('Total Supporters')}</p>
              <p className="text-2xl font-bold text-primary">
                {supporters.length} {supporters.length !== 1 ? t('supporters') : t('supporter')}
              </p>
              {supporters.some((s) => s.amount) && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {totalEth.toFixed(4)} {t('ETH total')}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {supporters.map((supporter: VoteDto) => (
            <SupporterCard key={supporter.id} supporter={supporter} />
          ))}
          {supporters.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
              <Icons.users className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t('No supporters yet')}</p>
              <p className="text-xs text-muted-foreground">{t('Be the first to support this campaign!')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
