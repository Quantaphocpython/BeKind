// Frontend DTOs for Campaign
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
  isCompleted: boolean
  completedAt?: string
  finalBalance?: string // Final balance when campaign was completed (immutable after completion)
  ownerUser?: UserDto | null
  proofs?: ProofDto[]
  votes?: VoteDto[]
  milestones?: MilestoneDto[]
  withdrawals?: WithdrawalDto[]
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
  title: string
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

export interface CreateCampaignRequestDto {
  goal: string
  title: string
  description: string
  coverImage: string
  userAddress: string
  campaignId?: string
}

export interface CreateCampaignResponseDto {
  campaign: CampaignDto
  campaignId: string
}

export interface CampaignListResponseDto {
  campaigns: CampaignDto[]
}
