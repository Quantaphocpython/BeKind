'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { container, TYPES } from '@/features/Common/container'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import type { CommentDto } from '@/server/dto/campaign.dto'
import { useApiMutation, useApiQuery, useTranslations } from '@/shared/hooks'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CampaignService } from '../../data/services/campaign.service'
import { CommentSectionSkeleton } from './CommentSectionSkeleton'

interface CommentSectionProps {
  campaignId: string
}

export const CommentSection = ({ campaignId }: CommentSectionProps) => {
  const { address } = useAccount()
  const t = useTranslations()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get<CampaignService>(TYPES.CampaignService), [])

  // Fetch comments
  const { data: comments = [], isLoading } = useApiQuery<CommentDto[]>(
    ['campaign-comments', campaignId],
    () => campaignService.getCampaignComments(campaignId),
    {
      enabled: Boolean(campaignId),
      select: (response) => response.data || [],
    },
  )

  // Create comment mutation
  const createCommentMutation = useApiMutation(
    (data: { content: string; parentId?: string }) =>
      campaignService
        .createComment(campaignId, {
          content: data.content,
          parentId: data.parentId,
          userId: address!,
        })
        .then((res) => res.data),
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

  if (isLoading) return <CommentSectionSkeleton />

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.messageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{t('Comments')}</CardTitle>
            <span className="ml-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
              {comments.length}
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Share feedback respectfully and stay on topic.
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="size-10 ring-2 ring-offset-1 ring-primary/20">
              <AvatarImage src={address ? generateUserAvatarSync(address) : undefined} alt="You" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder={address ? t('Write a thoughtful comment...') : t('Connect your wallet to comment')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[88px] resize-none"
                disabled={!address || isSubmitting}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {!address ? <span>Wallet not connected</span> : <span />}
                <Button
                  onClick={handleSubmitComment}
                  disabled={!address || !newComment.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? t('Posting...') : t('Post Comment')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {topLevelComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
              <Icons.messageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t('No comments yet.')}</p>
              <p className="text-xs text-muted-foreground">{t('Be the first to start the conversation.')}</p>
            </div>
          ) : (
            topLevelComments.map((comment) => {
              const replies = getRepliesForComment(comment.id)
              return (
                <div key={comment.id} className="space-y-3">
                  {/* Main comment */}
                  <div className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
                    <Avatar className="size-10">
                      <AvatarImage src={generateUserAvatarSync(comment.userId)} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {comment.user?.name || getShortAddress(comment.userId)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(comment.userId)
                              toast.success('Address copied')
                            } catch {
                              toast.error('Failed to copy')
                            }
                          }}
                          className="ml-auto text-[11px] text-muted-foreground hover:text-primary transition-colors"
                          title="Copy address"
                        >
                          📋
                        </button>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          disabled={!address}
                          className="h-8 px-2 text-xs"
                        >
                          <Icons.messageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        {replies.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {replies.length} repl{replies.length > 1 ? 'ies' : 'y'}
                          </span>
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
                                placeholder="Write a reply…"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[60px] resize-none text-sm"
                                disabled={!address || isSubmitting}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!address || !replyText.trim() || isSubmitting}
                                  size="sm"
                                  variant="outline"
                                >
                                  {isSubmitting ? 'Posting…' : 'Reply'}
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
                        <div className="ml-6 md:ml-10 mt-3 border-l pl-4 space-y-3">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="size-8">
                                <AvatarImage src={generateUserAvatarSync(reply.userId)} alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium truncate">
                                    {reply.user?.name || getShortAddress(reply.userId)}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {new Date(reply.createdAt).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                  {reply.content}
                                </p>
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
