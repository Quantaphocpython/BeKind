'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { container, TYPES } from '@/features/Common/container'
import { UserDisplay, useUser } from '@/features/User'
import type { CommentDto } from '@/server/dto/campaign.dto'
import { useApiMutation, useApiQuery, useTranslations } from '@/shared/hooks'
import { formatRelativeTime } from '@/shared/utils/time'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CampaignService } from '../../data/services/campaign.service'
import { CommentSectionSkeleton } from './CommentSectionSkeleton'

interface CommentSectionProps {
  campaignId: string
}

interface CommentWithReplies extends CommentDto {
  replies: CommentDto[]
}

export const CommentSection = ({ campaignId }: CommentSectionProps) => {
  const { address } = useAccount()
  const { user: currentUser } = useUser()
  const t = useTranslations()

  // Get current locale for date formatting
  const locale = typeof window !== 'undefined' ? window.navigator.language.split('-')[0] : 'en'
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [showAllComments, setShowAllComments] = useState(false)

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

  console.log('comments', comments)

  // Create comment mutation
  const createCommentMutation = useApiMutation(
    (data: { content: string; parentId?: string }) =>
      campaignService
        .createComment(campaignId, {
          content: data.content,
          parentId: data.parentId,
          userAddress: address!,
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

  // Group comments by parent (top-level comments with their replies)
  const groupedComments = useMemo(() => {
    const topLevelComments = comments.filter((comment) => !comment.parentId)
    const replyComments = comments.filter((comment) => comment.parentId)

    return topLevelComments.map(
      (comment): CommentWithReplies => ({
        ...comment,
        replies: replyComments.filter((reply) => reply.parentId === comment.id),
      }),
    )
  }, [comments])

  // Show only first 3 comments initially, or all if showAllComments is true
  const displayedComments = showAllComments ? groupedComments : groupedComments.slice(0, 3)
  const hasMoreComments = groupedComments.length > 3

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

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    setReplyText('')
    // Auto-expand replies when starting to reply
    if (!expandedComments.has(commentId)) {
      setExpandedComments((prev) => new Set([...prev, commentId]))
    }
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
            {t('Share feedback respectfully and stay on topic.')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <div className="space-y-3">
          {/* User info above input */}
          {address && (
            <div className="flex items-center gap-3 pb-2">
              <UserDisplay
                address={currentUser?.address || address}
                name={currentUser?.name || undefined}
                size="sm"
                showAddress={false}
                className="flex-shrink-0"
              />
              <span className="text-sm text-muted-foreground">{t('Share your thoughts about this campaign')}</span>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder={address ? t('Write a thoughtful comment...') : t('Connect your wallet to comment')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[88px] resize-none border-2 focus:border-primary/50 transition-colors"
              disabled={!address || isSubmitting}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {!address ? <span>{t('Wallet not connected')}</span> : <span />}
              <Button
                onClick={handleSubmitComment}
                disabled={!address || !newComment.trim() || isSubmitting}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? t('Posting...') : t('Post Comment')}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {displayedComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg border bg-card">
              <Icons.messageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t('No comments yet.')}</p>
              <p className="text-xs text-muted-foreground">{t('Be the first to start the conversation.')}</p>
            </div>
          ) : (
            displayedComments.map((comment) => {
              const hasReplies = comment.replies.length > 0
              const isExpanded = expandedComments.has(comment.id)
              const isReplying = replyingTo === comment.id

              return (
                <div key={comment.id} className="space-y-3">
                  {/* Main comment */}
                  <div className="group relative">
                    <div className="flex gap-3 p-4 rounded-xl border bg-card hover:bg-muted/40 transition-all duration-200 hover:shadow-sm">
                      <UserDisplay
                        address={comment.user?.address}
                        name={comment.user?.name || undefined}
                        size="md"
                        showAddress={false}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatRelativeTime(new Date(comment.createdAt), locale)}
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(comment.user?.address || comment.userId)
                                toast.success('Address copied')
                              } catch {
                                toast.error('Failed to copy')
                              }
                            }}
                            className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy address"
                          >
                            📋
                          </button>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReplyClick(comment.id)}
                            disabled={!address}
                            className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                          >
                            <Icons.messageSquare className="h-3 w-3 mr-1" />
                            {t('Reply')}
                          </Button>
                          {hasReplies && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReplies(comment.id)}
                              className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                            >
                              <Icons.chevronDown
                                className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                              {isExpanded ? t('Hide') : t('Show')} {comment.replies.length}{' '}
                              {comment.replies.length === 1 ? t('reply') : t('replies')}
                            </Button>
                          )}
                        </div>

                        {/* Reply form */}
                        {isReplying && (
                          <div className="mt-3 space-y-2">
                            <div className="flex gap-3">
                              <UserDisplay
                                address={currentUser?.address || address}
                                name={currentUser?.name || undefined}
                                size="sm"
                                showAddress={false}
                                className="flex-shrink-0"
                              />
                              <div className="flex-1 space-y-2">
                                <Textarea
                                  placeholder={t('Write a reply...')}
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="min-h-[60px] resize-none text-sm border-2 focus:border-primary/50 transition-colors"
                                  disabled={!address || isSubmitting}
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={() => handleSubmitReply(comment.id)}
                                    disabled={!address || !replyText.trim() || isSubmitting}
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    {isSubmitting ? t('Posting...') : t('Reply')}
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyText('')
                                    }}
                                    size="sm"
                                    variant="outline"
                                  >
                                    {t('Cancel')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    {hasReplies && isExpanded && (
                      <div className="ml-8 mt-3 space-y-3 border-l-2 border-muted/50 pl-4">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <UserDisplay
                              address={reply.user?.address}
                              name={reply.user?.name || undefined}
                              size="sm"
                              showAddress={false}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(new Date(reply.createdAt), locale)}
                                </span>
                              </div>
                              <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Show more comments button */}
          {hasMoreComments && !showAllComments && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllComments(true)}
                className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
              >
                <Icons.chevronDown className="h-4 w-4 mr-2" />
                {t('Show more comments')} ({groupedComments.length - 3} {t('more')})
              </Button>
            </div>
          )}

          {/* Show less comments button */}
          {hasMoreComments && showAllComments && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllComments(false)}
                className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
              >
                <Icons.chevronDown className="h-4 w-4 mr-2 rotate-180" />
                {t('Show less comments')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
