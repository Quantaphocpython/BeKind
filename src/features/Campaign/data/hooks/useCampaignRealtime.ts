import { publicSocket } from '@/configs/socket'
import { SocketEventEnum } from '@/shared/constants'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface UseCampaignRealtimeProps {
  campaignId: string
  enabled?: boolean
}

export const useCampaignRealtime = ({ campaignId, enabled = true }: UseCampaignRealtimeProps) => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const eventHandlers = useRef<{ [key: string]: () => void }>({})

  useEffect(() => {
    if (!enabled || !campaignId) {
      // Remove all event listeners
      Object.values(eventHandlers.current).forEach((cleanup) => cleanup())
      eventHandlers.current = {}
      return
    }

    // Handle new donation
    const handleNewDonation = (data: {
      campaignId: string
      donor: string
      amount: string
      transactionHash: string
      blockNumber: number
      timestamp: string
    }) => {
      if (data.campaignId === campaignId) {
        // Invalidate and refetch supporters and transactions
        queryClient.invalidateQueries({ queryKey: ['campaign-supporters', campaignId] })
        queryClient.invalidateQueries({ queryKey: ['campaign-transactions', campaignId, '50'] })
        queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })

        // Show toast notification
        toast.success(t('New donation received!'), {
          description: `${data.amount} ETH from ${data.donor.slice(0, 6)}...${data.donor.slice(-4)}`,
        })
      }
    }

    // Handle balance update
    const handleBalanceUpdate = (data: { campaignId: string; newBalance: string }) => {
      if (data.campaignId === campaignId) {
        // Invalidate campaign data to refresh balance
        queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      }
    }

    // Handle withdrawal created
    const handleWithdrawalCreated = (data: {
      campaignId: string
      amount: string
      milestoneIdx?: number
      txHash?: string
      createdAt: string
    }) => {
      if (data.campaignId === campaignId) {
        queryClient.invalidateQueries({ queryKey: ['campaign-withdrawals', campaignId] })
        queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      }
    }

    // Handle milestone released (phase completion)
    const handleMilestoneReleased = (data: { campaignId: string; milestoneIndex: number; releasedAt: string }) => {
      if (data.campaignId === campaignId) {
        queryClient.invalidateQueries({ queryKey: ['campaign-milestones', campaignId] })
      }
    }

    // Register event listeners
    publicSocket.on(SocketEventEnum.NEW_DONATION, handleNewDonation)
    publicSocket.on(SocketEventEnum.BALANCE_UPDATE, handleBalanceUpdate)
    publicSocket.on(SocketEventEnum.WITHDRAWAL_CREATED, handleWithdrawalCreated)
    publicSocket.on(SocketEventEnum.MILESTONE_RELEASED, handleMilestoneReleased)

    // Store handlers for cleanup
    eventHandlers.current = {
      [SocketEventEnum.NEW_DONATION]: () => publicSocket.off(SocketEventEnum.NEW_DONATION, handleNewDonation),
      [SocketEventEnum.BALANCE_UPDATE]: () => publicSocket.off(SocketEventEnum.BALANCE_UPDATE, handleBalanceUpdate),
      [SocketEventEnum.WITHDRAWAL_CREATED]: () =>
        publicSocket.off(SocketEventEnum.WITHDRAWAL_CREATED, handleWithdrawalCreated),
      [SocketEventEnum.MILESTONE_RELEASED]: () =>
        publicSocket.off(SocketEventEnum.MILESTONE_RELEASED, handleMilestoneReleased),
    }

    // Cleanup function
    return () => {
      // Remove all event listeners
      Object.values(eventHandlers.current).forEach((cleanup) => cleanup())
      eventHandlers.current = {}
    }
  }, [enabled, campaignId, queryClient, t])

  return {
    // Whether real-time is currently active
    isActive: enabled && !!campaignId,
  }
}
