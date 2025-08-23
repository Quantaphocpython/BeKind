import { User } from '@/features/Campaign/data/types'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../container/types'
import type { IUserRepository } from '../../repository/interface/UserRepository.interface'
import { IUserService } from '../interface/UserService.interface'

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

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
}
