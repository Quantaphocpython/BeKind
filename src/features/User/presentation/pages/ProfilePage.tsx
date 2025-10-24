'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from '@/configs/i18n/navigation'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation, useTranslations } from '@/shared/hooks'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useUser } from '../../data/hooks'
import { UserService } from '../../data/services/user.service'
import { UserProfileCard } from '../molecules/UserProfileCard'
import { UserProfileForm } from '../molecules/UserProfileForm'
import { ProfileSkeleton } from '../organisms/ProfileSkeleton'

export const ProfilePage: React.FC = () => {
  const t = useTranslations()
  const { user, isLoading, error, refetchUser } = useUser()
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const userService = useMemo(() => container.get(TYPES.UserService) as UserService, [])

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const sendOtpMutation = useApiMutation((data: { email: string; userAddress: string }) => userService.sendOtp(data), {
    onSuccess: () => {
      toast.success(t('OTP Sent'), {
        description: t('Please check your email for the verification code'),
        icon: <Icons.mail className="h-4 w-4" />,
      })
      setIsOtpSent(true)
    },
    onError: (e: any) => {
      toast.error(t('Failed to Send OTP'), {
        description: e?.message || 'Error',
        icon: <Icons.alertCircle className="h-4 w-4" />,
      })
    },
  })

  const verifyOtpMutation = useApiMutation(
    (data: { email: string; otp: string; userAddress: string }) => userService.verifyOtp(data),
    {
      onSuccess: () => {
        toast.success(t('OTP Verified'), {
          description: t('Email verified successfully'),
          icon: <Icons.checkCircle className="h-4 w-4" />,
        })
        handleUpdateEmail()
      },
      onError: (e: any) => {
        toast.error(t('Invalid OTP'), {
          description: e?.message || 'Error',
          icon: <Icons.alertCircle className="h-4 w-4" />,
        })
      },
    },
  )

  const updateEmailMutation = useApiMutation(
    (data: { email: string; userAddress: string }) => userService.updateUserEmail(data),
    {
      onSuccess: () => {
        toast.success(t('Email Updated'), {
          description: t('Your email has been updated successfully'),
          icon: <Icons.checkCircle className="h-4 w-4" />,
        })
        setIsOtpDialogOpen(false)
        setIsEditing(false)
        setOtp('')
        setPendingEmail('')
        setIsOtpSent(false)
        refetchUser()
      },
      onError: (e: any) => {
        toast.error(t('Update Failed'), {
          description: e?.message || 'Error',
          icon: <Icons.alertCircle className="h-4 w-4" />,
        })
      },
    },
  )

  const handleSaveProfile = async (data: { name?: string; email?: string }) => {
    if (!address) {
      toast.error(t('Please connect your wallet'))
      return
    }
    if (data.email && data.email !== (user as any)?.email) {
      setPendingEmail(data.email)
      setIsOtpDialogOpen(true)
      setIsOtpSent(false)
      setOtp('')
      sendOtpMutation.mutate({ email: data.email, userAddress: address })
      return
    }
    if (data.name !== user?.name) {
      toast.success(t('Profile Updated'), {
        description: t('Your profile has been updated successfully'),
        icon: <Icons.checkCircle className="h-4 w-4" />,
      })
      setIsEditing(false)
      refetchUser()
    }
  }

  const handleSendOtp = () => {
    if (!address || !pendingEmail) return
    sendOtpMutation.mutate({ email: pendingEmail, userAddress: address })
  }

  const handleVerifyOtp = () => {
    if (!address || !pendingEmail || !otp) return
    verifyOtpMutation.mutate({ email: pendingEmail, otp, userAddress: address })
  }

  const handleUpdateEmail = () => {
    if (!address || !pendingEmail) return
    updateEmailMutation.mutate({ email: pendingEmail, userAddress: address })
  }

  if (isLoading || !user) {
    return <ProfileSkeleton />
  }

  if (!isConnected) {
    // When disconnected on profile page, redirect home
    router.push('/')
    return null
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
          <UserProfileForm
            user={user}
            onSubmit={handleSaveProfile as any}
            onCancel={handleCancelEdit}
            isLoading={isLoading}
          />
        ) : (
          <UserProfileCard user={user} onEdit={handleEditProfile} />
        )}

        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icons.mail className="h-5 w-5 text-primary" />
                {t('Email Verification')}
              </DialogTitle>
              <DialogDescription>
                {t('We need to verify your new email address. Please check your email for the verification code.')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{t('New Email Address')}</div>
                <div className="font-medium">{pendingEmail}</div>
              </div>

              {!isOtpSent ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t('Click the button below to send a verification code to your email.')}
                  </p>
                  <Button onClick={handleSendOtp} disabled={sendOtpMutation.isPending} className="w-full">
                    {sendOtpMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('Sending...')}
                      </div>
                    ) : (
                      t('Send Verification Code')
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otp">{t('Verification Code')}</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Enter the 6-digit code sent to your email')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsOtpSent(false)
                        setOtp('')
                      }}
                      className="flex-1"
                    >
                      {t('Back')}
                    </Button>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={verifyOtpMutation.isPending || otp.length !== 6}
                      className="flex-1"
                    >
                      {verifyOtpMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t('Verifying...')}
                        </div>
                      ) : (
                        t('Verify & Update')
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
