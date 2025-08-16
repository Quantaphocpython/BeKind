import { createCampaignSchema } from '@/features/Campaign/data/constants'
import { CampaignListResponseDto, CreateCampaignResponseDto } from '@/server/dto/campaign.dto'
import { campaignService } from '@/server/service'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { MapperUtil } from '@/shared/utils/mapper.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

      const campaignDtos = MapperUtil.toCampaignListDto(campaigns)
      const response: CampaignListResponseDto = { campaigns: campaignDtos }

      return res.status(200).json(HttpResponseUtil.success(response, 'Campaigns retrieved successfully'))
    } catch (error) {
      console.error('Error in campaigns API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  if (req.method === 'POST') {
    try {
      // Validate request body
      const validationResult = createCampaignSchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(HttpResponseUtil.badRequest('Invalid request data', validationResult.error.issues))
      }

      const { goal, description } = validationResult.data

      // Get user address from request (you might want to add authentication)
      const userAddress = req.body.userAddress || (req.headers['x-user-address'] as string)

      if (!userAddress) {
        return res.status(400).json(HttpResponseUtil.badRequest('User address is required'))
      }

      // Create campaign
      const result = await campaignService.createCampaign({ goal, description }, userAddress)

      if (!result.success) {
        return res.status(400).json(HttpResponseUtil.badRequest(result.error || 'Failed to create campaign'))
      }

      const campaignDto = MapperUtil.toCampaignDto(result.campaign!)
      const response: CreateCampaignResponseDto = {
        campaign: campaignDto,
        campaignId: result.campaignId!.toString(),
      }

      return res.status(201).json(HttpResponseUtil.success(response, 'Campaign created successfully', 201))
    } catch (error) {
      console.error('Error in campaign API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
