import { container, TYPES } from '@/server/container'
import { UserDto } from '@/server/dto/campaign.dto'
import { IUserService } from '@/server/service/interface/UserService.interface'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get services from DI container
  const userService = container.get<IUserService>(TYPES.UserService)
  const userMapper = container.get(TYPES.UserMapper) as any

  if (req.method === 'POST') {
    try {
      const { address, name } = req.body

      if (!address) {
        return res.status(400).json(HttpResponseUtil.badRequest('User address is required'))
      }

      // Create user if not exists
      const user = await userService.createUserIfNotExists(address, name)
      const userDto: UserDto = userMapper.toUserDto(user)

      return res.status(201).json(HttpResponseUtil.success(userDto, 'User created/retrieved successfully', 201))
    } catch (error) {
      console.error('Error in users API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  if (req.method === 'GET') {
    try {
      const { address } = req.query

      if (address && typeof address === 'string') {
        // Get specific user by address
        const user = await userService.getUserByAddress(address)

        if (!user) {
          return res.status(404).json(HttpResponseUtil.notFound('User not found'))
        }

        const userDto: UserDto = userMapper.toUserDto(user)
        return res.status(200).json(HttpResponseUtil.success(userDto, 'User retrieved successfully'))
      } else {
        // Get all users
        const users = await userService.getAllUsers()
        const userDtos: UserDto[] = users.map(userMapper.toUserDto)

        return res.status(200).json(HttpResponseUtil.success(userDtos, 'Users retrieved successfully'))
      }
    } catch (error) {
      console.error('Error in users API:', error)
      return res.status(500).json(HttpResponseUtil.internalServerError())
    }
  }

  return res.status(405).json(HttpResponseUtil.methodNotAllowed())
}
