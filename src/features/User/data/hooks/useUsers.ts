import { useApiQuery } from '@/shared/hooks'
import { UserListResponseDto } from '../dto'
import { userService } from '../services/user.service'

export const useUsers = () => {
  return useApiQuery<UserListResponseDto>(['users'], () => userService.getAllUsers(), {
    select: (data) => data.data as UserListResponseDto,
  })
}
