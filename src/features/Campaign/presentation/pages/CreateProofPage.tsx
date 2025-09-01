'use client'

import Editor from '@/components/common/organisms/Editor'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { container, TYPES } from '@/features/Common/container'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiMutation, useTranslations } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CampaignService } from '../../data/services/campaign.service'

export const CreateProofPage = () => {
  const router = useRouter()
  const params = useParams<{ id?: string }>()
  const id = params?.id ?? ''
  const { address } = useAccount()
  const t = useTranslations()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const createProofMutation = useApiMutation(
    (data: { title: string; content: string; userAddress: string }) => campaignService.createProof(String(id), data),
    {
      onSuccess: () => {
        toast.success('Proof created successfully')
        // Redirect back to campaign detail page immediately
        const url = routeConfig(RouteEnum.CampaignDetail, { id: String(id) })
        router.replace(url)
      },
      onError: (error: any) => {
        toast.error('Failed to create proof', { description: error?.message })
      },
    },
  )

  const onSubmit = () => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    createProofMutation.mutate({ title: title.trim(), content: content.trim(), userAddress: address })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Icons.clipboardList className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Create New Proof</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter proof title" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content</label>
              <Editor value={content} onChange={setContent} className="min-h-[300px]" />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-muted-foreground/20 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-200"
              >
                {t('Back')}
              </Button>
              <Button
                onClick={onSubmit}
                disabled={createProofMutation.isPending}
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 font-medium">
                  {createProofMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('Creating...')}
                    </div>
                  ) : (
                    t('Create Proof')
                  )}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateProofPage
