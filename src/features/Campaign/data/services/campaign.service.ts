import type { IHttpClient } from '@/configs/httpClient'
import { TYPES } from '@/features/Common/container/types'
import type {
  CampaignListPaginatedResponseDto,
  CampaignListQueryDto,
  CommentDto,
  TransactionDto,
} from '@/server/dto/campaign.dto'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { inject, injectable } from 'inversify'
import { CampaignDto, CampaignListResponseDto, CreateCampaignRequestDto, CreateCampaignResponseDto } from '../dto'
import { CreateMilestoneResponseDto, MilestoneDto } from '../dto/milestone.dto'
import { CreateProofResponseDto, ProofDto } from '../dto/proof.dto'
import { CreateWithdrawalResponseDto, WithdrawalDto } from '../dto/withdrawal.dto'

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

  async getCampaignsPaginated(query: CampaignListQueryDto): Promise<HttpResponse<CampaignListPaginatedResponseDto>> {
    const url = routeConfig(
      ApiEndpointEnum.Campaigns,
      {},
      {
        page: query.page?.toString(),
        limit: query.limit?.toString(),
        search: query.search,
        status: query.status,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
    )
    return await this.httpClient.get(url)
  }

  async getCampaignById(id: string): Promise<HttpResponse<CampaignDto>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id })
    return await this.httpClient.get(url)
  }

  async getRelatedCampaigns(id: string, limit?: number): Promise<HttpResponse<CampaignDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'related', limit: limit?.toString() })
    return await this.httpClient.get(url)
  }

  async getSupporters(id: string, limit?: number): Promise<HttpResponse<any[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'supporters', limit: limit?.toString() })
    return await this.httpClient.get(url)
  }

  async notifyDonation(
    id: string,
    payload: { userAddress: string; amount: string; transactionHash?: string; blockNumber?: number },
  ): Promise<HttpResponse<null>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'donated' })
    return await this.httpClient.post(url, payload)
  }

  async getCampaignTransactions(id: string, limit?: number): Promise<HttpResponse<TransactionDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignTransactions, { id }, { limit: limit?.toString() })
    return await this.httpClient.get(url)
  }

  async getCampaignComments(id: string): Promise<HttpResponse<CommentDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'comments' })
    return await this.httpClient.get(url)
  }

  async createComment(
    id: string,
    data: { content: string; parentId?: string; userId: string },
  ): Promise<HttpResponse<any>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'comment' })
    return await this.httpClient.post(url, data)
  }

  async getCampaignProofs(id: string): Promise<HttpResponse<ProofDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignProofs, { id })
    return await this.httpClient.get(url)
  }

  async createProof(
    id: string,
    data: { title: string; content: string; userAddress: string },
  ): Promise<HttpResponse<CreateProofResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.CampaignProofs, { id })
    return await this.httpClient.post(url, data)
  }

  async getCampaignMilestones(id: string): Promise<HttpResponse<MilestoneDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'milestones' })
    return await this.httpClient.get(url)
  }

  async createMilestones(
    id: string,
    data: {
      milestones: { index: number; title: string; description?: string; percentage: number }[]
      userAddress: string
    },
  ): Promise<HttpResponse<CreateMilestoneResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'milestones' })
    return await this.httpClient.post(url, data)
  }

  async getCampaignWithdrawals(id: string): Promise<HttpResponse<WithdrawalDto[]>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'withdrawals' })
    return await this.httpClient.get(url)
  }

  async createWithdrawal(
    id: string,
    data: { amount: string; milestoneIdx?: number; userAddress: string },
  ): Promise<HttpResponse<CreateWithdrawalResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.CampaignById, { id }, { action: 'withdraw' })
    return await this.httpClient.post(url, data)
  }
}
