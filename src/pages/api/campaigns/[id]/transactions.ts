import { container, TYPES } from '@/server/container'
import type { ICampaignService } from '@/server/service/interface/CampaignService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/campaigns/{id}/transactions:
   *   get:
   *     summary: List on-chain transactions for a campaign
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 50 }
   *     responses:
   *       200: { description: Transactions retrieved }
   */
  if (req.method !== 'GET') {
    return res.status(405).json(HttpResponseUtil.error('Method not allowed', 405))
  }

  try {
    const { id } = req.query
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50

    if (!id || typeof id !== 'string') {
      return res.status(400).json(HttpResponseUtil.error('Campaign ID is required', 400))
    }

    const campaignId = BigInt(id)
    const campaignService = container.get(TYPES.CampaignService) as ICampaignService

    const transactions = await campaignService.getCampaignTransactions(campaignId, limit)

    return res.status(200).json(HttpResponseUtil.success(transactions))
  } catch (error) {
    console.error('Error fetching campaign transactions:', error)
    return res.status(500).json(HttpResponseUtil.error('Internal server error', 500))
  }
}
