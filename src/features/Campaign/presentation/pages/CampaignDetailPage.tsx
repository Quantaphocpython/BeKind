'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiQuery } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import { CalendarDays, Heart, Users } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { CampaignBanner } from '../molecules/CampaignBanner'
import { CampaignDetailSkeleton } from '../molecules/CampaignDetailSkeleton'
import { CampaignStats } from '../molecules/CampaignStats'
import { RelatedCampaigns } from '../molecules/RelatedCampaigns'

export const CampaignDetailPage = () => {
  const router = useRouter()
  const params = useParams<{ id?: string }>()
  const id = params?.id ?? ''

  const {
    data: campaign,
    isLoading,
    error,
  } = useApiQuery<CampaignDto>(
    ['campaign', id],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaignById(String(id))
    },
    {
      enabled: Boolean(id),
      select: (res) => res.data,
    },
  )

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error('Error loading campaign', { description: message })
    }
  }, [error])

  if (isLoading || !campaign) return <CampaignDetailSkeleton />

  const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
  const balanceInEth = Number.parseFloat(formatEther(BigInt(campaign.balance)))
  const progress = Math.min((balanceInEth / goalInEth) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-7xl py-8 space-y-12">
        <CampaignBanner
          title={campaign.title}
          coverImage={campaign.coverImage}
          campaignId={campaign.campaignId}
          statusBadge={{
            label: !campaign.isExist ? 'Closed' : progress >= 100 ? 'Completed' : 'Active',
            className: !campaign.isExist
              ? 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
              : progress >= 100
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
          }}
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Created on{' '}
                    {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <button
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md border bg-transparent hover:bg-muted/50 transition-colors"
                  aria-label="Share campaign"
                >
                  <Icons.externalLink className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={generateUserAvatarSync(campaign.ownerUser?.address || campaign.owner)}
                      alt="Owner"
                    />
                    <AvatarFallback>OW</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[10rem]">
                    {campaign.ownerUser?.name || getShortAddress(campaign.owner)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{campaign.votes?.length || 0} supporters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.hash className="h-4 w-4" />
                  <span>Campaign #{campaign.campaignId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => router.push(routeConfig(RouteEnum.Campaigns))}
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </Button>
          </div>
        </div>

        <CampaignStats
          goalEth={goalInEth}
          raisedEth={balanceInEth}
          votes={campaign.votes?.length || 0}
          size="default"
        />

        {/* Main Content - Left Column */}
        <div className="">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="supporters">Supporters</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
              <div>
                <TabsContent value="description">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        Campaign Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose-lg max-w-none">
                      <ParsedContent
                        contentClassName="prose prose-lg max-w-none [overflow-wrap:anywhere] prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                        htmlContent={campaign.description}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="supporters">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Supporters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {(campaign.votes || []).map((v) => (
                          <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Avatar className="size-8">
                              <AvatarImage src={generateUserAvatarSync(v.userId)} alt="Supporter" />
                              <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{v.user?.name || v.userId}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(v.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(!campaign.votes || campaign.votes.length === 0) && (
                          <p className="text-sm text-muted-foreground">No supporters yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Sidebar - Right Column */}
              <div className="">
                <div className="sticky top-8 space-y-6">
                  <RelatedCampaigns currentCampaignId={campaign.campaignId} />
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailPage
