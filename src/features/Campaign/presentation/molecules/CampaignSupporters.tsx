'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignContentHeader } from './CampaignContentHeader'
import { SupporterCard } from './SupporterCard'

interface CampaignSupportersProps {
  supporters: VoteDto[]
}

export const CampaignSupporters = ({ supporters }: CampaignSupportersProps) => {
  const t = useTranslations()
  const totalEth = supporters.filter((s) => s.amount).reduce((sum, s) => sum + parseFloat(s.amount || '0'), 0)

  return (
    <div className="space-y-6">
      <CampaignContentHeader
        icon={<Icons.users className="h-6 w-6" />}
        title={t('Campaign Supporters')}
        description={t('People who have supported this campaign')}
        metric={{
          label: t('Total Supporters'),
          value: `${supporters.length} ${supporters.length !== 1 ? t('supporters') : t('supporter')}`,
        }}
      />

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 min-h-[500px] overflow-hidden">
        <CardContent className="p-6">
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
    </div>
  )
}
