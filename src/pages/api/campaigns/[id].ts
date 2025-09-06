import { container, TYPES } from '@/server/container'
import { CampaignDto } from '@/server/dto/campaign.dto'
import type { ICampaignService } from '@/server/service/interface/CampaignService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { ethers, formatEther, parseEther } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/campaigns/{id}:
   *   get:
   *     summary: Get campaign details
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: action
   *         schema: { type: string, enum: [related, supporters, comments, milestones, withdrawals, proofs, sync] }
   *     responses:
   *       200:
   *         description: Campaign retrieved successfully
   *   post:
   *     summary: Perform campaign actions (milestones, comment, donated, withdraw, ...)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: action
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Action processed
   */
  // Get services from DI container
  const campaignService = container.get<ICampaignService>(TYPES.CampaignService)
  const userService = container.get(TYPES.UserService) as any
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

      if (action === 'milestones') {
        try {
          const milestones = await campaignService.listMilestones(campaignId)
          const milestoneDtos = milestones.map((m) => ({
            id: m.id,
            campaignId: m.campaignId.toString(),
            index: m.index,
            title: m.title,
            description: m.description,
            percentage: m.percentage,
            isReleased: m.isReleased,
            createdAt: m.createdAt.toISOString(),
          }))
          return res.status(200).json(HttpResponseUtil.success(milestoneDtos, 'Milestones retrieved successfully'))
        } catch (e) {
          console.error('milestones endpoint error:', e)
          return res.status(500).json(HttpResponseUtil.internalServerError())
        }
      }

      if (action === 'withdrawals') {
        try {
          const withdrawals = await campaignService.listWithdrawals(campaignId)
          const withdrawalDtos = withdrawals.map((w) => ({
            id: w.id,
            campaignId: w.campaignId.toString(),
            amount: w.amount.toString(),
            milestoneIdx: w.milestoneIdx,
            txHash: w.txHash,
            createdAt: w.createdAt.toISOString(),
          }))
          return res.status(200).json(HttpResponseUtil.success(withdrawalDtos, 'Withdrawals retrieved successfully'))
        } catch (e) {
          console.error('withdrawals endpoint error:', e)
          return res.status(500).json(HttpResponseUtil.internalServerError())
        }
      }

      if (action === 'proofs') {
        try {
          const proofs = await campaignService.listProofs(campaignId)
          const proofDtos = proofs.map((p) => ({
            id: p.id,
            campaignId: p.campaignId.toString(),
            userId: p.userId,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
          }))
          return res.status(200).json(HttpResponseUtil.success(proofDtos, 'Proofs retrieved successfully'))
        } catch (e) {
          console.error('proofs endpoint error:', e)
          return res.status(500).json(HttpResponseUtil.internalServerError())
        }
      }

      if (action === 'sync') {
        try {
          // Sync campaign balance from blockchain and mark as completed if needed
          const updatedCampaign = await campaignService.syncCampaignBalance(campaignId)
          const campaignDto: CampaignDto = campaignMapper.toCampaignDto(updatedCampaign)
          return res.status(200).json(HttpResponseUtil.success(campaignDto, 'Campaign synced successfully'))
        } catch (e) {
          console.error('sync endpoint error:', e)
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
      const { milestones, content, userId, parentId, userAddress, amount } = req.body || {}

      if (action === 'milestones') {
        await campaignService.upsertMilestones(BigInt(String(req.query.id)), milestones || [])
        return res.status(200).json(HttpResponseUtil.success(null, 'Milestones updated'))
      }
      if (action === 'comment') {
        try {
          if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json(HttpResponseUtil.badRequest('Comment content is required'))
          }

          // Get userAddress from request body
          const { userAddress } = req.body
          if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
            return res.status(400).json(HttpResponseUtil.badRequest('userAddress is required'))
          }

          // Get or create user
          const existing = await userService.getUserByAddress(userAddress.toLowerCase())
          const user = existing ?? (await userService.createUser({ address: userAddress.toLowerCase() }))

          const created = await campaignService.createComment({
            campaignId: BigInt(String(req.query.id)),
            userId: user.id,
            content: content.trim(),
            parentId: parentId || undefined,
          })

          // Convert BigInt to string for JSON serialization
          const serializableCreated = {
            ...created,
            campaignId: created.campaignId.toString(),
          }

          return res.status(200).json(HttpResponseUtil.success(serializableCreated, 'Comment created'))
        } catch (error) {
          console.error('Error creating comment:', error)
          return res.status(500).json(HttpResponseUtil.error('Failed to create comment'))
        }
      }
      if (action === 'donated') {
        if (!userAddress || typeof userAddress !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('userAddress is required'))
        }
        let amountWei = BigInt(0)
        try {
          if (amount) amountWei = ethers.parseEther(String(amount))
        } catch {
          console.warn('Invalid amount provided to donated action:', amount)
        }

        const campaignId = BigInt(String(req.query.id))
        const { transactionHash, blockNumber } = req.body || {}

        await campaignService.handleDonation(userAddress, amountWei, campaignId, transactionHash, blockNumber)
        return res.status(200).json(HttpResponseUtil.success(null, 'Donation processed'))
      }

      if (action === 'withdraw') {
        if (!userAddress || typeof userAddress !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('userAddress is required'))
        }
        if (!amount || typeof amount !== 'string') {
          return res.status(400).json(HttpResponseUtil.badRequest('amount is required'))
        }

        const campaignId = BigInt(String(req.query.id))
        const { milestoneIdx, txHash } = req.body || {}

        // Verify ownership
        const campaign = await campaignService.getCampaignById(campaignId)
        if (!campaign || campaign.ownerUser?.address.toLowerCase() !== userAddress.toLowerCase()) {
          return res.status(403).json({ error: 'Not authorized to withdraw from this campaign' })
        }

        // Check if campaign has reached goal
        const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
        const balanceInEth = Number.parseFloat(formatEther(BigInt(campaign.balance)))
        if (balanceInEth < goalInEth) {
          return res.status(400).json({ error: 'Campaign has not reached its goal yet' })
        }

        // Check if milestone requires proof (only Phase 2 requires proof)
        if (milestoneIdx !== undefined && milestoneIdx === 2) {
          // Check if proof exists for Phase 2
          const proofs = await campaignService.listProofs(campaignId)
          const hasProof = proofs.length > 0 // Any proof is sufficient for Phase 2
          if (!hasProof) {
            return res.status(400).json({
              error: `Proof required for milestone ${milestoneIdx}. Please upload proof before withdrawing.`,
            })
          }

          // Check if Phase 1 has been completed first
          const milestones = await campaignService.listMilestones(campaignId)
          const phase1Milestone = milestones.find((m: any) => m.index === 1)
          if (phase1Milestone && !phase1Milestone.isReleased) {
            return res.status(400).json({
              error: 'Phase 1 must be completed before Phase 2 withdrawal',
            })
          }
        }

        const withdrawal = await campaignService.createWithdrawal({
          campaignId,
          amount: parseEther(amount),
          milestoneIdx: milestoneIdx,
          txHash: txHash,
        })

        // Convert BigInt to string for JSON serialization
        const withdrawalResponse = {
          ...withdrawal,
          amount: withdrawal.amount.toString(),
          campaignId: withdrawal.campaignId.toString(),
        }

        return res.status(200).json(HttpResponseUtil.success(withdrawalResponse, 'Withdrawal created'))
      }

      if (action === 'withdrawals') {
        const campaignId = BigInt(String(req.query.id))
        const withdrawals = await campaignService.listWithdrawals(campaignId)
        return res.status(200).json(HttpResponseUtil.success(withdrawals, 'Withdrawals retrieved'))
      }

      if (action === 'release-milestone') {
        const campaignId = BigInt(String(req.query.id))
        const { milestoneIndex } = req.body || {}

        if (!milestoneIndex || typeof milestoneIndex !== 'number') {
          return res.status(400).json(HttpResponseUtil.badRequest('milestoneIndex is required'))
        }

        await campaignService.markMilestoneAsReleased(campaignId, milestoneIndex)

        return res.status(200).json(HttpResponseUtil.success(null, 'Milestone marked as released'))
      }

      if (action === 'force-create-milestones') {
        const campaignId = BigInt(String(req.query.id))

        // Get campaign to check if completed
        const campaign = await campaignService.getCampaignById(campaignId)
        if (!campaign) {
          return res.status(404).json(HttpResponseUtil.notFound('Campaign not found'))
        }

        if (!campaign.isCompleted) {
          return res.status(400).json(HttpResponseUtil.badRequest('Campaign must be completed to create milestones'))
        }

        // Create default milestones
        const defaultMilestones = [
          {
            index: 1,
            title: 'Phase 1 - Initial Withdrawal',
            description: 'First withdrawal (50% of goal)',
            percentage: 50,
          },
          {
            index: 2,
            title: 'Phase 2 - Final Withdrawal',
            description: 'Final withdrawal (50% of goal) after proof submission',
            percentage: 50,
          },
        ]

        await campaignService.upsertMilestones(campaignId, defaultMilestones)

        return res.status(200).json(HttpResponseUtil.success(null, 'Milestones created successfully'))
      }

      return res.status(400).json(HttpResponseUtil.badRequest('Invalid action'))
    } catch (error) {
      console.error('Error in campaign POST API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
