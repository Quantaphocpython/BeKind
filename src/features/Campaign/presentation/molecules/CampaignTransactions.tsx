'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { container, TYPES } from '@/features/Common/container'
import type { TransactionDto } from '@/server/dto/campaign.dto'
import { useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignService } from '../../data/services/campaign.service'
import { TransactionCard } from '../atoms/TransactionCard'

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
    <Card
      className={`border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 min-h-[600px] overflow-hidden ${className || ''}`}
    >
      {/* Background gradient effect */}
      <div className="absolute bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <CardHeader className="pb-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <Icons.activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                {t('Donation History')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{t('All donation transactions for this campaign')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-center sm:text-right p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50">
              <p className="text-xs text-muted-foreground font-medium">Total Volume</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalVolumeEth.toFixed(4)} ETH</p>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-background/80 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Donations')}</SelectItem>
                <SelectItem value="recent">{t('Recent')}</SelectItem>
                <SelectItem value="highest">{t('Highest Amount')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
            <Icons.alertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load transactions.</p>
            <p className="text-xs text-muted-foreground">Please try again later.</p>
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
      </CardContent>
    </Card>
  )
}
