import { z } from 'zod'

// Campaign form schema
export const createCampaignSchema = z.object({
  goal: z
    .string()
    .min(1, 'Goal is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Goal must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
})

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>

// Campaign status enum
export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

// Campaign constants
export const CAMPAIGN_CONSTANTS = {
  MIN_GOAL: 0.001, // Minimum goal in ETH
  MAX_GOAL: 1000, // Maximum goal in ETH
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const
