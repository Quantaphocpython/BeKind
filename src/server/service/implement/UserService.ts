import { User } from '@/features/Campaign/data/types'
import { userRepository } from '@/server/repository/implement/UserRepository'
import { IUserService } from '../interface/UserService.interface'

class UserService implements IUserService {
  async createUserIfNotExists(address: string, name?: string): Promise<User> {
    // Check if user already exists
    const existingUser = await userRepository.getUserByAddress(address)

    if (existingUser) {
      return existingUser
    }

    // Create new user if doesn't exist
    const newUser = await userRepository.createUser(address, name)

    return newUser
  }

  async getUserByAddress(address: string): Promise<User | null> {
    return await userRepository.getUserByAddress(address)
  }

  async updateUserTrustScore(address: string, trustScore: number): Promise<User> {
    return await userRepository.updateUserTrustScore(address, trustScore)
  }

  async updateUserName(address: string, name: string): Promise<User> {
    return await userRepository.updateUserName(address, name)
  }

  async getAllUsers(): Promise<User[]> {
    return await userRepository.getAllUsers()
  }
}

export const userService = new UserService()
