'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { cn } from '@/shared/utils'
import { routeConfig } from '@/shared/utils/route'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatEther } from 'viem'
import { CampaignStatus } from '../../data/constants'
import type { CampaignDto } from '../../data/dto'

interface CampaignCardProps {
  campaign: CampaignDto
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const router = useRouter()
  const DEFAULT_COVER_IMAGE = '/images/hero-section.jpg'

  // Calculate progress
  const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
  const balanceInEth = Number.parseFloat(formatEther(BigInt(campaign.balance)))
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
      case CampaignStatus.COMPLETED:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
      case CampaignStatus.CLOSED:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
    }
  }

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-blue-500'
    if (progress >= 75) return 'bg-emerald-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const handleViewCampaign = () => {
    const url = routeConfig(RouteEnum.CampaignDetail, { id: campaign.campaignId })
    router.push(url)
  }

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/95 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out  backdrop-blur-sm pt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02] pointer-events-none" />

      {/* Banner Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={campaign.coverImage || DEFAULT_COVER_IMAGE}
          alt={campaign.title || `Campaign #${campaign.campaignId}`}
          fill
          className="object-cover transform-gpu will-change-transform transition-all! duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <Badge
            variant="secondary"
            className={cn('border font-medium px-3 py-1 text-xs backdrop-blur-md shadow-lg', getStatusColor(status))}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono border border-white/20">
            #{campaign.campaignId}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/90 text-sm font-medium">Progress</span>
              <span className="text-white font-semibold text-sm">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', getProgressColor())}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="space-y-3">
          <CardTitle
            className="text-xl font-bold leading-tight [overflow-wrap:anywhere] line-clamp-2 group-hover:text-primary transition-colors duration-200"
            title={campaign.title}
          >
            {campaign.title || `Campaign #${campaign.campaignId}`}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            <ParsedContent
              className="overflow-hidden"
              contentClassName="line-clamp-3 [overflow-wrap:anywhere] max-w-full text-sm"
              htmlContent={campaign.description}
            />
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-6 mt-auto">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Goal</p>
            <p className="text-2xl font-bold text-foreground">{goalInEth.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground font-medium">ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Raised</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{balanceInEth.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground font-medium">ETH</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="size-10 ring-2 ring-background shadow-md">
              <AvatarImage src={generateUserAvatarSync(campaign.ownerUser?.address || campaign.owner)} alt="Owner" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {(campaign.ownerUser?.name || 'U').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Owner</p>
              <p className="font-semibold truncate text-sm">
                {campaign.ownerUser?.name || getShortAddress(campaign.owner)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Votes</p>
            <p className="font-bold text-lg">{campaign.votes?.length || 0}</p>
          </div>
        </div>

        <Button
          onClick={handleViewCampaign}
          className="w-full h-12 font-semibold text-base cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
        >
          View Campaign Details
        </Button>
      </CardContent>
    </Card>
  )
}
