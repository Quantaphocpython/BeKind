import type { IHttpClient } from '@/configs/httpClient'
import { TYPES } from '@/features/Common/container/types'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { inject, injectable } from 'inversify'
import { CampaignDto, CampaignListResponseDto, CreateCampaignRequestDto, CreateCampaignResponseDto } from '../dto'

@injectable()
export class CampaignService {
  constructor(@inject(TYPES.HttpClient) private readonly httpClient: IHttpClient) {}

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
