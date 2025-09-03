import { container, TYPES } from '@/server/container'
import type { IUserService } from '@/server/service/interface/UserService.interface'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/users/send-otp:
   *   post:
   *     summary: Send OTP to user's email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, userAddress]
   *             properties:
   *               email: { type: string }
   *               userAddress: { type: string }
   *     responses:
   *       200: { description: OTP sent }
   */
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, userAddress } = req.body
    if (!email || !userAddress) {
      return res.status(400).json({ message: 'Email and user address are required' })
    }
    const userService = container.get(TYPES.UserService) as IUserService
    const result = await userService.sendOtp({ email, userAddress })
    return res.status(200).json(result)
  } catch (error) {
    console.error('Send OTP error:', error)
    return res
      .status(500)
      .json({ message: 'Failed to send OTP', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
