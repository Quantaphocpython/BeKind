import { Comment } from '@/features/Campaign/data/types'

export interface ICommentRepository {
  create(data: { campaignId: bigint; userId: string; content: string; parentId?: string }): Promise<Comment>
  list(campaignId: bigint): Promise<Comment[]>
}
