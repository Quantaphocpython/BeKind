import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCampaignRequestDto } from '../dto'
import { campaignService } from '../services'

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCampaignRequestDto) => campaignService.createCampaign(data),
    onSuccess: () => {
      // Invalidate and refetch campaigns
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
