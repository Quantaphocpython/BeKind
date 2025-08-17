import type { IHttpClient } from '@/configs/httpClient'
import { TYPES } from '@/features/Common/container/types'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { inject, injectable } from 'inversify'
import { CreateUserRequestDto, CreateUserResponseDto, UserDto, UserListResponseDto } from '../dto'

@injectable()
export class UserService {
  constructor(@inject(TYPES.HttpClient) private readonly httpClient: IHttpClient) {}

  async createUserIfNotExists(data: CreateUserRequestDto): Promise<HttpResponse<CreateUserResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    try {
      const result = await this.httpClient.post<HttpResponse<CreateUserResponseDto>>(url, data)
      return result
    } catch (error) {
      console.error('userService.createUserIfNotExists error:', error)
      throw error
    }
  }

  async getUserByAddress(address: string): Promise<HttpResponse<UserDto>> {
    const url = routeConfig(ApiEndpointEnum.Users, {}, { address })
    return await this.httpClient.get(url)
  }

  async getAllUsers(): Promise<HttpResponse<UserListResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    return await this.httpClient.get(url)
  }
}
