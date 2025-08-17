import { User } from '@/features/Campaign/data/types'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { IUserRepository } from '../../repository/interface/UserRepository.interface'
import { IUserService } from '../interface/UserService.interface'

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async createUserIfNotExists(address: string, name?: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.getUserByAddress(address)

    if (existingUser) {
      return existingUser
    }

    // Generate random name if not provided
    const userName = name || `User_${Math.floor(Math.random() * 10000)}`

    // Create new user if doesn't exist
    const newUser = await this.userRepository.createUser(address, userName)

    return newUser
  }

  async getUserByAddress(address: string): Promise<User | null> {
    return await this.userRepository.getUserByAddress(address)
  }

  async updateUserTrustScore(address: string, trustScore: number): Promise<User> {
    return await this.userRepository.updateUserTrustScore(address, trustScore)
  }

  async updateUserName(address: string, name: string): Promise<User> {
    return await this.userRepository.updateUserName(address, name)
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers()
  }
}
