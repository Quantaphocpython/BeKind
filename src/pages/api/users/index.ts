import { container, TYPES } from '@/server/container'
import { UserService } from '@/server/service/implement/UserService'
import { HttpResponseUtil } from '@/shared/utils/httpResponse.util'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: Get user by address
   *     parameters:
   *       - in: query
   *         name: address
   *         schema: { type: string }
   *     responses:
   *       200: { description: User fetched }
   *   post:
   *     summary: Create user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [address]
   *             properties:
   *               address: { type: string }
   *               name: { type: string }
   *     responses:
   *       201: { description: User created }
   */
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
      const { address } = req.query
      if (address && typeof address === 'string') {
        const user = await userService.getUserByAddress(address)
        if (!user) {
          // Return success with null to let client decide to create
          return res.status(200).json(HttpResponseUtil.success(null, 'User not found'))
        }
        return res.status(200).json(HttpResponseUtil.success(user))
      }
      // Optionally implement get all users later
      return res.status(200).json(HttpResponseUtil.success({ users: [] }))
    } catch (error) {
      console.error('Error fetching users:', error)
      return res.status(500).json(HttpResponseUtil.error('Failed to fetch users'))
    }
  }

  return res.status(405).json(HttpResponseUtil.error('Method not allowed'))
}
