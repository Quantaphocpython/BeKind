import { container, TYPES } from '@/server/container'
import { UserService } from '@/server/service/implement/UserService'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userService = container.get<UserService>(TYPES.UserService)

  if (req.method === 'POST') {
    try {
      const { address, name } = req.body

      if (!address) {
        return res.status(400).json(HttpResponseUtil.error('Address is required'))
      }

      // Check if user already exists
      const existingUser = await userService.getUserByAddress(address)
      if (existingUser) {
        return res.status(200).json(HttpResponseUtil.success({ user: existingUser }))
      }

      // Create new user
      const user = await userService.createUser({ address, name })
      return res.status(201).json(HttpResponseUtil.success({ user }))
    } catch (error) {
      console.error('Error creating user:', error)
      return res.status(500).json(HttpResponseUtil.error('Failed to create user'))
    }
  }

  if (req.method === 'GET') {
    try {
      // For now, we'll return an empty array since getAllUsers is not implemented
      // You can implement this method if needed
      return res.status(200).json(HttpResponseUtil.success({ users: [] }))
    } catch (error) {
      console.error('Error fetching users:', error)
      return res.status(500).json(HttpResponseUtil.error('Failed to fetch users'))
    }
  }

  return res.status(405).json(HttpResponseUtil.error('Method not allowed'))
}
