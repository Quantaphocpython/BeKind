'use client'

import { Icons } from '@/components/icons'
import { container, TYPES } from '@/features/Common/container'
import type { TransactionDto } from '@/server/dto/campaign.dto'
import { useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { useMemo } from 'react'
import { CampaignService } from '../../data/services/campaign.service'
import { TransactionCard } from '../atoms/TransactionCard'
import { CampaignContentLayout } from './CampaignContentLayout'

interface CampaignTransactionsProps {
  campaignId: string
  className?: string
}

export const CampaignTransactions = ({ campaignId, className }: CampaignTransactionsProps) => {
  const t = useTranslations()

  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useApiQuery<TransactionDto[]>(
    ['campaign-transactions', campaignId, '50'],
    () => campaignService.getCampaignTransactions(campaignId, 50),
    {
      enabled: Boolean(campaignId),
      select: (res) => res.data,
    },
  )

  const totalVolume = transactions.reduce((sum, tx) => sum + Number.parseFloat(tx.value), 0)
  const totalVolumeEth = totalVolume / 1e18

  return (
    <>
      <CampaignContentLayout
        icon={<Icons.activity className="h-6 w-6" />}
        title={t('Donation History')}
        description={t('All donation transactions for this campaign')}
        metric={{
          label: t('Total Volume'),
          value: `${totalVolumeEth.toFixed(4)} ETH`,
        }}
        className={className}
      >
        {isLoading ? (
          <div className="w-full flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
            <Icons.alertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">{t('Failed to load transactions.')}</p>
            <p className="text-xs text-muted-foreground">{t('Please try again later.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
                <Icons.activity className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{t('No donations found')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Donations will appear here once the campaign receives support')}
                </p>
              </div>
            )}
          </div>
        )}
      </CampaignContentLayout>
    </>
  )
}
