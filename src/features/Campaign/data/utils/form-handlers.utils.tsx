import { CAMPAIGN_CONSTANTS } from '../constants'
import { CreateCampaignRequestDto } from '../dto'
import { CreateCampaignFormData } from '../schema'

export interface FormHandlersUtils {
  validateGoalAmount: (goal: string) => void
  createRequestData: (formData: CreateCampaignFormData, address: string) => CreateCampaignRequestDto
}

export const createFormHandlersUtils = (t: (key: string) => string): FormHandlersUtils => ({
  validateGoalAmount: (goal: string) => {
    const goalAmount = parseFloat(goal)
    if (goalAmount < CAMPAIGN_CONSTANTS.MIN_GOAL || goalAmount > CAMPAIGN_CONSTANTS.MAX_GOAL) {
      throw new Error(t('Invalid goal amount'))
    }
  },

  createRequestData: (formData: CreateCampaignFormData, address: string): CreateCampaignRequestDto => {
    return {
      ...formData,
      userAddress: address,
    }
  },
})
