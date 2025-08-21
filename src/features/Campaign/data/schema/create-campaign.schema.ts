import { z } from 'zod'
import { CAMPAIGN_CONSTANTS } from '../constants'

// Base campaign form schema
export const createCampaignSchema = z.object({
  title: z.string().min(3, 'Title is required').max(120, 'Title too long'),
  goal: z
    .string()
    .min(1, 'Goal is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Goal must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  coverImage: z.string().min(1, 'Cover image is required'),
})

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>

// Enhanced schema factory with translation support
export const createEnhancedCampaignSchema = (t: (key: string, params?: any) => string) => {
  return createCampaignSchema
    .refine(
      (data) => {
        const goal = parseFloat(data.goal)
        return goal >= CAMPAIGN_CONSTANTS.MIN_GOAL
      },
      {
        message: t('Minimum goal is {min} ETH', { min: CAMPAIGN_CONSTANTS.MIN_GOAL }),
        path: ['goal'],
      },
    )
    .refine(
      (data) => {
        const goal = parseFloat(data.goal)
        return goal <= CAMPAIGN_CONSTANTS.MAX_GOAL
      },
      {
        message: t('Maximum goal is {max} ETH', { max: CAMPAIGN_CONSTANTS.MAX_GOAL }),
        path: ['goal'],
      },
    )
}
