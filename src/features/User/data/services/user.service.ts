import { httpClient, IHttpClient } from '@/configs/httpClient'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { CreateUserRequestDto, CreateUserResponseDto, UserDto, UserListResponseDto } from '../dto'

class UserService {
  private httpClient: IHttpClient

  constructor() {
    this.httpClient = httpClient
  }

  async createUserIfNotExists(data: CreateUserRequestDto): Promise<HttpResponse<CreateUserResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    return await this.httpClient.post(url, data)
  }

  async getUserByAddress(address: string): Promise<HttpResponse<UserDto>> {
    const url = routeConfig(ApiEndpointEnum.UserByAddress, { address })
    return await this.httpClient.get(url)
  }

  async getAllUsers(): Promise<HttpResponse<UserListResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    return await this.httpClient.get(url)
  }
}

export const userService = new UserService()
