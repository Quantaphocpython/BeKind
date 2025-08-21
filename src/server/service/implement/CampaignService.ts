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
import type { VoteDto } from '@/server/dto/campaign.dto'
import { EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum'
import { ethers } from 'ethers'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { ICampaignRepository } from '../../repository/interface/CampaignRepository.interface'
import { ICampaignService } from '../interface/CampaignService.interface'
import type { IEmailService } from '../interface/EmailService.interface'
import type { IUserService } from '../interface/UserService.interface'

@injectable()
export class CampaignService implements ICampaignService {
  private contractAddress: string
  private provider: ethers.JsonRpcProvider

  constructor(
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: ICampaignRepository,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService,
    @inject(TYPES.UserService) private readonly userService: IUserService,
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

      let createdCampaignId: bigint
      if ((data as any).campaignId) {
        try {
          createdCampaignId = BigInt((data as any).campaignId)
        } catch {
          const nextId = await contract.nextCampaignId()
          createdCampaignId = nextId > BigInt(0) ? nextId - BigInt(1) : BigInt(0)
        }
      } else {
        const nextId = await contract.nextCampaignId()
        createdCampaignId = nextId > BigInt(0) ? nextId - BigInt(1) : BigInt(0)
      }

      // Create campaign in database
      const campaign = await this.campaignRepository.createCampaign(data, createdCampaignId, ownerAddress)

      // Send email notification
      try {
        await this.emailService.sendTemplateEmail({
          to: ownerAddress, // You might want to get user's email from database
          templateId: EmailTemplateEnum.CreateCampaignSuccess,
          params: {
            userName: campaign.ownerUser?.name || 'User',
            campaignName: data.title || `Campaign #${createdCampaignId}`,
            campaignGoal: data.goal,
            campaignDescription: data.description,
            campaignId: createdCampaignId.toString(),
            createdAt: campaign.createdAt.toLocaleDateString(),
          },
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the campaign creation if email fails
      }

      return {
        success: true,
        campaignId: createdCampaignId,
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

  // Helper function to get a reasonable starting block (optimized for speed)
  private async getReasonableStartBlock(): Promise<number> {
    try {
      const currentBlock = await this.provider.getBlockNumber()
      // Use last 10k blocks for better performance (most donations are recent)
      const startBlock = Math.max(0, currentBlock - 10000)
      return startBlock
    } catch (error) {
      console.error('getReasonableStartBlock error:', error)
      // Ultra fallback: last 5k blocks
      const currentBlock = await this.provider.getBlockNumber()
      const fallbackBlock = Math.max(0, currentBlock - 5000)
      return fallbackBlock
    }
  }

  // Cache for supporters to avoid repeated queries
  private supportersCache = new Map<string, { data: VoteDto[]; timestamp: number }>()
  private readonly CACHE_DURATION = 30000 // 30 seconds

  async getSupportersFromChain(
    campaignId: bigint,
    limit: number = 100,
    chunkSize: number = 100000,
  ): Promise<VoteDto[]> {
    try {
      // Check cache first
      const cacheKey = `${campaignId}-${limit}`
      const cached = this.supportersCache.get(cacheKey)
      const now = Date.now()

      if (cached && now - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }

      const contract = new ethers.Contract(this.contractAddress, abi, this.provider)
      const donationEvent = contract.getEvent('Donation')

      if (!donationEvent) {
        return []
      }

      const currentBlock = await this.provider.getBlockNumber()

      const fromBlock = await this.getReasonableStartBlock() // Get reasonable start block

      const filter = contract.filters?.Donation ? contract.filters.Donation(campaignId, null) : null

      const donorMap = new Map<
        string,
        { donor: string; blockNumber: number; txHash: string; logIndex: number; amount: bigint }
      >() // Use Map to avoid duplicates and keep latest

      // Simple approach: query all events at once (since we're only looking at recent blocks)

      let events: any[] = []

      if (filter) {
        events = await contract.queryFilter(filter, fromBlock, currentBlock)
      } else {
        // Fallback: Get raw logs and filter later
        const logs = await this.provider.getLogs({
          address: this.contractAddress,
          topics: [ethers.id('Donation(uint256,address,uint256)')],
          fromBlock: fromBlock,
          toBlock: currentBlock,
        })
        events = logs.map((log) => ({
          ...log,
          args: new ethers.Interface(abi as any).parseLog({ data: log.data, topics: log.topics })?.args,
        }))
      }

      // Process all events
      for (const ev of events) {
        const args = ev.args
        if (!args) continue
        const parsedCampaignId = args[0] as bigint | undefined
        if (parsedCampaignId === undefined || BigInt(parsedCampaignId) !== BigInt(campaignId)) continue
        const donor = (args[1] as string) || ''
        const amount = (args[2] as bigint) || BigInt(0)
        if (donor) {
          // Keep the latest donation from each donor
          donorMap.set(donor, {
            donor,
            blockNumber: ev.blockNumber || 0,
            txHash: ev.transactionHash || '',
            logIndex: (ev as any).logIndex || 0,
            amount,
          })
        }
      }

      // Convert Map to array and sort by block number (latest first)
      const donorEntries = Array.from(donorMap.values())
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, limit)

      const results: VoteDto[] = []

      // Optimize: Use current timestamp for all entries (avoid multiple getBlock calls)
      const currentTimestamp = Math.floor(Date.now() / 1000)

      for (const entry of donorEntries) {
        // Use current timestamp as fallback, or estimate from block number
        let createdAtIso = new Date().toISOString()

        if (entry.blockNumber) {
          try {
            // Estimate timestamp based on block difference (assuming ~12s per block)
            const blockDiff = currentBlock - entry.blockNumber
            const estimatedTimestamp = currentTimestamp - blockDiff * 12
            createdAtIso = new Date(estimatedTimestamp * 1000).toISOString()
          } catch (err) {
            console.warn(`Failed to estimate timestamp for block ${entry.blockNumber}:`, err)
          }
        }

        results.push({
          id: `${entry.txHash}-${entry.logIndex}`,
          campaignId: campaignId.toString(),
          userId: entry.donor,
          createdAt: createdAtIso,
          amount: ethers.formatEther(entry.amount),
          transactionHash: entry.txHash,
          blockNumber: entry.blockNumber,
        })
      }

      // Cache the results
      this.supportersCache.set(cacheKey, { data: results, timestamp: now })

      return results
    } catch (err) {
      console.error('getSupportersFromChain error:', err)
      throw err
    }
  }

  async handleDonation(userAddress: string, amount: bigint): Promise<boolean> {
    // Ensure user exists
    await this.userService.createUserIfNotExists(userAddress)
    // Increment trust score with a simple rule: +1 per donation (could be amount-based)
    const existing = await this.userService.getUserByAddress(userAddress)
    const current = existing?.trustScore ?? 0
    const increment = 1
    await this.userService.updateUserTrustScore(userAddress, current + increment)

    // Clear supporters cache since new donation was made
    this.supportersCache.clear()

    return true
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
    const comments = await this.campaignRepository.listComments(campaignId)

    // Populate user information for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.userService.getUserByAddress(comment.userId)
        return {
          ...comment,
          user: user || undefined,
        }
      }),
    )

    return commentsWithUsers
  }

  async listWithdrawals(campaignId: bigint): Promise<Withdrawal[]> {
    return await this.campaignRepository.listWithdrawals(campaignId)
  }
}
