'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/shared/hooks'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useUser } from '../../data/hooks'
import { UserProfileCard } from '../molecules/UserProfileCard'
import { UserProfileForm } from '../molecules/UserProfileForm'
import { ProfileSkeleton } from '../organisms/ProfileSkeleton'

export const ProfilePage: React.FC = () => {
  const t = useTranslations()
  const { user, isLoading, error, refetchUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveProfile = async () => {
    try {
      toast.success(t('Profile Updated'), {
        description: t('Your profile has been updated successfully'),
        icon: <Icons.checkCircle className="h-4 w-4" />,
      })

      setIsEditing(false)
      refetchUser()
    } catch (error) {
      toast.error(t('Update Failed'), {
        description: error instanceof Error ? error.message : t('Failed to update profile'),
        icon: <Icons.alertCircle className="h-4 w-4" />,
      })
    }
  }

  if (isLoading || !user) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Icons.alertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-red-600">{t('Error Loading Profile')}</h2>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>

          <Button
            onClick={() => refetchUser()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t('Try Again')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('My Profile')}</h1>
          <p className="text-muted-foreground mt-2">{t('Manage your profile and preferences')}</p>
        </div>

        {isEditing ? (
          <UserProfileForm user={user} onSubmit={handleSaveProfile} onCancel={handleCancelEdit} isLoading={isLoading} />
        ) : (
          <UserProfileCard user={user} onEdit={handleEditProfile} />
        )}
      </div>
    </div>
  )
}
