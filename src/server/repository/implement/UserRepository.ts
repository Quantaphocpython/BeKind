import prisma from '@/configs/prisma'
import { User } from '@/features/Campaign/data/types'
import { injectable } from 'inversify'
import { IUserRepository } from '../interface/UserRepository.interface'

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(data: { address: string; name?: string; email?: string }): Promise<User> {
    return await prisma.user.create({
      data: {
        address: data.address,
        name: data.name,
        email: data.email,
      },
    })
  }

  async getUserByAddress(address: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { address },
    })
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    })
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    })
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
