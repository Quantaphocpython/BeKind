import { useApiQuery } from '@/shared/hooks/useApi'
import { CampaignListResponseDto } from '../dto'
import { campaignService } from '../services'

export const useCampaigns = (owner?: string) => {
  return useApiQuery<CampaignListResponseDto>(
    ['campaigns', owner || 'all'],
    () => campaignService.getCampaigns(owner),
    {
      select: (data) => data.data,
    },
  )
}
