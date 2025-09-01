import { abi } from '@/configs/abis'
import { CONTRACT_CONSTANTS } from '@/features/Campaign/data/constants'
import {
  Campaign,
  Comment,
  CreateCampaignRequest,
  CreateCampaignResponse,
  Milestone,
  Proof,
  User,
  Withdrawal,
} from '@/features/Campaign/data/types'
import type {
  CampaignListPaginatedResponseDto,
  CampaignListQueryDto,
  TransactionDto,
  VoteDto,
} from '@/server/dto/campaign.dto'
import { SocketEventEnum } from '@/shared/constants'
import { EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum'
import { ethers } from 'ethers'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { ICampaignRepository } from '../../repository/interface/CampaignRepository.interface'
import { socketEmitter } from '../../utils/socketEmitter'
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

  async getCampaignsPaginated(query: CampaignListQueryDto): Promise<CampaignListPaginatedResponseDto> {
    return await this.campaignRepository.getCampaignsPaginated(query)
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

  // Cache for transactions to avoid repeated queries
  private transactionsCache = new Map<string, { data: TransactionDto[]; timestamp: number }>()
  private readonly TRANSACTIONS_CACHE_DURATION = 60000 // 1 minute

  async getSupportersFromChain(campaignId: bigint, limit: number = 100): Promise<VoteDto[]> {
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

  async handleDonation(
    userAddress: string,
    amount: bigint,
    campaignId?: bigint,
    transactionHash?: string,
    blockNumber?: number,
  ): Promise<boolean> {
    // Check if campaign exists and is not completed
    if (campaignId) {
      const campaign = await this.campaignRepository.getCampaignById(campaignId)
      if (!campaign) {
        console.error(`Campaign ${campaignId} not found`)
        return false
      }
      if (campaign.isCompleted) {
        console.error(`Campaign ${campaignId} is already completed, no more donations allowed`)
        return false
      }
    }
    // Ensure user exists
    const existingUser = await this.userService.getUserByAddress(userAddress)
    if (!existingUser) {
      await this.userService.createUser({ address: userAddress })
    }

    // Increment trust score with a simple rule: +1 per donation (could be amount-based)
    const current = existingUser?.trustScore ?? 0
    const increment = 1
    if (existingUser) {
      await this.userService.updateUser(existingUser.id, { trustScore: current + increment })
    }

    // Clear caches since new donation was made
    this.supportersCache.clear()
    this.transactionsCache.clear()

    // Emit real-time update if campaignId is provided
    if (campaignId) {
      try {
        socketEmitter.emitToAll(SocketEventEnum.NEW_DONATION, {
          campaignId: campaignId.toString(),
          donor: userAddress,
          amount: ethers.formatEther(amount),
          transactionHash: transactionHash || '',
          blockNumber: blockNumber || 0,
          timestamp: new Date().toISOString(),
        })

        // Update campaign balance in database and emit balance update
        const contract = new ethers.Contract(this.contractAddress, abi, this.provider)
        const newBalance = await contract.getBalance(campaignId)

        // Update database balance (this will also mark as completed if goal reached)
        await this.updateCampaignBalance(campaignId, newBalance)

        socketEmitter.emitToAll(SocketEventEnum.BALANCE_UPDATE, {
          campaignId: campaignId.toString(),
          newBalance: ethers.formatEther(newBalance),
        })
      } catch (error) {
        console.error('Failed to emit socket events:', error)
      }
    }

    return true
  }

  async updateCampaignBalance(campaignId: bigint, balance: bigint): Promise<Campaign> {
    // Check if campaign is already completed - if so, don't update balance
    const existingCampaign = await this.campaignRepository.getCampaignById(campaignId)
    if (existingCampaign?.isCompleted) {
      return existingCampaign
    }

    const campaign = await this.campaignRepository.updateCampaignBalance(campaignId, balance)

    if (!campaign.isCompleted && balance >= campaign.goal) {
      // When marking as completed, set the final balance to the goal amount
      // This ensures the raised amount equals the goal when completed
      const finalBalance = campaign.goal
      await this.campaignRepository.markCampaignAsCompleted(campaignId, finalBalance)

      // Auto-create default milestones for 2-phase withdrawal
      const defaultMilestones = [
        {
          index: 1,
          title: 'Phase 1 - Initial Withdrawal',
          description: 'First withdrawal (50% of goal)',
          percentage: 50,
        },
        {
          index: 2,
          title: 'Phase 2 - Final Withdrawal',
          description: 'Final withdrawal (50% of goal) after proof submission',
          percentage: 50,
        },
      ]

      await this.campaignRepository.upsertMilestones(campaignId, defaultMilestones)
    }

    return campaign
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
    // Use service method so we also mark completed and create milestones when goal reached
    return await this.updateCampaignBalance(campaignId, balance)
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

  async createWithdrawal(data: {
    campaignId: bigint
    amount: bigint
    milestoneIdx?: number
    txHash?: string
  }): Promise<Withdrawal> {
    // Validate withdrawal eligibility
    const campaign = await this.campaignRepository.getCampaignById(data.campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }

    if (!campaign.isCompleted) {
      throw new Error('Campaign must be completed (100% goal reached) before withdrawal')
    }

    // Get milestones to check withdrawal rules
    const milestones = await this.campaignRepository.listMilestones(data.campaignId)
    const milestone = milestones.find((m) => m.index === (data.milestoneIdx || 1))

    if (!milestone) {
      throw new Error('Milestone not found')
    }

    // Check if milestone is already released
    if (milestone.isReleased) {
      throw new Error('Milestone already released')
    }

    // For milestone 2, require proof submission
    if (milestone.index === 2) {
      const proofs = await this.campaignRepository.listProofs(data.campaignId)
      if (proofs.length === 0) {
        throw new Error('Proof submission required before Phase 2 withdrawal')
      }

      // Check if Phase 1 has been completed first
      const phase1Milestone = milestones.find((m) => m.index === 1)
      if (phase1Milestone && !phase1Milestone.isReleased) {
        throw new Error('Phase 1 must be completed before Phase 2 withdrawal')
      }
    }

    // Calculate maximum withdrawal amount for this milestone
    const maxAmount = (campaign.goal * BigInt(milestone.percentage)) / BigInt(100)
    if (data.amount > maxAmount) {
      throw new Error(`Withdrawal amount exceeds milestone limit (${milestone.percentage}% of goal)`)
    }

    // Create withdrawal and mark milestone as released
    const withdrawal = await this.campaignRepository.createWithdrawal(data)
    await this.campaignRepository.releaseMilestone(data.campaignId, milestone.index)

    // Update campaign's current withdrawal phase
    await this.campaignRepository.updateWithdrawalPhase(data.campaignId, milestone.index)

    // Emit sockets for realtime UI updates
    try {
      socketEmitter.emitToAll(SocketEventEnum.WITHDRAWAL_CREATED, {
        campaignId: data.campaignId.toString(),
        amount: ethers.formatEther(data.amount),
        milestoneIdx: data.milestoneIdx,
        txHash: data.txHash,
        createdAt: new Date().toISOString(),
      })

      socketEmitter.emitToAll(SocketEventEnum.MILESTONE_RELEASED, {
        campaignId: data.campaignId.toString(),
        milestoneIndex: milestone.index,
        releasedAt: new Date().toISOString(),
      })
    } catch (e) {
      console.error('Socket emit error (withdrawal/milestone):', e)
    }

    return withdrawal
  }

  async getCampaignTransactions(campaignId: bigint, limit: number = 50): Promise<TransactionDto[]> {
    try {
      // Check cache first
      const cacheKey = `${campaignId}-${limit}`
      const cached = this.transactionsCache.get(cacheKey)
      const now = Date.now()

      if (cached && now - cached.timestamp < this.TRANSACTIONS_CACHE_DURATION) {
        return cached.data
      }

      const contract = new ethers.Contract(this.contractAddress, abi, this.provider)
      const currentBlock = await this.provider.getBlockNumber()
      const fromBlock = await this.getReasonableStartBlock()

      const transactions: TransactionDto[] = []

      // Get donation events only
      const donationFilter = contract.filters?.Donation ? contract.filters.Donation(campaignId, null) : null
      if (donationFilter) {
        const donationEvents = await contract.queryFilter(donationFilter, fromBlock, currentBlock)

        // Process events with pagination for better performance
        const eventsToProcess = donationEvents.slice(0, limit) // Only process what we need

        // Get unique block numbers to batch fetch timestamps
        const uniqueBlockNumbers = [...new Set(eventsToProcess.map((event) => event.blockNumber))]

        // Batch fetch block timestamps
        const blockTimestamps = new Map<number, number>()
        const timestampPromises = uniqueBlockNumbers.map(async (blockNumber) => {
          try {
            const block = await this.provider.getBlock(blockNumber)
            if (block?.timestamp) {
              blockTimestamps.set(blockNumber, block.timestamp)
            }
          } catch (error) {
            console.warn(`Failed to get block ${blockNumber}:`, error)
          }
        })

        // Wait for all timestamp fetches to complete
        await Promise.all(timestampPromises)

        // Process events with cached timestamps
        for (const event of eventsToProcess) {
          const args = (event as any).args
          if (!args) continue

          const parsedCampaignId = args[0] as bigint
          if (BigInt(parsedCampaignId) !== BigInt(campaignId)) continue

          const donor = args[1] as string
          const amount = args[2] as bigint

          // Use cached timestamp or estimate from block number
          const blockTimestamp = blockTimestamps.get(event.blockNumber)
          const timestamp = blockTimestamp ? new Date(blockTimestamp * 1000).toISOString() : new Date().toISOString() // Fallback to current time

          // Assume success for donation events (they wouldn't emit if failed)
          const status: 'success' | 'pending' | 'failed' = 'success'

          transactions.push({
            id: `${event.transactionHash}-${(event as any).logIndex}`,
            hash: event.transactionHash,
            from: donor,
            to: this.contractAddress,
            value: amount.toString(),
            blockNumber: event.blockNumber.toString(),
            timestamp,
            status,
            type: 'donation',
            campaignId: campaignId.toString(),
          })

          // Break if we have enough transactions
          if (transactions.length >= limit) break
        }
      }

      // Sort by block number (newest first) and limit results
      const sortedTransactions = transactions
        .sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber))
        .slice(0, limit)

      // Cache the results
      this.transactionsCache.set(cacheKey, { data: sortedTransactions, timestamp: now })

      return sortedTransactions
    } catch (error) {
      console.error('Error getting campaign transactions:', error)
      return []
    }
  }

  async createProof(data: { campaignId: bigint; userId: string; title: string; content: string }): Promise<Proof> {
    return await this.campaignRepository.createProof(data)
  }

  async listProofs(campaignId: bigint): Promise<Proof[]> {
    return await this.campaignRepository.listProofs(campaignId)
  }

  async getUserByAddress(address: string): Promise<User | null> {
    return await this.userService.getUserByAddress(address)
  }

  async markMilestoneAsReleased(campaignId: bigint, milestoneIndex: number): Promise<void> {
    await this.campaignRepository.releaseMilestone(campaignId, milestoneIndex)
  }
}
