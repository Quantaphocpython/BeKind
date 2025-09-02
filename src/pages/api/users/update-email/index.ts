import { container, TYPES } from '@/server/container'
import type { IUserService } from '@/server/service/interface/UserService.interface'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, userAddress } = req.body
    if (!email || !userAddress) {
      return res.status(400).json({ message: 'Email and user address are required' })
    }
    const userService = container.get(TYPES.UserService) as IUserService
    const result = await userService.updateUserEmail({ email, userAddress })
    return res.status(200).json(result)
  } catch (error) {
    console.error('Update email error:', error)
    return res
      .status(500)
      .json({ message: 'Failed to update email', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
