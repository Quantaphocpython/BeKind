import prisma from '@/configs/prisma'
import { Campaign, Comment, CreateCampaignRequest, Milestone, Withdrawal } from '@/features/Campaign/data/types'
import { CampaignListPaginatedResponseDto, CampaignListQueryDto } from '@/server/dto/campaign.dto'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import { campaignMapper } from '../../mapper/CampaignMapper'
import { ICampaignRepository } from '../interface'
import type { IUserRepository } from '../interface/UserRepository.interface'

@injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async createCampaign(data: CreateCampaignRequest, campaignId: bigint, ownerAddress: string): Promise<Campaign> {
    const goalInWei = BigInt(Math.floor(parseFloat(data.goal) * 10 ** 18))

    const existingUser = await this.userRepository.getUserByAddress(ownerAddress)
    const ownerId = existingUser ? existingUser.id : (await this.userRepository.createUser(ownerAddress)).id

    return await prisma.campaign.upsert({
      where: { campaignId },
      create: {
        campaignId,
        owner: ownerId,
        goal: goalInWei,
        balance: BigInt(0),
        isExist: true,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        voteCount: 0,
      },
      update: {
        owner: ownerId,
        goal: goalInWei,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        isExist: true,
      },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
    })
  }

  async getCampaignById(campaignId: bigint): Promise<Campaign | null> {
    return await prisma.campaign.findUnique({
      where: { campaignId },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
        milestones: true,
        withdrawals: true,
        comments: { include: { user: true } },
      },
    })
  }

  async getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]> {
    // Map address -> userId then filter by owner ObjectId
    const user = await this.userRepository.getUserByAddress(ownerAddress)
    const ownerId = user?.id || '__invalid__'
    return await prisma.campaign.findMany({
      where: { owner: ownerId },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await prisma.campaign.findMany({
      where: { isExist: true },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getRelatedCampaigns(currentCampaignId: bigint, limit: number = 3): Promise<Campaign[]> {
    return await prisma.campaign.findMany({
      where: {
        isExist: true,
        campaignId: { not: currentCampaignId },
      },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign> {
    return await prisma.campaign.update({
      where: { campaignId },
      data: { balance },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
    })
  }

  async closeCampaign(campaignId: bigint): Promise<Campaign> {
    return await prisma.campaign.update({
      where: { campaignId },
      data: { isExist: false },
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
    })
  }

  async incrementVoteCount(campaignId: bigint): Promise<void> {
    await prisma.campaign.update({
      where: { campaignId },
      data: {
        voteCount: {
          increment: 1,
        },
      },
    })
  }

  async upsertMilestones(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void> {
    // delete existing then recreate for simplicity
    await prisma.milestone.deleteMany({ where: { campaignId: campaignId } })
    if (!milestones?.length) return
    await prisma.milestone.createMany({
      data: milestones.map((m) => ({
        campaignId: campaignId,
        index: m.index,
        title: m.title,
        description: m.description ?? null,
        percentage: m.percentage,
      })),
    })
  }

  async listMilestones(campaignId: bigint): Promise<Milestone[]> {
    return await prisma.milestone.findMany({ where: { campaignId: campaignId }, orderBy: { index: 'asc' } })
  }

  async createWithdrawal(data: {
    campaignId: bigint
    amount: bigint
    milestoneIdx?: number
    txHash?: string
  }): Promise<Withdrawal> {
    return await prisma.withdrawal.create({
      data: {
        campaignId: data.campaignId,
        amount: data.amount,
        milestoneIdx: data.milestoneIdx ?? null,
        txHash: data.txHash ?? null,
      },
    })
  }

  async listWithdrawals(campaignId: bigint): Promise<Withdrawal[]> {
    return await prisma.withdrawal.findMany({ where: { campaignId: campaignId }, orderBy: { createdAt: 'desc' } })
  }

  async createComment(data: {
    campaignId: bigint
    userId: string
    content: string
    parentId?: string
  }): Promise<Comment> {
    return await prisma.comment.create({
      data: {
        campaignId: data.campaignId,
        userId: data.userId,
        content: data.content,
        parentId: data.parentId ?? null,
      },
    })
  }

  async listComments(campaignId: bigint): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { campaignId: campaignId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getCampaignsPaginated(query: CampaignListQueryDto): Promise<CampaignListPaginatedResponseDto> {
    const { page = 1, limit = 12, search = '', status = 'all', sortBy = 'createdAt', sortOrder = 'desc' } = query

    const skip = (page - 1) * limit

    // Build where conditions
    const whereConditions: any = {}

    // Status filter
    if (status !== 'all') {
      whereConditions.isExist = status === 'active'
    }

    // Search filter
    if (search.trim()) {
      whereConditions.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          campaignId: {
            equals: isNaN(Number(search)) ? undefined : BigInt(search),
          },
        },
      ].filter((condition) => {
        // Remove undefined conditions
        if (condition.campaignId && condition.campaignId.equals === undefined) {
          return false
        }
        return true
      })
    }

    // Build orderBy
    const orderBy: any = {}
    switch (sortBy) {
      case 'title':
        orderBy.title = sortOrder
        break
      case 'goal':
        orderBy.goal = sortOrder
        break
      case 'balance':
        orderBy.balance = sortOrder
        break
      case 'voteCount':
        orderBy.voteCount = sortOrder
        break
      case 'createdAt':
      default:
        orderBy.createdAt = sortOrder
        break
    }

    // Get total count
    const total = await prisma.campaign.count({
      where: whereConditions,
    })

    // Get campaigns with pagination
    const campaigns = await prisma.campaign.findMany({
      where: whereConditions,
      include: {
        ownerUser: true,
        proofs: true,
        votes: true,
      },
      orderBy,
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // Convert Prisma models to DTOs using mapper
    const campaignDtos = campaigns.map((campaign) => campaignMapper.toCampaignDto(campaign))

    return {
      status: 200,
      message: 'Campaigns retrieved successfully',
      data: {
        items: campaignDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    }
  }
}
