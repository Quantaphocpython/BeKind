export enum ApiEndpointEnum {
  PrivateSocket = '/api/v1/socket.io/',
  PublicSocket = '/api/v1/socket.io/public',
}

export const BASE_API = process.env.NEXT_PUBLIC_APP_API
