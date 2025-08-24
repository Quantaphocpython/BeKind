'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { container, TYPES } from '@/features/Common/container'
import type { TransactionDto } from '@/server/dto/campaign.dto'
import { useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignService } from '../../data/services/campaign.service'
import { TransactionCard } from '../atoms/TransactionCard'
import { CampaignContentLayout } from './CampaignContentLayout'

interface CampaignTransactionsProps {
  campaignId: string
  className?: string
}

export const CampaignTransactions = ({ campaignId, className }: CampaignTransactionsProps) => {
  const t = useTranslations()

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useApiQuery<TransactionDto[]>(
    ['campaign-transactions', campaignId, '50'],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaignTransactions(campaignId, 50)
    },
    {
      enabled: Boolean(campaignId),
      select: (res) => res.data,
    },
  )

  const totalVolume = transactions.reduce((sum, tx) => sum + Number.parseFloat(tx.value), 0)
  const totalVolumeEth = totalVolume / 1e18

  return (
    <CampaignContentLayout
      icon={<Icons.activity className="h-6 w-6" />}
      title={t('Donation History')}
      description={t('All donation transactions for this campaign')}
      metric={{
        label: t('Total Volume'),
        value: `${totalVolumeEth.toFixed(4)} ETH`,
      }}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="border-primary/20 text-primary hover:bg-primary/10"
        >
          <Icons.chevronDown className="h-4 w-4 mr-2" />
          {t('All Donations')}
        </Button>
      }
      className={className}
    >
      {isLoading ? (
        <div className="w-full">
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
        <div className="w-f">
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
  )
}
