import { Campaign, Comment, CreateCampaignRequest, Milestone, Proof, Withdrawal } from '@/features/Campaign/data/types'
import { CampaignListPaginatedResponseDto, CampaignListQueryDto } from '@/server/dto/campaign.dto'

export interface ICampaignRepository {
  createCampaign(data: CreateCampaignRequest, campaignId: bigint, ownerAddress: string): Promise<Campaign>
  getCampaignById(campaignId: bigint): Promise<Campaign | null>
  getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]>
  getAllCampaigns(): Promise<Campaign[]>
  getCampaignsPaginated(query: CampaignListQueryDto): Promise<CampaignListPaginatedResponseDto>
  getRelatedCampaigns(currentCampaignId: bigint, limit?: number): Promise<Campaign[]>
  updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign>
  closeCampaign(campaignId: bigint): Promise<Campaign>
  incrementVoteCount(campaignId: bigint): Promise<void>
  // Milestones
  upsertMilestones(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void>
  listMilestones(campaignId: bigint): Promise<Milestone[]>
  // Withdrawals
  createWithdrawal(data: {
    campaignId: bigint
    amount: bigint
    milestoneIdx?: number
    txHash?: string
  }): Promise<Withdrawal>
  listWithdrawals(campaignId: bigint): Promise<Withdrawal[]>
  // Comments
  createComment(data: { campaignId: bigint; userId: string; content: string; parentId?: string }): Promise<Comment>
  listComments(campaignId: bigint): Promise<Comment[]>

  // Proofs
  createProof(data: { campaignId: bigint; userId: string; title: string; content: string }): Promise<Proof>
  listProofs(campaignId: bigint): Promise<Proof[]>
}
