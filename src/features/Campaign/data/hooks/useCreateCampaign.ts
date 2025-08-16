import { useApiMutation } from '@/shared/hooks/useApi'
import { CreateCampaignRequestDto, CreateCampaignResponseDto } from '../dto'
import { campaignService } from '../services'

export const useCreateCampaign = () => {
  return useApiMutation<CreateCampaignResponseDto, CreateCampaignRequestDto>(campaignService.createCampaign, {
    invalidateQueries: [['campaigns']],
  })
}
