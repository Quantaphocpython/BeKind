'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { cn } from '@/shared/utils'
import { routeConfig } from '@/shared/utils/route'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatEther } from 'viem'
import { CampaignStatus } from '../../data/constants'
import { CampaignDto } from '../../data/dto'

interface CampaignCardProps {
  campaign: CampaignDto
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const router = useRouter()
  const DEFAULT_COVER_IMAGE = '/images/hero-section.jpg'

  // Calculate progress
  const goalInEth = parseFloat(formatEther(BigInt(campaign.goal)))
  const balanceInEth = parseFloat(formatEther(BigInt(campaign.balance)))
  const progress = Math.min((balanceInEth / goalInEth) * 100, 100)

  // Determine status
  const getStatus = (): CampaignStatus => {
    if (!campaign.isExist) return CampaignStatus.CLOSED
    if (progress >= 100) return CampaignStatus.COMPLETED
    return CampaignStatus.ACTIVE
  }

  const status = getStatus()

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case CampaignStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case CampaignStatus.CLOSED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleViewCampaign = () => {
    const url = routeConfig(RouteEnum.CampaignDetail, { id: campaign.campaignId })
    router.push(url)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden pt-0">
      {/* Banner Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={campaign.coverImage || DEFAULT_COVER_IMAGE}
          alt={campaign.title || `Campaign #${campaign.campaignId}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className={cn(getStatusColor(status))}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
          <span className="text-xs px-2 py-0.5 rounded-md bg-black/50 text-white">#{campaign.campaignId}</span>
        </div>
      </div>

      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold [overflow-wrap:anywhere] line-clamp-2" title={campaign.title}>
            {campaign.title || `Campaign #${campaign.campaignId}`}
          </CardTitle>
          <CardDescription className="mt-1">
            <ParsedContent
              className="overflow-hidden"
              contentClassName="line-clamp-3 [overflow-wrap:anywhere] max-w-full"
              htmlContent={campaign.description}
            />
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="space-y-4">
          {/* Progress Section */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Amount Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Goal</p>
              <p className="text-lg font-semibold">{goalInEth.toFixed(3)} ETH</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Raised</p>
              <p className="text-lg font-semibold text-green-600">{balanceInEth.toFixed(3)} ETH</p>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-medium truncate">
                {campaign.ownerUser?.name || `${campaign.owner.slice(0, 6)}...${campaign.owner.slice(-4)}`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Votes</p>
              <p className="font-medium">{campaign.votes?.length || 0}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={handleViewCampaign} className="w-full">
            View Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
