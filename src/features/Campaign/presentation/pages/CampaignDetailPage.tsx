'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useApiQuery } from '@/shared/hooks'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { useCampaignContractRead } from '../../data/hooks'
import { CampaignDonate } from '../atoms/CampaignDonate'
import { CampaignBanner } from '../molecules/CampaignBanner'
import { CampaignDetailSkeleton } from '../molecules/CampaignDetailSkeleton'
import { CampaignStats } from '../molecules/CampaignStats'
import { RelatedCampaigns } from '../molecules/RelatedCampaigns'

export const CampaignDetailPage = () => {
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

  const {
    data: supporters = [],
    isLoading: isLoadingSupporters,
    error: supportersError,
  } = useApiQuery<VoteDto[]>(
    ['campaign-supporters', id],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getSupporters(String(id))
    },
    {
      enabled: Boolean(id),
      select: (res) => res.data,
    },
  )

  // Read on-chain balance using the smart contract getBalance
  const { data: onchainBalance } = useCampaignContractRead('getBalance', {
    campaignId: campaign ? BigInt(String(campaign.campaignId)) : BigInt(0),
  })

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error('Error loading campaign', { description: message })
    }
  }, [error])

  if (isLoading || !campaign) return <CampaignDetailSkeleton />

  const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
  const balanceWei = (() => {
    try {
      if (typeof onchainBalance === 'bigint') return onchainBalance
      if (onchainBalance != null) return BigInt(onchainBalance as any)
      return BigInt(0)
    } catch {
      return BigInt(0)
    }
  })()
  const balanceInEth = Number.parseFloat(formatEther(balanceWei))
  const progress = Math.min((balanceInEth / goalInEth) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-7xl py-6 space-y-10">
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
          variant="compact"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between ">
          <div className="flex-1 space-y-6">
            <div className="space-y-5 rounded-2xl border bg-card p-4 shadow-sm bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm">
              {/* Created date + Share */}
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icons.calendarDays className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Created on{' '}
                    <span className="font-medium text-foreground">
                      {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </span>
                </div>
                <button
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full border bg-background hover:bg-muted transition-colors"
                  aria-label="Share campaign"
                >
                  <Icons.externalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Owner + supporters + ID */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {/* Owner */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="size-7 ring-2 ring-offset-1 ring-primary/20">
                    <AvatarImage
                      src={generateUserAvatarSync(campaign.ownerUser?.address || campaign.owner)}
                      alt="Owner"
                    />
                    <AvatarFallback>OW</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[10rem] font-medium text-foreground">
                    {campaign.ownerUser?.name || getShortAddress(campaign.owner)}
                  </span>
                </div>

                {/* Supporters */}
                <div className="flex items-center gap-2">
                  <Icons.users className="h-4 w-4 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">{supporters.length}</span> supporters
                  </span>
                </div>

                {/* Campaign ID */}
                <div className="flex items-center gap-2">
                  <Icons.hash className="h-4 w-4 text-primary" />
                  <span className="font-mono text-foreground">#{campaign.campaignId}</span>
                </div>
              </div>
            </div>

            <CampaignStats goalEth={goalInEth} raisedEth={balanceInEth} votes={supporters.length} size="default" />
          </div>

          <div className="lg:w-80 w-full">
            <CampaignDonate campaignId={campaign.campaignId} />
          </div>
        </div>

        {/* Main Content - Left Column */}
        <div className="">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="supporters">Supporters</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
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
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Supporters</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {supporters.length} supporter{supporters.length !== 1 ? 's' : ''}
                          {supporters.some((s) => s.amount) && (
                            <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                              •{' '}
                              {supporters
                                .filter((s) => s.amount)
                                .reduce((sum, s) => sum + parseFloat(s.amount || '0'), 0)
                                .toFixed(4)}{' '}
                              ETH total
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {supporters.map((v: VoteDto) => (
                          <div
                            key={v.id}
                            className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="size-10 mt-1">
                              <AvatarImage src={generateUserAvatarSync(v.userId)} alt="Supporter" />
                              <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">{getShortAddress(v.userId)}</p>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await navigator.clipboard.writeText(v.userId)
                                        toast.success('Address copied to clipboard')
                                      } catch (err) {
                                        toast.error('Failed to copy address')
                                      }
                                    }}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    title="Copy address"
                                  >
                                    📋
                                  </button>
                                </div>
                                {v.amount && (
                                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    {parseFloat(v.amount).toFixed(4)} ETH
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(v.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                                {v.transactionHash && (
                                  <div className="flex items-center gap-1">
                                    <Icons.hash className="h-3 w-3 text-muted-foreground" />
                                    <a
                                      href={`https://sepolia.etherscan.io/tx/${v.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline truncate"
                                    >
                                      {v.transactionHash.slice(0, 8)}...{v.transactionHash.slice(-6)}
                                    </a>
                                  </div>
                                )}
                                {v.blockNumber && (
                                  <p className="text-xs text-muted-foreground">Block #{v.blockNumber}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {supporters.length === 0 && <p className="text-sm text-muted-foreground">No supporters yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Sidebar - Right Column */}
              <div>
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
