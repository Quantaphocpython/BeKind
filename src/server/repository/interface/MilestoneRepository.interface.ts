import { Milestone } from '@/features/Campaign/data/types'

export interface IMilestoneRepository {
  upsert(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void>
  list(campaignId: bigint): Promise<Milestone[]>
}
