import { User } from '@/features/Campaign/data/types'
import { UserDto } from '@/server/dto/campaign.dto'

class UserMapper {
  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      address: user.address,
      name: user.name,
      trustScore: user.trustScore,
      createdAt: user.createdAt.toISOString(),
    }
  }
}

export const userMapper = new UserMapper()
