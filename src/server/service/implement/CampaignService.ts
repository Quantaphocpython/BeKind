import { abi } from '@/configs/abis'
import { CONTRACT_CONSTANTS } from '@/features/Campaign/data/constants'
import {
  Campaign,
  Comment,
  CreateCampaignRequest,
  CreateCampaignResponse,
  Milestone,
  Withdrawal,
} from '@/features/Campaign/data/types'
import { EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum'
import { ethers } from 'ethers'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { ICampaignRepository } from '../../repository/interface/CampaignRepository.interface'
import { ICampaignService } from '../interface/CampaignService.interface'
import type { IEmailService } from '../interface/EmailService.interface'

@injectable()
export class CampaignService implements ICampaignService {
  private contractAddress: string
  private provider: ethers.JsonRpcProvider

  constructor(
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: ICampaignRepository,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService,
  ) {
    this.contractAddress = CONTRACT_CONSTANTS.ADDRESS

    if (!this.contractAddress) {
      throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS environment variable is required')
    }

    // Use the same RPC URL as configured in wagmi
    this.provider = new ethers.JsonRpcProvider(CONTRACT_CONSTANTS.RPC_URL)
  }

  async createCampaign(data: CreateCampaignRequest, ownerAddress: string): Promise<CreateCampaignResponse> {
    try {
      // Validate input
      const goal = parseFloat(data.goal)
      if (goal <= 0) {
        return {
          success: false,
          error: 'Goal must be greater than 0',
        }
      }

      // Create contract instance
      const contract = new ethers.Contract(this.contractAddress, abi, this.provider)

      // Get next campaign ID
      const nextCampaignId = await contract.nextCampaignId()

      // Create campaign in database first
      const campaign = await this.campaignRepository.createCampaign(data, nextCampaignId, ownerAddress)

      // Send email notification
      try {
        await this.emailService.sendTemplateEmail({
          to: ownerAddress, // You might want to get user's email from database
          templateId: EmailTemplateEnum.CreateCampaignSuccess,
          params: {
            userName: campaign.ownerUser?.name || 'User',
            campaignName: data.title || `Campaign #${nextCampaignId}`,
            campaignGoal: data.goal,
            campaignDescription: data.description,
            campaignId: nextCampaignId.toString(),
            createdAt: campaign.createdAt.toLocaleDateString(),
          },
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the campaign creation if email fails
      }

      return {
        success: true,
        campaignId: nextCampaignId,
        campaign,
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async getCampaignById(campaignId: bigint): Promise<Campaign | null> {
    return await this.campaignRepository.getCampaignById(campaignId)
  }

  async getCampaignsByOwner(ownerAddress: string): Promise<Campaign[]> {
    return await this.campaignRepository.getCampaignsByOwner(ownerAddress)
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.campaignRepository.getAllCampaigns()
  }

  async getRelatedCampaigns(currentCampaignId: bigint, limit: number = 3): Promise<Campaign[]> {
    return await this.campaignRepository.getRelatedCampaigns(currentCampaignId, limit)
  }

  async updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign> {
    return await this.campaignRepository.updateCampaignBalance(campaignId, balance)
  }

  async closeCampaign(campaignId: bigint, ownerAddress: string): Promise<Campaign> {
    // Verify ownership
    const campaign = await this.campaignRepository.getCampaignById(campaignId)
    if (!campaign || campaign.owner !== ownerAddress) {
      throw new Error('Not authorized to close this campaign')
    }

    return await this.campaignRepository.closeCampaign(campaignId)
  }

  async incrementVoteCount(campaignId: bigint): Promise<void> {
    await this.campaignRepository.incrementVoteCount(campaignId)
  }

  // Helper method to get campaign from blockchain
  async getCampaignFromBlockchain(campaignId: bigint) {
    const contract = new ethers.Contract(this.contractAddress, abi, this.provider)
    return await contract.campaigns(campaignId)
  }

  // Helper method to sync campaign balance from blockchain
  async syncCampaignBalance(campaignId: bigint): Promise<Campaign> {
    const contract = new ethers.Contract(this.contractAddress, abi, this.provider)
    const balance = await contract.getBalance(campaignId)
    return await this.campaignRepository.updateCampaignBalance(campaignId, balance)
  }

  async upsertMilestones(
    campaignId: bigint,
    milestones: { index: number; title: string; description?: string; percentage: number }[],
  ): Promise<void> {
    await this.campaignRepository.upsertMilestones(campaignId, milestones)
  }

  async listMilestones(campaignId: bigint): Promise<Milestone[]> {
    return await this.campaignRepository.listMilestones(campaignId)
  }

  async createComment(data: {
    campaignId: bigint
    userId: string
    content: string
    parentId?: string
  }): Promise<Comment> {
    return await this.campaignRepository.createComment(data)
  }

  async listComments(campaignId: bigint): Promise<Comment[]> {
    return await this.campaignRepository.listComments(campaignId)
  }

  async listWithdrawals(campaignId: bigint): Promise<Withdrawal[]> {
    return await this.campaignRepository.listWithdrawals(campaignId)
  }
}
