import { PaginationResponse } from '@/shared/types/httpResponse.type'

// Backend DTOs for Campaign
export interface CampaignDto {
  id: string
  campaignId: string
  owner: string
  goal: string
  balance: string
  isExist: boolean
  title: string
  description: string
  coverImage: string
  createdAt: string
  voteCount: number
  ownerUser?: UserDto | null
  proofs?: ProofDto[]
  votes?: VoteDto[]
  milestones?: MilestoneDto[]
  withdrawals?: WithdrawalDto[]
  comments?: CommentDto[]
}

export interface UserDto {
  id: string
  address: string
  name?: string | null
  trustScore: number
  createdAt: string
}

export interface ProofDto {
  id: string
  campaignId: string
  userId: string
  content: string
  createdAt: string
  campaign?: CampaignDto
  user?: UserDto
}

export interface VoteDto {
  id: string
  campaignId: string
  userId: string
  createdAt: string
  amount?: string // Amount in ETH
  transactionHash?: string // Transaction hash
  blockNumber?: number // Block number
  campaign?: CampaignDto
  user?: UserDto
}

export interface MilestoneDto {
  id: string
  campaignId: string
  index: number
  title: string
  description?: string
  percentage: number
  isReleased: boolean
  releasedAt?: string
  createdAt: string
}

export interface WithdrawalDto {
  id: string
  campaignId: string
  amount: string
  milestoneIdx?: number
  txHash?: string
  createdAt: string
}

export interface TransactionDto {
  id: string
  hash: string
  from: string
  to: string
  value: string
  blockNumber: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
  type: 'donation' | 'withdrawal' | 'creation'
  campaignId: string
}

export interface CommentDto {
  id: string
  campaignId: string
  userId: string
  content: string
  parentId?: string
  createdAt: string
  user?: UserDto
}

export interface CreateCampaignRequestDto {
  goal: string
  title: string
  description: string
  coverImage: string
  userAddress: string
}

export interface CreateCampaignResponseDto {
  campaign: CampaignDto
  campaignId: string
}

export interface CampaignListResponseDto {
  campaigns: CampaignDto[]
}

export interface CampaignListQueryDto {
  page?: number
  limit?: number
  search?: string
  status?: 'all' | 'active' | 'closed'
  sortBy?: 'createdAt' | 'title' | 'goal' | 'balance' | 'voteCount'
  sortOrder?: 'asc' | 'desc'
}

export type CampaignListPaginatedResponseDto = PaginationResponse<CampaignDto>
