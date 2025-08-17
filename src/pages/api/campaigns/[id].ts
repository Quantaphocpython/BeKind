import { CampaignDto } from '@/server/dto/campaign.dto'
import { campaignMapper } from '@/server/mapper'
import { campaignService } from '@/server/service/implement/CampaignService'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json(HttpResponseUtil.badRequest('Campaign ID is required'))
      }

      const campaignId = BigInt(id)
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

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
