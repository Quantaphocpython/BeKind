import { httpClient, IHttpClient } from '@/configs/httpClient'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { CampaignDto, CampaignListResponseDto, CreateCampaignRequestDto, CreateCampaignResponseDto } from '../dto'

class CampaignService {
  private httpClient: IHttpClient

  constructor() {
    this.httpClient = httpClient
  }

  async createCampaign(data: CreateCampaignRequestDto): Promise<HttpResponse<CreateCampaignResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Campaigns)
    return await this.httpClient.post(url, data)
  }

  async getCampaigns(owner?: string): Promise<HttpResponse<CampaignListResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Campaigns, {}, { owner })
    return await this.httpClient.get(url)
  }

  async getCampaignById(id: string): Promise<HttpResponse<CampaignDto>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id })
    return await this.httpClient.get(url)
  }
}

export const campaignService = new CampaignService()
