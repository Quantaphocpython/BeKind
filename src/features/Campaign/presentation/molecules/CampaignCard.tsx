'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { routeConfig } from '@/shared/utils/route'
import { useRouter } from 'next/navigation'
import { formatEther } from 'viem'
import { CampaignStatus } from '../../data/constants'
import { CampaignDto } from '../../data/dto'

interface CampaignCardProps {
  campaign: CampaignDto
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const router = useRouter()

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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">Campaign #{campaign.campaignId}</CardTitle>
            <CardDescription className="mt-2">
              {campaign.description.length > 100
                ? `${campaign.description.substring(0, 100)}...`
                : campaign.description}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
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
              <p className="font-medium">{campaign.voteCount}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="text-sm text-muted-foreground">
            Created: {new Date(campaign.createdAt).toLocaleDateString()}
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
