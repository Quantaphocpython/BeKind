'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { container, TYPES } from '@/features/Common/container'
import type { MilestoneDto } from '@/server/dto/campaign.dto'
import { useApiMutation, useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CampaignService } from '../../data/services/campaign.service'

interface MilestoneManagerProps {
  campaignId: string
  campaignOwner: string
  className?: string
}

export const MilestoneManager = ({ campaignId, campaignOwner, className }: MilestoneManagerProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [milestones, setMilestones] = useState<
    Array<{
      index: number
      title: string
      description: string
      percentage: number
    }>
  >([
    { index: 1, title: 'Phase 1', description: 'Initial milestone', percentage: 50 },
    { index: 2, title: 'Phase 2', description: 'Final milestone', percentage: 100 },
  ])

  const isOwner = address?.toLowerCase() === campaignOwner.toLowerCase()

  const {
    data: existingMilestones = [],
    isLoading,
    refetch,
  } = useApiQuery<MilestoneDto[]>(
    ['campaign-milestones', campaignId],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaignMilestones(campaignId)
    },
    {
      enabled: Boolean(campaignId),
      select: (res) => res.data,
    },
  )

  const createMilestonesMutation = useApiMutation(
    (data: {
      milestones: Array<{ index: number; title: string; description?: string; percentage: number }>
      userAddress: string
    }) => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.createMilestones(campaignId, data)
    },
    {
      onSuccess: () => {
        toast.success(t('Milestones created successfully'))
        setIsCreateDialogOpen(false)
        refetch()
      },
      onError: (error) => {
        toast.error(t('Failed to create milestones'), { description: error.message })
      },
    },
  )

  const handleCreateMilestones = () => {
    if (!address) {
      toast.error(t('Please connect your wallet'))
      return
    }

    if (milestones.length === 0) {
      toast.error(t('Please add at least one milestone'))
      return
    }

    // Validate percentages
    const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0)
    if (totalPercentage !== 100) {
      toast.error(t('Total percentage must equal 100%'))
      return
    }

    createMilestonesMutation.mutate({
      milestones: milestones.map((m) => ({
        index: m.index,
        title: m.title,
        description: m.description,
        percentage: m.percentage,
      })),
      userAddress: address,
    })
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        index: milestones.length + 1,
        title: `Phase ${milestones.length + 1}`,
        description: '',
        percentage: 0,
      },
    ])
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: string, value: string | number) => {
    setMilestones(milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  if (!isOwner) return null

  return (
    <>
      <Card className={`border-0 shadow-xl bg-gradient-to-br from-card to-muted/30 ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.target className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">{t('Milestones')}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <Icons.plus className="h-4 w-4 mr-2" />
              {t('Manage Milestones')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : existingMilestones.length > 0 ? (
            <div className="space-y-4">
              {existingMilestones.map((milestone) => (
                <div key={milestone.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <span className="text-sm text-muted-foreground">{milestone.percentage}%</span>
                  </div>
                  {milestone.description && <p className="text-sm text-muted-foreground">{milestone.description}</p>}
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icons.target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('No milestones set')}</p>
              <p className="text-xs text-muted-foreground">{t('Create milestones to track campaign progress')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Milestones Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('Manage Milestones')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Milestone {milestone.index}</Label>
                    {milestones.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`title-${index}`}>{t('Title')}</Label>
                    <Input
                      id={`title-${index}`}
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      placeholder={t('Enter milestone title')}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`description-${index}`}>{t('Description')}</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      placeholder={t('Enter milestone description')}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`percentage-${index}`}>{t('Percentage')} (%)</Label>
                    <Input
                      id={`percentage-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={milestone.percentage}
                      onChange={(e) => updateMilestone(index, 'percentage', Number(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addMilestone} className="w-full">
              <Icons.plus className="h-4 w-4 mr-2" />
              {t('Add Milestone')}
            </Button>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('Cancel')}
              </Button>
              <Button onClick={handleCreateMilestones} disabled={createMilestonesMutation.isPending}>
                {createMilestonesMutation.isPending ? t('Creating...') : t('Create Milestones')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
