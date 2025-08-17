import { useApiMutation } from '@/shared/hooks'
import { CreateUserRequestDto, CreateUserResponseDto } from '../dto'
import { userService } from '../services/user.service'

export const useCreateUser = () => {
  return useApiMutation<CreateUserResponseDto, CreateUserRequestDto>(userService.createUserIfNotExists, {
    invalidateQueries: [['users']],
  })
}
