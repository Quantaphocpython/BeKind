'use client'

import Editor from '@/components/common/organisms/Editor'
import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProofDto } from '@/features/Campaign/data/dto/proof.dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiMutation, useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { routeConfig } from '@/shared/utils/route'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CampaignContentLayout } from './CampaignContentLayout'

interface ProofSectionProps {
  campaignId: string
  campaignOwner: string
  className?: string
}

export const ProofSection = ({ campaignId, campaignOwner, className }: ProofSectionProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const isOwner = address?.toLowerCase() === campaignOwner.toLowerCase()

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const {
    data: proofsResponse,
    isLoading,
    refetch,
  } = useApiQuery<ProofDto[]>(['campaign-proofs', campaignId], () => campaignService.getCampaignProofs(campaignId), {
    select: (res) => res.data,
  })

  const createProofMutation = useApiMutation(
    (data: { title: string; content: string; userAddress: string }) => campaignService.createProof(campaignId, data),
    {
      onSuccess: () => {
        toast.success(t('Proof created successfully'))
        setIsCreateDialogOpen(false)
        setTitle('')
        setContent('')
        refetch()
      },
      onError: (error) => {
        toast.error(t('Failed to create proof'), { description: error.message })
      },
    },
  )

  const handleCreateProof = () => {
    if (!address) {
      toast.error(t('Please connect your wallet'))
      return
    }

    if (!title.trim() || !content.trim()) {
      toast.error(t('Please fill in all fields'))
      return
    }

    createProofMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      userAddress: address,
    })
  }

  const proofs = proofsResponse || []

  return (
    <div className={className}>
      <CampaignContentLayout
        icon={<Icons.clipboardList className="h-6 w-6" />}
        title={t('Proofs & Updates')}
        description={t('Campaign owner shares progress and proof of work')}
        metric={{
          label: t('Total Proofs'),
          value: `${proofs?.length || 0} ${(proofs?.length || 0) === 1 ? t('proof') : t('proofs')}`,
        }}
        actions={
          isOwner ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = routeConfig(RouteEnum.CampaignProofCreate, { id: campaignId })
                router.push(url)
              }}
              className="group relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 text-primary hover:from-primary/10 hover:to-primary/15 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icons.plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              <span className="relative z-10 font-medium">{t('Add Proof')}</span>
            </Button>
          ) : undefined
        }
      >
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : proofs.length > 0 ? (
          <div className="space-y-4">
            {proofs.map((proof: ProofDto) => (
              <Card key={proof.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={generateUserAvatarSync(proof.user?.address || proof.userId)} alt="User" />
                        <AvatarFallback className="text-xs">
                          {(proof.user?.name || 'U').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{proof.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {proof.user?.name || getShortAddress(proof.user?.address || proof.userId)} •{' '}
                          {new Date(proof.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ParsedContent htmlContent={proof.content} className="prose prose-sm max-w-none dark:prose-invert" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {isOwner
                  ? t('No proofs yet. Create your first proof to show campaign progress.')
                  : t('No proofs available yet.')}
              </p>
            </CardContent>
          </Card>
        )}
      </CampaignContentLayout>

      {/* Create Proof Dialog */}
      {isOwner && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('Create New Proof')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('Title')}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('Enter proof title...')}
                />
              </div>
              <div>
                <Label>{t('Content')}</Label>
                <Editor value={content} onChange={setContent} className="min-h-[300px]" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('Cancel')}
                </Button>
                <Button onClick={handleCreateProof} disabled={createProofMutation.isPending}>
                  {createProofMutation.isPending ? t('Creating...') : t('Create Proof')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
