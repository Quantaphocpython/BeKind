import { useApiQuery } from '@/shared/hooks/useApi'
import { UserDto } from '../dto'
import { userService } from '../services/user.service'

export const useUser = (address: string) => {
  return useApiQuery<UserDto>(['user', address], () => userService.getUserByAddress(address), {
    enabled: !!address,
    select: (data) => data.data as UserDto,
  })
}
