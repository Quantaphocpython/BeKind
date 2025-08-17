import prisma from '@/configs/prisma'
import { Campaign, CreateCampaignRequest } from '@/features/Campaign/data/types'
import { injectable } from 'inversify'
import { ICampaignRepository } from '../interface'

@injectable()
export class CampaignRepository implements ICampaignRepository {
  async createCampaign(data: CreateCampaignRequest, campaignId: bigint, ownerAddress: string): Promise<Campaign> {
    const goalInWei = BigInt(Math.floor(parseFloat(data.goal) * 10 ** 18))

    return await prisma.campaign.create({
      data: {
        campaignId,
        owner: ownerAddress,
        goal: goalInWei,
        balance: BigInt(0),
        isExist: true,
        description: data.description,
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
    return await prisma.campaign.findMany({
      where: { owner: ownerAddress },
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
