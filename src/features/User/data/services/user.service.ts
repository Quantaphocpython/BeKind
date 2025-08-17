import { httpClient } from '@/configs/httpClient'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { routeConfig } from '@/shared/utils/route'
import { CreateUserRequestDto, CreateUserResponseDto, UserDto, UserListResponseDto } from '../dto'

class UserService {
  async createUserIfNotExists(data: CreateUserRequestDto): Promise<HttpResponse<CreateUserResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    console.log('userService.createUserIfNotExists called with:', data)
    console.log('Making POST request to:', url)
    try {
      const result = await httpClient.post<HttpResponse<CreateUserResponseDto>>(url, data)
      console.log('userService.createUserIfNotExists success:', result)
      return result
    } catch (error) {
      console.error('userService.createUserIfNotExists error:', error)
      throw error
    }
  }

  async getUserByAddress(address: string): Promise<HttpResponse<UserDto>> {
    const url = routeConfig(ApiEndpointEnum.UserByAddress, { address })
    return await httpClient.get(url)
  }

  async getAllUsers(): Promise<HttpResponse<UserListResponseDto>> {
    const url = routeConfig(ApiEndpointEnum.Users)
    return await httpClient.get(url)
  }
}

export const userService = new UserService()
