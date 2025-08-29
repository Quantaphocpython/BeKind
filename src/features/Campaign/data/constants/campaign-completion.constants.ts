// Campaign completion constants and rules
export const CAMPAIGN_COMPLETION_CONSTANTS = {
  // When a campaign reaches 100% of its goal, it is automatically marked as completed
  COMPLETION_THRESHOLD: 100, // percentage

  // Once completed, the campaign cannot revert to another status
  IMMUTABLE_AFTER_COMPLETION: true,

  // When completed, the raised amount equals the goal amount
  RAISED_EQUALS_GOAL_ON_COMPLETION: true,

  // No more donations are allowed after completion
  NO_DONATIONS_AFTER_COMPLETION: true,

  // Default milestone configuration for completed campaigns
  DEFAULT_MILESTONES: [
    {
      index: 1,
      title: 'Phase 1 - Initial Withdrawal',
      description: 'First withdrawal (50% of goal)',
      percentage: 50,
    },
    {
      index: 2,
      title: 'Phase 2 - Final Withdrawal',
      description: 'Final withdrawal (50% of goal) after proof submission',
      percentage: 50,
    },
  ],

  // Messages for different completion states
  MESSAGES: {
    ALREADY_COMPLETED: 'Campaign is already completed, no more donations allowed',
    COMPLETION_SUCCESS: 'Campaign has been successfully completed!',
    BALANCE_UPDATE_IGNORED: 'Campaign is already completed, balance update ignored',
    WITHDRAWAL_AVAILABLE: 'Withdrawals are available after the campaign is completed',
    OWNER_ONLY_WITHDRAWAL: 'Only campaign owner can withdraw funds',
    MILESTONE_ALREADY_RELEASED: 'Milestone already released',
    PROOF_REQUIRED_PHASE2: 'Proof submission required before Phase 2 withdrawal',
  },
} as const

// Campaign status enum with completion rules
export enum CampaignCompletionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

// Helper functions for campaign completion logic
export const CampaignCompletionUtils = {
  /**
   * Check if a campaign has reached completion threshold
   */
  hasReachedCompletionThreshold: (balance: bigint, goal: bigint): boolean => {
    return balance >= goal
  },

  /**
   * Calculate effective balance for display (goal if completed, actual balance otherwise)
   */
  getEffectiveBalance: (balance: bigint, goal: bigint, isCompleted: boolean): bigint => {
    return isCompleted ? goal : balance
  },

  /**
   * Calculate progress percentage
   */
  getProgressPercentage: (balance: bigint, goal: bigint, isCompleted: boolean): number => {
    if (isCompleted) return 100
    if (goal === 0n) return 0
    return Math.min(Number((balance * 100n) / goal), 100)
  },

  /**
   * Check if campaign can accept donations
   */
  canAcceptDonations: (isCompleted: boolean, progress: number): boolean => {
    return !isCompleted && progress < CAMPAIGN_COMPLETION_CONSTANTS.COMPLETION_THRESHOLD
  },

  /**
   * Check if campaign owner can withdraw funds
   */
  canWithdraw: (isOwner: boolean, isCompleted: boolean): boolean => {
    return isOwner && isCompleted
  },
} as const
