import { User } from '@/features/Campaign/data/types'

export interface IUserService {
  createUser(data: { address: string; name?: string; email?: string }): Promise<User>
  getUserByAddress(address: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
}
