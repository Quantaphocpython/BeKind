import {
  Campaign,
  Comment,
  CreateCampaignRequest,
  CreateCampaignResponse,
  Milestone,
  Proof,
  User,
  Withdrawal,
} from '@/features/Campaign/data/types'
import type {
  CampaignListPaginatedResponseDto,
  CampaignListQueryDto,
  TransactionDto,
  VoteDto,
} from '@/server/dto/campaign.dto'

export interface ICampaignService {
  createCampaign(data: CreateCampaignRequest, ownerAddress: string): Promise<CreateCampaignResponse>
  getCampaignById(campaignId: bigint): Promise<Campaign | null>
  getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]>
  getAllCampaigns(): Promise<Campaign[]>
  getCampaignsPaginated(query: CampaignListQueryDto): Promise<CampaignListPaginatedResponseDto>
  getRelatedCampaigns(currentCampaignId: bigint, limit?: number): Promise<Campaign[]>
  getSupportersFromChain(campaignId: bigint, limit?: number): Promise<VoteDto[]>
  handleDonation(
    userAddress: string,
    amount: bigint,
    campaignId?: bigint,
    transactionHash?: string,
    blockNumber?: number,
  ): Promise<boolean>
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
  createWithdrawal(data: {
    campaignId: bigint
    amount: bigint
    milestoneIdx?: number
    txHash?: string
  }): Promise<Withdrawal>
  getCampaignTransactions(campaignId: bigint, limit?: number): Promise<TransactionDto[]>

  // Helper methods
  syncCampaignBalance(campaignId: bigint): Promise<Campaign>

  // Proofs
  createProof(data: { campaignId: bigint; userId: string; title: string; content: string }): Promise<Proof>
  listProofs(campaignId: bigint): Promise<Proof[]>
  getUserByAddress(address: string): Promise<User | null>

  // Milestone management
  markMilestoneAsReleased(campaignId: bigint, milestoneIndex: number): Promise<void>
}
