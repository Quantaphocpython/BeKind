import { container, TYPES } from '@/server/container'
import { CampaignDto, CampaignListResponseDto } from '@/server/dto/campaign.dto'
import type { ICampaignService } from '@/server/service/interface/CampaignService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get services from DI container
  const campaignService = container.get<ICampaignService>(TYPES.CampaignService)
  const campaignMapper = container.get(TYPES.CampaignMapper) as any

  if (req.method === 'GET') {
    try {
      const { owner } = req.query

      let campaigns
      if (owner && typeof owner === 'string') {
        // Get campaigns by owner
        campaigns = await campaignService.getCampaignsByOwner(owner)
      } else {
        // Get all campaigns
        campaigns = await campaignService.getAllCampaigns()
      }

      const campaignDtos: CampaignDto[] = campaigns.map(campaignMapper.toCampaignDto)
      const response: CampaignListResponseDto = { campaigns: campaignDtos }

      return res.status(200).json(HttpResponseUtil.success(response, 'Campaigns retrieved successfully'))
    } catch (error) {
      console.error('Error in campaigns API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  if (req.method === 'POST') {
    try {
      const { goal, description, userAddress } = req.body

      if (!goal || !description || !userAddress) {
        return res.status(400).json(HttpResponseUtil.badRequest('Goal, description, and userAddress are required'))
      }

      const result = await campaignService.createCampaign({ goal, description }, userAddress)

      if (!result.success) {
        return res.status(400).json(HttpResponseUtil.badRequest(result.error || 'Failed to create campaign'))
      }

      const campaignDto: CampaignDto = campaignMapper.toCampaignDto(result.campaign!)
      const response = {
        campaign: campaignDto,
        campaignId: result.campaignId!.toString(),
      }

      return res.status(201).json(HttpResponseUtil.success(response, 'Campaign created successfully', 201))
    } catch (error) {
      console.error('Error in campaigns API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
