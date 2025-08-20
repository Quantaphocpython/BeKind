import {
  Campaign,
  Comment,
  CreateCampaignRequest,
  CreateCampaignResponse,
  Milestone,
  Withdrawal,
} from '@/features/Campaign/data/types'

export interface ICampaignService {
  createCampaign(data: CreateCampaignRequest, ownerAddress: string): Promise<CreateCampaignResponse>
  getCampaignById(campaignId: bigint): Promise<Campaign | null>
  getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]>
  getAllCampaigns(): Promise<Campaign[]>
  getRelatedCampaigns(currentCampaignId: bigint, limit?: number): Promise<Campaign[]>
  updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign>
  closeCampaign(campaignId: bigint, ownerAddress: string): Promise<Campaign>
  incrementVoteCount(campaignId: bigint): Promise<void>
  upsertMilestones(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void>
  listMilestones(campaignId: bigint): Promise<Milestone[]>
  createComment(data: { campaignId: bigint; userId: string; content: string; parentId?: string }): Promise<Comment>
  listComments(campaignId: bigint): Promise<Comment[]>
  listWithdrawals(campaignId: bigint): Promise<Withdrawal[]>
}
