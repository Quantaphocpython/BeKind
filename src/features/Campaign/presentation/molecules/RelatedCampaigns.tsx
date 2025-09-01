'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiQuery, useTranslations } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { formatEther } from 'viem'

interface RelatedCampaignsProps {
  currentCampaignId: string
}

export const RelatedCampaigns = ({ currentCampaignId }: RelatedCampaignsProps) => {
  const router = useRouter()
  const t = useTranslations()

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const { data: relatedCampaignsResponse, isLoading } = useApiQuery<CampaignDto[]>(
    ['related-campaigns', currentCampaignId],
    () => campaignService.getRelatedCampaigns(currentCampaignId, 3),
    {
      enabled: Boolean(currentCampaignId),
      select: (res) => res.data,
    },
  )

  const relatedCampaigns = relatedCampaignsResponse || []

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t('Related Campaigns')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (relatedCampaigns.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t('Related Campaigns')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No related campaigns found.</p>
        </CardContent>
      </Card>
    )
  }

  const handleCampaignClick = (campaignId: string) => {
    const url = routeConfig(RouteEnum.CampaignDetail, { id: campaignId })
    router.push(url)
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-4 flex items-center gap-2">
        <Icons.shapes className="w-6 h-6 text-primary" />
        <CardTitle className="text-xl">{t('Related Campaigns')}</CardTitle>
      </CardHeader>

      <CardContent className="">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedCampaigns.map((campaign) => {
            const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
            const balanceInEth = Number.parseFloat(formatEther(BigInt(campaign.balance)))
            const progress = Math.min((balanceInEth / goalInEth) * 100, 100)
            const status = !campaign.isExist ? 'Closed' : progress >= 100 ? 'Completed' : 'Active'

            const getStatusColor = (status: string) => {
              switch (status) {
                case 'Active':
                  return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                case 'Completed':
                  return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                case 'Closed':
                  return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                default:
                  return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
              }
            }

            return (
              <div
                key={campaign.id}
                className="group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.02]"
                onClick={() => handleCampaignClick(campaign.campaignId)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative p-6 bg-muted">
                  <div className="relative mb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="relative overflow-hidden transition-all duration-300 rounded-xl ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600">
                          <Image
                            src={campaign.coverImage || '/placeholder.svg?height=96&width=96&query=campaign'}
                            alt={campaign.title}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover group-hover:scale-110 transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          className={`text-xs px-3 py-1.5 font-semibold shadow-lg ${getStatusColor(status)} border-0`}
                        >
                          {t(status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                        {campaign.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <div className="relative flex-shrink-0">
                        <Avatar className="size-8 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-300">
                          <AvatarImage
                            src={generateUserAvatarSync(campaign.ownerUser?.address || campaign.owner)}
                            alt="Owner"
                          />
                          <AvatarFallback className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            OW
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate block">
                          {campaign.ownerUser?.name || getShortAddress(campaign.owner)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {progress.toFixed(1)}% {t('funded')}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {balanceInEth.toFixed(2)} ETH
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {t('of')} {goalInEth.toFixed(2)} ETH
                          </div>
                        </div>
                      </div>

                      <div className="relative pt-1">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-2.5 rounded-full bg-primary transition-all duration-500 ease-out relative overflow-hidden"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
