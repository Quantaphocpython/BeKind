'use client'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from '@/shared/hooks'
import React from 'react'
import { UserDto } from '../../data/dto'
import { getShortAddress } from '../../data/utils'
import { UserAvatar } from '../atoms/UserAvatar'

interface UserProfileCardProps {
  user: UserDto
  onEdit?: () => void
  className?: string
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onEdit, className = '' }) => {
  const t = useTranslations()

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return t('Excellent')
    if (score >= 60) return t('Good')
    if (score >= 40) return t('Fair')
    return t('Poor')
  }

  // Format date consistently to prevent hydration mismatch
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UserAvatar address={user.address} size="xl" />
        </div>
        <CardTitle className="text-2xl font-bold">{user.name || t('Anonymous User')}</CardTitle>
        <CardDescription className="text-base">{getShortAddress(user.address)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trust Score */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icons.shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{t('Trust Score')}</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Badge className={`text-lg px-4 py-2 ${getTrustScoreColor(user.trustScore)}`}>{user.trustScore}/100</Badge>
            <Badge variant="outline" className="text-sm">
              {getTrustScoreLabel(user.trustScore)}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t('Member Since')}</span>
            <span className="text-sm">{formatDate(user.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t('Wallet Address')}</span>
            <span className="text-sm font-mono text-muted-foreground">{getShortAddress(user.address)}</span>
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <>
            <Separator />
            <Button onClick={onEdit} className="w-full" variant="outline">
              <Icons.edit className="h-4 w-4 mr-2" />
              {t('Edit Profile')}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
