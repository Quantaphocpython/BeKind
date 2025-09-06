import { container, TYPES } from '@/server/container'
import { CampaignService } from '@/server/service/implement/CampaignService'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/campaigns/{id}/proofs:
   *   get:
   *     summary: List proofs for a campaign
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Proofs retrieved }
   *   post:
   *     summary: Create a proof for a campaign (owner only)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, content, userAddress]
   *             properties:
   *               title: { type: string }
   *               content: { type: string }
   *               userAddress: { type: string }
   *     responses:
   *       201: { description: Proof created }
   */
  const { id } = req.query
  const campaignService = container.get<CampaignService>(TYPES.CampaignService)

  if (req.method === 'GET') {
    try {
      const campaignId = BigInt(id as string)
      const proofs = await campaignService.listProofs(campaignId)
      // Map BigInt fields to string via mapper to avoid BigInt serialization errors
      const campaignMapper = container.get(TYPES.CampaignMapper) as any
      const proofDtos = proofs.map((p: any) => campaignMapper.toProofDto(p))
      return res.status(200).json(HttpResponseUtil.success(proofDtos, 'Proofs retrieved successfully'))
    } catch (error) {
      console.error('Error fetching proofs:', error)
      return res.status(500).json(HttpResponseUtil.error('Failed to fetch proofs'))
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content, userAddress } = req.body

      if (!title || !content || !userAddress) {
        return res.status(400).json(HttpResponseUtil.error('Missing required fields'))
      }

      const campaignId = BigInt(id as string)

      // Check if user is the campaign owner
      const campaign = await campaignService.getCampaignById(campaignId)
      if (!campaign) {
        return res.status(404).json(HttpResponseUtil.error('Campaign not found'))
      }

      // Get user by address
      const user = await campaignService.getUserByAddress(userAddress)
      if (!user) {
        return res.status(404).json(HttpResponseUtil.error('User not found'))
      }

      // Check if user is the campaign owner
      if (campaign.owner !== user.address) {
        return res.status(403).json(HttpResponseUtil.error('Only campaign owner can create proofs'))
      }

      const proof = await campaignService.createProof({
        campaignId,
        userId: user.id,
        title,
        content,
      })

      // Map to DTO to remove BigInt fields
      const campaignMapper = container.get(TYPES.CampaignMapper) as any
      const proofDto = campaignMapper.toProofDto(proof)

      return res.status(201).json(HttpResponseUtil.success({ proof: proofDto }, 'Proof created successfully'))
    } catch (error) {
      console.error('Error creating proof:', error)
      return res.status(500).json(HttpResponseUtil.error('Failed to create proof'))
    }
  }

  return res.status(405).json(HttpResponseUtil.error('Method not allowed'))
}
