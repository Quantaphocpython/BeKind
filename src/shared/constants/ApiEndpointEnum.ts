export enum ApiEndpointEnum {
  PrivateSocket = '/api/socket.io/',
  PublicSocket = '/api/socket.io/public',
  Campaigns = '/api/campaigns',
  CampaignById = '/api/campaigns/{id}',
  CampaignTransactions = '/api/campaigns/{id}/transactions',
  CampaignComments = '/api/campaigns/{id}/comments',
  CampaignProofs = '/api/campaigns/{id}/proofs',
  Users = '/api/users',
  SendOtp = '/api/users/send-otp',
  VerifyOtp = '/api/users/verify-otp',
  UpdateUserEmail = '/api/users/update-email',
  OpenApiJson = '/api/openapi.json',
}

export const BASE_API = process.env.NEXT_PUBLIC_APP_API
