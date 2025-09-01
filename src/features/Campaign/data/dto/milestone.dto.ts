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

export interface CreateMilestoneRequestDto {
  milestones: {
    index: number
    title: string
    description?: string
    percentage: number
  }[]
  userAddress: string
}

export interface CreateMilestoneResponseDto {
  milestones: MilestoneDto[]
}
