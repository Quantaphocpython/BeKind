export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  CampaignRepository: Symbol.for('CampaignRepository'),

  // Services
  UserService: Symbol.for('UserService'),
  CampaignService: Symbol.for('CampaignService'),
  EmailService: Symbol.for('EmailService'),

  // Mappers
  UserMapper: Symbol.for('UserMapper'),
  CampaignMapper: Symbol.for('CampaignMapper'),
} as const
