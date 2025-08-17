import { Campaign, CreateCampaignRequest, CreateCampaignResponse } from '@/features/Campaign/data/types'

export interface ICampaignService {
  createCampaign(data: CreateCampaignRequest, ownerAddress: string): Promise<CreateCampaignResponse>
  getCampaignById(campaignId: bigint): Promise<Campaign | null>
  getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]>
  getAllCampaigns(): Promise<Campaign[]>
  updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign>
  closeCampaign(campaignId: bigint, ownerAddress: string): Promise<Campaign>
  incrementVoteCount(campaignId: bigint): Promise<void>
}
