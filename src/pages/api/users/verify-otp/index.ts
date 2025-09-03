import { container, TYPES } from '@/server/container'
import type { IUserService } from '@/server/service/interface/UserService.interface'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * @openapi
   * /api/users/verify-otp:
   *   post:
   *     summary: Verify OTP for user's email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, otp, userAddress]
   *             properties:
   *               email: { type: string }
   *               otp: { type: string }
   *               userAddress: { type: string }
   *     responses:
   *       200: { description: OTP verified }
   */
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, otp, userAddress } = req.body
    if (!email || !otp || !userAddress) {
      return res.status(400).json({ message: 'Email, OTP and user address are required' })
    }
    const userService = container.get(TYPES.UserService) as IUserService
    const result = await userService.verifyOtp({ email, otp, userAddress })
    return res.status(200).json(result)
  } catch (error) {
    console.error('Verify OTP error:', error)
    return res
      .status(500)
      .json({ message: 'Failed to verify OTP', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
