import prisma from '@/configs/prisma'
import { Campaign, CreateCampaignRequest } from '@/features/Campaign/data/types'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import { ICampaignRepository } from '../interface'
import type { IUserRepository } from '../interface/UserRepository.interface'

@injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async createCampaign(data: CreateCampaignRequest, campaignId: bigint, ownerAddress: string): Promise<Campaign> {
    const goalInWei = BigInt(Math.floor(parseFloat(data.goal) * 10 ** 18))

    const existingUser = await this.userRepository.getUserByAddress(ownerAddress)
    const ownerId = existingUser ? existingUser.id : (await this.userRepository.createUser(ownerAddress)).id

    return await prisma.campaign.create({
      data: {
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
}
