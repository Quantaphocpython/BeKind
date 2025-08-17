// Frontend DTOs for Campaign
export interface CampaignDto {
  id: string
  campaignId: string
  owner: string
  goal: string
  balance: string
  isExist: boolean
  description: string
  createdAt: string
  voteCount: number
  ownerUser?: UserDto | null
  proofs?: ProofDto[]
  votes?: VoteDto[]
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
  campaign?: CampaignDto
  user?: UserDto
}

export interface CreateCampaignRequestDto {
  goal: string
  description: string
  userAddress: string
}

export interface CreateCampaignResponseDto {
  campaign: CampaignDto
  campaignId: string
}

export interface CampaignListResponseDto {
  campaigns: CampaignDto[]
}
