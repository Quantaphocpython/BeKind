export enum ApiEndpointEnum {
  PrivateSocket = '/api/v1/socket.io/',
  PublicSocket = '/api/v1/socket.io/public',
  // Campaign endpoints
  Campaigns = '/api/campaigns',
  CampaignById = '/api/campaigns/{id}',
  // User endpoints
  Users = '/api/users',
  UserByAddress = '/api/users/{address}',
}

export const BASE_API = process.env.NEXT_PUBLIC_APP_API
