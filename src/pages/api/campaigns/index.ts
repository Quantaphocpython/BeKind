import { container, TYPES } from '@/server/container'
import { CampaignListQueryDto, CampaignListResponseDto } from '@/server/dto/campaign.dto'
import type { ICampaignService } from '@/server/service/interface/CampaignService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get services from DI container
  const campaignService = container.get<ICampaignService>(TYPES.CampaignService)
  const campaignMapper = container.get(TYPES.CampaignMapper) as any

  if (req.method === 'GET') {
    try {
      const { owner, page, limit, search, status, sortBy, sortOrder } = req.query

      // If owner is provided, get campaigns by owner
      if (owner && typeof owner === 'string') {
        const campaigns = await campaignService.getCampaignsByOwner(owner)
        const campaignDtos = campaigns.map((campaign) => campaignMapper.toCampaignDto(campaign))
        const response: CampaignListResponseDto = { campaigns: campaignDtos }
        const httpResponse = HttpResponseUtil.success(response, 'Campaigns retrieved successfully')
        return res.status(httpResponse.status).json(httpResponse)
      }

      // If pagination parameters are provided, get paginated campaigns
      if (page || limit || search || status || sortBy || sortOrder) {
        const query: CampaignListQueryDto = {
          page: page ? parseInt(page as string) : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          search: search as string,
          status: status as 'all' | 'active' | 'closed',
          sortBy: sortBy as 'createdAt' | 'title' | 'goal' | 'balance' | 'voteCount',
          sortOrder: sortOrder as 'asc' | 'desc',
        }
        const paginatedResponse = await campaignService.getCampaignsPaginated(query)
        return res.status(paginatedResponse.status).json(paginatedResponse)
      }

      // Default: get all campaigns
      const campaigns = await campaignService.getAllCampaigns()
      const campaignDtos = campaigns.map((campaign) => campaignMapper.toCampaignDto(campaign))
      const response: CampaignListResponseDto = { campaigns: campaignDtos }
      const httpResponse = HttpResponseUtil.success(response, 'Campaigns retrieved successfully')
      return res.status(httpResponse.status).json(httpResponse)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      const httpResponse = HttpResponseUtil.error('Failed to fetch campaigns', 500)
      return res.status(httpResponse.status).json(httpResponse)
    }
  }

  if (req.method === 'POST') {
    try {
      const { goal, title, description, coverImage, userAddress } = req.body

      if (!goal || !title || !description || !coverImage || !userAddress) {
        const httpResponse = HttpResponseUtil.error('Missing required fields', 400)
        return res.status(httpResponse.status).json(httpResponse)
      }

      const createCampaignRequest = {
        goal,
        title,
        description,
        coverImage,
      }

      const result = await campaignService.createCampaign(createCampaignRequest, userAddress)

      if (!result.success) {
        const httpResponse = HttpResponseUtil.error(result.error || 'Failed to create campaign', 400)
        return res.status(httpResponse.status).json(httpResponse)
      }

      const campaignDto = campaignMapper.toCampaignDto(result.campaign!)
      const response = {
        campaign: campaignDto,
        campaignId: result.campaignId!.toString(),
      }

      const httpResponse = HttpResponseUtil.success(response, 'Campaign created successfully')
      return res.status(httpResponse.status).json(httpResponse)
    } catch (error) {
      console.error('Error creating campaign:', error)
      const httpResponse = HttpResponseUtil.error('Failed to create campaign', 500)
      return res.status(httpResponse.status).json(httpResponse)
    }
  }

  const httpResponse = HttpResponseUtil.error('Method not allowed', 405)
  return res.status(httpResponse.status).json(httpResponse)
}
