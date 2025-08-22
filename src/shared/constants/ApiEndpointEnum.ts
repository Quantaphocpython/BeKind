export enum ApiEndpointEnum {
  PrivateSocket = '/api/v1/socket.io/',
  PublicSocket = '/api/v1/socket.io/public',
  // Campaign endpoints
  Campaigns = '/api/campaigns',
  CampaignById = '/api/campaigns/{id}',
  CampaignTransactions = '/api/campaigns/{id}/transactions',
  CampaignComments = '/api/campaigns/{id}?action=comments',
  CampaignComment = '/api/campaigns/{id}?action=comment',
  // User endpoints
  Users = '/api/users',
}

export const BASE_API = process.env.NEXT_PUBLIC_APP_API
