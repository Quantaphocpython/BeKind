'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import type { CommentDto } from '@/server/dto/campaign.dto'
import { useApiMutation, useApiQuery } from '@/shared/hooks'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface CommentSectionProps {
  campaignId: string
}

export const CommentSection = ({ campaignId }: CommentSectionProps) => {
  const { address } = useAccount()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    error,
  } = useApiQuery<CommentDto[]>(
    ['campaign-comments', campaignId],
    () =>
      fetch(`/api/campaigns/${campaignId}?action=comments`)
        .then((res) => res.json())
        .then((data) => data.data || []),
    {
      enabled: Boolean(campaignId),
    },
  )

  // Create comment mutation
  const createCommentMutation = useApiMutation(
    (data: { content: string; parentId?: string }) =>
      fetch(`/api/campaigns/${campaignId}?action=comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: data.content,
          parentId: data.parentId,
          userId: address,
        }),
      }).then((res) => res.json()),
    {
      invalidateQueries: [['campaign-comments', campaignId]],
      onSuccess: () => {
        setNewComment('')
        setReplyingTo(null)
        setReplyText('')
        toast.success('Comment posted successfully!')
      },
      onError: (error) => {
        toast.error('Failed to post comment')
        console.error('Comment error:', error)
      },
    },
  )

  // Group comments by parent (top-level comments)
  const topLevelComments = comments.filter((comment) => !comment.parentId)
  const replyComments = comments.filter((comment) => comment.parentId)

  const handleSubmitComment = async () => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }
    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setIsSubmitting(true)
    try {
      await createCommentMutation.mutateAsync({ content: newComment.trim() })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }
    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }

    setIsSubmitting(true)
    try {
      await createCommentMutation.mutateAsync({
        content: replyText.trim(),
        parentId,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRepliesForComment = (commentId: string) => {
    return replyComments.filter((reply) => reply.parentId === commentId)
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <CardTitle className="text-xl">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <CardTitle className="text-xl">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="size-10">
              <AvatarImage src={address ? generateUserAvatarSync(address) : undefined} alt="You" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={!address || isSubmitting}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!address || !newComment.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-6">
          {topLevelComments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            topLevelComments.map((comment) => {
              const replies = getRepliesForComment(comment.id)
              return (
                <div key={comment.id} className="space-y-4">
                  {/* Main comment */}
                  <div className="flex gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={generateUserAvatarSync(comment.userId)} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.user?.name || getShortAddress(comment.userId)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          disabled={!address}
                          className="text-xs"
                        >
                          <Icons.messageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        {replies.length > 0 && (
                          <span className="text-xs text-muted-foreground">{replies.length} replies</span>
                        )}
                      </div>

                      {/* Reply form */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-3">
                            <Avatar className="size-8">
                              <AvatarImage src={address ? generateUserAvatarSync(address) : undefined} alt="You" />
                              <AvatarFallback>YO</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[60px] resize-none text-sm"
                                disabled={!address || isSubmitting}
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!address || !replyText.trim() || isSubmitting}
                                  size="sm"
                                  variant="outline"
                                >
                                  {isSubmitting ? 'Posting...' : 'Reply'}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyText('')
                                  }}
                                  size="sm"
                                  variant="ghost"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="ml-8 mt-4 space-y-3">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="size-8">
                                <AvatarImage src={generateUserAvatarSync(reply.userId)} alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {reply.user?.name || getShortAddress(reply.userId)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
