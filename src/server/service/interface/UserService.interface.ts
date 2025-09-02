import { User } from '@/features/Campaign/data/types'

export interface IUserService {
  createUser(data: { address: string; name?: string; email?: string }): Promise<User>
  getUserByAddress(address: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
  sendOtp(data: { email: string; userAddress: string }): Promise<{ success: boolean; message: string }>
  verifyOtp(data: { email: string; otp: string; userAddress: string }): Promise<{ success: boolean; message: string }>
  updateUserEmail(data: { email: string; userAddress: string }): Promise<User>
}
