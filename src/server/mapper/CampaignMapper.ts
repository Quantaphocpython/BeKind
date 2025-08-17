import { Campaign, Proof, Vote } from '@/features/Campaign/data/types'
import { CampaignDto, ProofDto, VoteDto } from '@/server/dto/campaign.dto'
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
      description: campaign.description,
      createdAt: campaign.createdAt.toISOString(),
      voteCount: campaign.voteCount,
      ownerUser: campaign.ownerUser ? userMapper.toUserDto(campaign.ownerUser) : null,
      proofs: campaign.proofs ? campaign.proofs.map(this.toProofDto) : [],
      votes: campaign.votes ? campaign.votes.map(this.toVoteDto) : [],
    }
  }

  toProofDto(proof: Proof): ProofDto {
    return {
      id: proof.id,
      campaignId: proof.campaignId.toString(),
      userId: proof.userId,
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

  toCampaignListDto(campaigns: Campaign[]): CampaignDto[] {
    return campaigns.map(this.toCampaignDto)
  }
}

export const campaignMapper = new CampaignMapper()
