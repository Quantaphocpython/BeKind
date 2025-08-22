'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation } from '@/shared/hooks'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useCampaignContractWrite } from '../../data/hooks'

interface CampaignDonateProps {
  campaignId: string
}

export const CampaignDonate = ({ campaignId }: CampaignDonateProps) => {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState<string>('0.001')

  const { execute, isLoading, isSuccess, error } = useCampaignContractWrite('donate')

  const { mutateAsync: notifyDonation, isPending: isNotifyPending } = useApiMutation<
    null,
    { userAddress: string; amount: string }
  >(
    (payload) => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.notifyDonation(String(campaignId), payload)
    },
    {
      invalidateQueries: [
        ['campaign-supporters', String(campaignId)],
        ['campaign', String(campaignId)],
      ],
      onSuccess: (data, variables) => {
        toast.success('Thank you for your donation!')
      },
      onError: (err, variables) => {
        console.error('notifyDonation error', err, variables)
        toast.error('Donation recorded but post-processing failed')
      },
    },
  )

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error('Donation failed', { description: message })
    }
  }, [error])

  useEffect(() => {
    const notifyBackend = async () => {
      if (!isSuccess || !address) return
      try {
        await notifyDonation({ userAddress: address, amount })
      } catch (e) {
        // error handled in onError
      }
    }
    notifyBackend()
  }, [isSuccess, address, campaignId, amount, notifyDonation])

  const onDonate = () => {
    try {
      if (!isConnected || !address) {
        toast.error('Please connect your wallet to donate')
        return
      }
      if (!amount || Number(amount) <= 0) {
        toast.error('Please enter a valid amount')
        return
      }
      toast.info('Confirm the donation in your wallet...')
      execute({ campaignId: BigInt(campaignId), amount })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      toast.error('Donation failed', { description: message })
    }
  }

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

      <CardContent className="px-6 text-center space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
            <Icons.heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif">Support This Campaign</h3>
          <p className="text-sm text-muted-foreground">Your donation makes a difference</p>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            step="0.01"
            min={0.01}
            className="w-full h-12 px-4 rounded-lg border bg-background"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading || isNotifyPending}
          />
          <Button
            size="lg"
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base rounded-xl border-0 relative overflow-hidden group"
            onClick={onDonate}
            disabled={isLoading || isNotifyPending}
          >
            {(isLoading || isNotifyPending) && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            <Heart className="h-5 w-5 mr-3" />
            {isLoading || isNotifyPending ? 'Donating...' : 'Donate Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
