// Campaign status enum
export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

// Campaign constants
export const CAMPAIGN_CONSTANTS = {
  MIN_GOAL: 0.001, // Minimum goal in ETH
  MAX_GOAL: 100, // Maximum goal in ETH
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const
