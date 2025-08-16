import { useQuery } from '@tanstack/react-query'
import { CampaignDto } from '../dto'
import { campaignService } from '../services'

export const useCampaigns = (owner?: string) => {
  return useQuery({
    queryKey: ['campaigns', owner],
    queryFn: () => campaignService.getCampaigns(owner),
    select: (data) => data.data.campaigns as CampaignDto[],
  })
}
