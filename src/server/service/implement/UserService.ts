import { User } from '@/features/Campaign/data/types'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { IUserRepository } from '../../repository/interface/UserRepository.interface'
import type { IEmailService } from '../interface/EmailService.interface'
import { IUserService } from '../interface/UserService.interface'

@injectable()
export class UserService implements IUserService {
  private otpStore = new Map<string, { otp: string; email: string; expiresAt: number; verified?: boolean }>()

  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService,
  ) {}

  async createUser(data: { address: string; name?: string; email?: string }): Promise<User> {
    return await this.userRepository.createUser(data)
  }

  async getUserByAddress(address: string): Promise<User | null> {
    return await this.userRepository.getUserByAddress(address)
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.updateUser(id, data)
  }

  async sendOtp(data: { email: string; userAddress: string }): Promise<{ success: boolean; message: string }> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 10 * 60 * 1000
      this.otpStore.set(data.userAddress, { otp, email: data.email, expiresAt })

      await this.emailService.sendSimpleEmail(
        data.email,
        'Email Verification OTP - Charity Platform',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hello,</p>
            <p>Please use the following OTP to verify your new email:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
          </div>`,
      )
      return { success: true, message: 'OTP sent successfully' }
    } catch (e) {
      console.error('sendOtp error:', e)
      return { success: false, message: 'Failed to send OTP' }
    }
  }

  async verifyOtp(data: {
    email: string
    otp: string
    userAddress: string
  }): Promise<{ success: boolean; message: string }> {
    const stored = this.otpStore.get(data.userAddress)
    if (!stored) return { success: false, message: 'No OTP found for this user' }
    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(data.userAddress)
      return { success: false, message: 'OTP has expired' }
    }
    if (stored.otp !== data.otp || stored.email !== data.email) {
      return { success: false, message: 'Invalid OTP or email' }
    }
    this.otpStore.set(data.userAddress, { ...stored, verified: true })
    return { success: true, message: 'OTP verified successfully' }
  }

  async updateUserEmail(data: { email: string; userAddress: string }): Promise<User> {
    const stored = this.otpStore.get(data.userAddress)
    if (!stored || !stored.verified) throw new Error('OTP not verified for this user')
    if (stored.email !== data.email) throw new Error('Email does not match the verified email')

    const user = await this.userRepository.getUserByAddress(data.userAddress)
    if (!user) throw new Error('User not found')

    const updated = await this.userRepository.updateUser(user.id, { email: data.email })
    this.otpStore.delete(data.userAddress)
    return updated
  }
}
