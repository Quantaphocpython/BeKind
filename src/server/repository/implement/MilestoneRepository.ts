import prisma from '@/configs/prisma'
import { Milestone } from '@/features/Campaign/data/types'
import { injectable } from 'inversify'
import { IMilestoneRepository } from '../interface/MilestoneRepository.interface'

@injectable()
export class MilestoneRepository implements IMilestoneRepository {
  async upsert(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void> {
    await prisma.milestone.deleteMany({ where: { campaignId } })
    if (!milestones?.length) return
    await prisma.milestone.createMany({
      data: milestones.map((m) => ({
        campaignId,
        index: m.index,
        title: m.title,
        description: m.description ?? null,
        percentage: m.percentage,
      })),
    })
  }

  async list(campaignId: bigint): Promise<Milestone[]> {
    return await prisma.milestone.findMany({
      where: { campaignId },
      orderBy: { index: 'asc' },
    })
  }
}
