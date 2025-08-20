import prisma from '@/configs/prisma'
import { Comment } from '@/features/Campaign/data/types'
import { injectable } from 'inversify'
import { ICommentRepository } from '../interface/CommentRepository.interface'

@injectable()
export class CommentRepository implements ICommentRepository {
  async create(data: { campaignId: bigint; userId: string; content: string; parentId?: string }): Promise<Comment> {
    return await prisma.comment.create({
      data: {
        campaignId: data.campaignId,
        userId: data.userId,
        content: data.content,
        parentId: data.parentId ?? null,
      },
    })
  }

  async list(campaignId: bigint): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { campaignId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
  }
}
