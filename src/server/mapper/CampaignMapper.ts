import { Campaign, Comment, Milestone, Proof, Vote } from '@/features/Campaign/data/types'
import { CampaignDto, CommentDto, MilestoneDto, ProofDto, VoteDto, WithdrawalDto } from '@/server/dto/campaign.dto'
import type { Withdrawal } from '@prisma/client'
import { userMapper } from './UserMapper'

class CampaignMapper {
  toCampaignDto(campaign: Campaign): CampaignDto {
    return {
      id: campaign.id,
      campaignId: campaign.campaignId.toString(),
      owner: campaign.owner,
      goal: campaign.goal.toString(),
      balance: campaign.balance.toString(),
      isExist: campaign.isExist,
      title: campaign.title,
      description: campaign.description,
      coverImage: campaign.coverImage,
      createdAt: campaign.createdAt.toISOString(),
      voteCount: campaign.votes ? campaign.votes.length : campaign.voteCount,
      isCompleted: campaign.isCompleted,
      completedAt: campaign.completedAt ? campaign.completedAt.toISOString() : undefined,
      finalBalance: campaign.finalBalance ? campaign.finalBalance.toString() : undefined,
      currentWithdrawalPhase: campaign.currentWithdrawalPhase,
      ownerUser: campaign.ownerUser ? userMapper.toUserDto(campaign.ownerUser) : null,
      proofs: campaign.proofs ? campaign.proofs.map((proof) => this.toProofDto(proof)) : [],
      votes: campaign.votes ? campaign.votes.map((vote) => this.toVoteDto(vote)) : [],
      milestones: campaign.milestones ? campaign.milestones.map((m) => this.toMilestoneDto(m)) : [],
      withdrawals: campaign.withdrawals ? campaign.withdrawals.map((w) => this.toWithdrawalDto(w)) : [],
      comments: campaign.comments ? campaign.comments.map((c) => this.toCommentDto(c)) : [],
    }
  }

  toProofDto(proof: Proof): ProofDto {
    return {
      id: proof.id,
      campaignId: proof.campaignId.toString(),
      userId: proof.userId,
      title: proof.title,
      content: proof.content,
      createdAt: proof.createdAt.toISOString(),
      campaign: proof.campaign ? this.toCampaignDto(proof.campaign) : undefined,
      user: proof.user ? userMapper.toUserDto(proof.user) : undefined,
    }
  }

  toVoteDto(vote: Vote): VoteDto {
    return {
      id: vote.id,
      campaignId: vote.campaignId.toString(),
      userId: vote.userId,
      createdAt: vote.createdAt.toISOString(),
      campaign: vote.campaign ? this.toCampaignDto(vote.campaign) : undefined,
      user: vote.user ? userMapper.toUserDto(vote.user) : undefined,
    }
  }

  toMilestoneDto(m: Milestone): MilestoneDto {
    return {
      id: m.id,
      campaignId: m.campaignId.toString(),
      index: m.index,
      title: m.title,
      description: m.description ?? undefined,
      percentage: m.percentage,
      isReleased: m.isReleased,
      releasedAt: m.releasedAt ? m.releasedAt.toISOString() : undefined,
      createdAt: m.createdAt.toISOString(),
    }
  }

  toWithdrawalDto(w: Withdrawal): WithdrawalDto {
    return {
      id: w.id,
      campaignId: w.campaignId.toString(),
      amount: w.amount.toString(),
      milestoneIdx: w.milestoneIdx ?? undefined,
      txHash: w.txHash ?? undefined,
      createdAt: w.createdAt.toISOString(),
    }
  }

  toCommentDto(c: Comment): CommentDto {
    return {
      id: c.id,
      campaignId: c.campaignId.toString(),
      userId: c.userId,
      content: c.content,
      parentId: c.parentId ?? undefined,
      createdAt: c.createdAt.toISOString(),
      // user relation is optional; mapper of list includes user
      user: (c as any).user ? userMapper.toUserDto((c as any).user) : undefined,
    }
  }

  toCampaignListDto(campaigns: Campaign[]): CampaignDto[] {
    return campaigns.map((campaign) => this.toCampaignDto(campaign))
  }
}

export const campaignMapper = new CampaignMapper()
