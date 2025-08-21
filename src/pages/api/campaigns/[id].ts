import { container, TYPES } from '@/server/container'
import { CampaignDto } from '@/server/dto/campaign.dto'
import type { ICampaignService } from '@/server/service/interface/CampaignService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get services from DI container
  const campaignService = container.get<ICampaignService>(TYPES.CampaignService)
  const campaignMapper = container.get(TYPES.CampaignMapper) as any

  if (req.method === 'GET') {
    try {
      const { id, action } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json(HttpResponseUtil.badRequest('Campaign ID is required'))
      }

      const campaignId = BigInt(id)

      if (action === 'related') {
        // Get related campaigns
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 3
        const relatedCampaigns = await campaignService.getRelatedCampaigns(campaignId, limit)
        const relatedCampaignDtos: CampaignDto[] = relatedCampaigns.map((c) => campaignMapper.toCampaignDto(c))
        return res
          .status(200)
          .json(HttpResponseUtil.success(relatedCampaignDtos, 'Related campaigns retrieved successfully'))
      }

      if (action === 'supporters') {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 100
        try {
          const supporters = await campaignService.getSupportersFromChain(campaignId, limit)
          return res.status(200).json(HttpResponseUtil.success(supporters, 'Supporters retrieved successfully'))
        } catch (e) {
          console.error('supporters endpoint error:', e)
          console.error('Error details:', {
            message: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : undefined,
            campaignId: campaignId.toString(),
          })
          return res.status(200).json(HttpResponseUtil.success([], 'Supporters temporarily unavailable'))
        }
      }

      if (action === 'comments') {
        try {
          const comments = await campaignService.listComments(campaignId)
          const commentDtos = comments.map((c) => ({
            id: c.id,
            campaignId: c.campaignId.toString(),
            userId: c.userId,
            content: c.content,
            parentId: c.parentId,
            createdAt: c.createdAt.toISOString(),
            user: c.user
              ? {
                  id: c.user.id,
                  address: c.user.address,
                  name: c.user.name,
                  trustScore: c.user.trustScore,
                  createdAt: c.user.createdAt.toISOString(),
                }
              : undefined,
          }))
          return res.status(200).json(HttpResponseUtil.success(commentDtos, 'Comments retrieved successfully'))
        } catch (e) {
          console.error('comments endpoint error:', e)
          return res.status(500).json(HttpResponseUtil.internalServerError())
        }
      }

      // Get campaign details
      const campaign = await campaignService.getCampaignById(campaignId)

      if (!campaign) {
        return res.status(404).json(HttpResponseUtil.notFound('Campaign not found'))
      }

      const campaignDto: CampaignDto = campaignMapper.toCampaignDto(campaign)
      return res.status(200).json(HttpResponseUtil.success(campaignDto, 'Campaign retrieved successfully'))
    } catch (error) {
      console.error('Error in campaign detail API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  if (req.method === 'POST') {
    try {
      const { action } = req.query
      const { milestones, comment, userId, parentId, userAddress, amount } = req.body || {}

      if (action === 'milestones') {
        await campaignService.upsertMilestones(BigInt(String(req.query.id)), milestones || [])
        return res.status(200).json(HttpResponseUtil.success(null, 'Milestones updated'))
      }
      if (action === 'comment') {
        if (!comment || typeof comment !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('Comment content is required'))
        }
        if (!userId || typeof userId !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('User ID is required'))
        }

        const created = await campaignService.createComment({
          campaignId: BigInt(String(req.query.id)),
          userId,
          content: comment,
          parentId: parentId || undefined,
        })
        return res.status(200).json(HttpResponseUtil.success(created, 'Comment created'))
      }
      if (action === 'donated') {
        if (!userAddress || typeof userAddress !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('userAddress is required'))
        }
        let amountWei = BigInt(0)
        try {
          if (amount) amountWei = ethers.parseEther(String(amount))
        } catch (e) {
          console.warn('Invalid amount provided to donated action:', amount)
        }
        await campaignService.handleDonation(userAddress, amountWei)
        return res.status(200).json(HttpResponseUtil.success(null, 'Donation processed'))
      }

      return res.status(400).json(HttpResponseUtil.badRequest('Invalid action'))
    } catch (error) {
      console.error('Error in campaign POST API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
