'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiQuery, useTranslations } from '@/shared/hooks'
import { useMemo } from 'react'
import { formatEther } from 'viem'

interface WithdrawalHistoryCardProps {
  campaign: import('../../data/dto').CampaignDto
  className?: string
}

export const WithdrawalHistoryCard = ({ campaign, className }: WithdrawalHistoryCardProps) => {
  const t = useTranslations()

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  // Fetch withdrawal history
  const { data: withdrawals = [], isLoading } = useApiQuery<any[]>(
    ['campaign-withdrawals', campaign.campaignId],
    () => campaignService.getCampaignWithdrawals(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId),
      select: (res) => res.data,
    },
  )

  if (isLoading) {
    return (
      <Card className={`border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icons.history className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{t('Withdrawal History')}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icons.history className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{t('Withdrawal History')}</h3>
        </div>
      </CardHeader>
      <CardContent>
        {withdrawals.length > 0 ? (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-primary/20">
                      <Icons.wallet className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium">
                      {withdrawal.milestoneIdx ? `Phase ${withdrawal.milestoneIdx}` : t('Withdrawal')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {Number.parseFloat(formatEther(BigInt(withdrawal.amount))).toFixed(4)} ETH
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(withdrawal.createdAt).toLocaleDateString()} •{' '}
                  {new Date(withdrawal.createdAt).toLocaleTimeString()}
                </div>
                {withdrawal.txHash && (
                  <div className="text-xs text-muted-foreground mt-1">
                    TX: {withdrawal.txHash.slice(0, 10)}...{withdrawal.txHash.slice(-8)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icons.history className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t('No withdrawals yet')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
