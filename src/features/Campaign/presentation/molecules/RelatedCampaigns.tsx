'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiQuery } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatEther } from 'viem'

interface RelatedCampaignsProps {
  currentCampaignId: string
}

export const RelatedCampaigns = ({ currentCampaignId }: RelatedCampaignsProps) => {
  const router = useRouter()

  const { data: relatedCampaignsResponse, isLoading } = useApiQuery<CampaignDto[]>(
    ['related-campaigns', currentCampaignId],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getRelatedCampaigns(currentCampaignId, 3)
    },
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
          <CardTitle className="text-xl">Related Campaigns</CardTitle>
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
          <CardTitle className="text-xl">Related Campaigns</CardTitle>
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
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Related Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedCampaigns.map((campaign) => {
            const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
            const balanceInEth = Number.parseFloat(formatEther(BigInt(campaign.balance)))
            const progress = Math.min((balanceInEth / goalInEth) * 100, 100)
            const status = !campaign.isExist ? 'Closed' : progress >= 100 ? 'Completed' : 'Active'

            return (
              <div
                key={campaign.id}
                className="group cursor-pointer p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                onClick={() => handleCampaignClick(campaign.campaignId)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={campaign.coverImage || '/images/hero-section.jpg'}
                      alt={campaign.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs px-2 py-1">
                      {status}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="size-5">
                        <AvatarImage
                          src={generateUserAvatarSync(campaign.ownerUser?.address || campaign.owner)}
                          alt="Owner"
                        />
                        <AvatarFallback className="text-xs">OW</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">
                        {campaign.ownerUser?.name || getShortAddress(campaign.owner)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{progress.toFixed(1)}% raised</span>
                        <span>
                          {balanceInEth.toFixed(2)} / {goalInEth.toFixed(2)} ETH
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
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
