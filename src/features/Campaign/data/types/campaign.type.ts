import { CampaignStatus } from '../constants'

export interface Milestone {
  id: string
  campaignId: bigint
  index: number
  title: string
  description: string | null
  percentage: number
  isReleased: boolean
  releasedAt: Date | null
  createdAt: Date
}

export interface Withdrawal {
  id: string
  campaignId: bigint
  amount: bigint
  milestoneIdx: number | null
  txHash: string | null
  createdAt: Date
}

export interface Comment {
  id: string
  campaignId: bigint
  userId: string
  content: string
  parentId: string | null
  createdAt: Date
  user?: User
}

// Campaign from database
export interface Campaign {
  id: string
  campaignId: bigint
  owner: string
  goal: bigint
  balance: bigint
  isExist: boolean
  title: string
  description: string
  coverImage: string
  createdAt: Date
  voteCount: number
  isCompleted: boolean
  completedAt?: Date | null
  finalBalance?: bigint | null // Final balance when campaign was completed (immutable after completion)
  ownerUser?: User | null
  proofs?: Proof[]
  votes?: Vote[]
  milestones?: Milestone[]
  withdrawals?: Withdrawal[]
  comments?: Comment[]
}

// Campaign from blockchain
export interface CampaignOnChain {
  owner: string
  balance: bigint
  isExist: boolean
  goal: bigint
}

// Campaign with additional computed fields
export interface CampaignWithDetails extends Campaign {
  status: CampaignStatus
  progress: number // percentage of goal reached
  formattedGoal: string
  formattedBalance: string
  formattedProgress: string
}

// Create campaign request
export interface CreateCampaignRequest {
  goal: string
  title: string
  description: string
  coverImage: string
}

// Create campaign response
export interface CreateCampaignResponse {
  success: boolean
  campaignId?: bigint
  campaign?: Campaign
  error?: string
}

// User type (from Prisma schema)
export interface User {
  id: string
  address: string
  name?: string | null
  trustScore: number
  createdAt: Date
}

// Proof type (from Prisma schema)
export interface Proof {
  id: string
  campaignId: bigint
  userId: string
  title: string
  content: string
  createdAt: Date
  campaign?: Campaign
  user?: User
}

// Vote type (from Prisma schema)
export interface Vote {
  id: string
  campaignId: bigint
  userId: string
  createdAt: Date
  campaign?: Campaign
  user?: User
}
