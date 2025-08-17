import { Campaign, CreateCampaignRequest } from '@/features/Campaign/data/types'

export interface ICampaignRepository {
  createCampaign(data: CreateCampaignRequest, campaignId: bigint, ownerAddress: string): Promise<Campaign>
  getCampaignById(campaignId: bigint): Promise<Campaign | null>
  getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]>
  getAllCampaigns(): Promise<Campaign[]>
  updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign>
  closeCampaign(campaignId: bigint): Promise<Campaign>
  incrementVoteCount(campaignId: bigint): Promise<void>
}
