import { publicSocket } from '@/configs/socket'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useTranslations } from './useTranslations'

interface UseCampaignRealtimeProps {
  campaignId: string
  enabled?: boolean
}

export const useCampaignRealtime = ({ campaignId, enabled = true }: UseCampaignRealtimeProps) => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const eventHandlers = useRef<{ [key: string]: () => void }>({})

  useEffect(() => {
    if (!enabled || !campaignId) return

    // Join campaign room
    publicSocket.Socket.emit('join-campaign', { campaignId })

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

    // Handle new comment
    const handleNewComment = (data: {
      campaignId: string
      comment: {
        id: string
        userId: string
        content: string
        parentId?: string
        createdAt: string
        user?: {
          id: string
          address: string
          name?: string
        }
      }
    }) => {
      if (data.campaignId === campaignId) {
        // Invalidate comments
        queryClient.invalidateQueries({ queryKey: ['campaign-comments', campaignId] })

        // Show toast notification
        const userName = data.comment.user?.name || data.comment.userId.slice(0, 6) + '...'
        toast.success(t('New comment!'), {
          description: `${userName}: ${data.comment.content.slice(0, 50)}${data.comment.content.length > 50 ? '...' : ''}`,
        })
      }
    }

    // Handle campaign status change
    const handleStatusChange = (data: { campaignId: string; status: string }) => {
      if (data.campaignId === campaignId) {
        // Invalidate campaign data
        queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })

        // Show toast notification
        toast.info(t('Campaign status changed to {status}', { status: data.status }), {
          description: t('The campaign status has been updated'),
        })
      }
    }

    // Register event listeners
    publicSocket.on('new-donation', handleNewDonation)
    publicSocket.on('balance-update', handleBalanceUpdate)
    publicSocket.on('new-comment', handleNewComment)
    publicSocket.on('campaign-status-change', handleStatusChange)

    // Store handlers for cleanup
    eventHandlers.current = {
      'new-donation': () => publicSocket.off('new-donation', handleNewDonation),
      'balance-update': () => publicSocket.off('balance-update', handleBalanceUpdate),
      'new-comment': () => publicSocket.off('new-comment', handleNewComment),
      'campaign-status-change': () => publicSocket.off('campaign-status-change', handleStatusChange),
    }

    // Cleanup function
    return () => {
      // Leave campaign room
      publicSocket.Socket.emit('leave-campaign', { campaignId })

      // Remove all event listeners
      Object.values(eventHandlers.current).forEach((cleanup) => cleanup())
      eventHandlers.current = {}
    }
  }, [campaignId, enabled, queryClient, t])

  return {
    // Expose socket methods if needed
    joinCampaign: () => publicSocket.Socket.emit('join-campaign', { campaignId }),
    leaveCampaign: () => publicSocket.Socket.emit('leave-campaign', { campaignId }),
  }
}
