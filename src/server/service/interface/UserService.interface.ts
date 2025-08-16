import { User } from '@/features/Campaign/data/types'

export interface IUserService {
  createUserIfNotExists(address: string, name?: string): Promise<User>
  getUserByAddress(address: string): Promise<User | null>
  updateUserTrustScore(address: string, trustScore: number): Promise<User>
  updateUserName(address: string, name: string): Promise<User>
  getAllUsers(): Promise<User[]>
}
