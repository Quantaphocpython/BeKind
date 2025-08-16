import prisma from '@/configs/prisma'
import { User } from '@/features/Campaign/data/types'
import { IUserRepository } from '../interface/UserRepository.interface'

class UserRepository implements IUserRepository {
  async createUser(address: string, name?: string): Promise<User> {
    const user = await prisma.user.create({
      data: {
        address,
        name: name || null,
        trustScore: 0,
      },
    })

    return user
  }

  async getUserByAddress(address: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { address },
    })

    return user
  }

  async updateUserTrustScore(address: string, trustScore: number): Promise<User> {
    const user = await prisma.user.update({
      where: { address },
      data: { trustScore },
    })

    return user
  }

  async updateUserName(address: string, name: string): Promise<User> {
    const user = await prisma.user.update({
      where: { address },
      data: { name },
    })

    return user
  }

  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return users
  }
}

export const userRepository = new UserRepository()
