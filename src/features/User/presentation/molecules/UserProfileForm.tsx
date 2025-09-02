'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTranslations } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { UserDto } from '../../data/dto'
import { UserAvatar } from '../atoms/UserAvatar'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfileFormProps {
  user: UserDto
  onSubmit: (data: ProfileFormData) => void
  onCancel: () => void
  isLoading?: boolean
  className?: string
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const t = useTranslations()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: (user as any).email || '',
    },
  })

  const handleSubmit = (data: ProfileFormData) => {
    onSubmit(data)
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatar address={user.address} size="lg" />
          <div>
            <CardTitle className="text-xl font-bold">{t('Edit Profile')}</CardTitle>
            <CardDescription>{t('Update your profile information')}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Icons.user className="h-4 w-4" />
                    <span>{t('Display Name')}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('Enter your display name')}
                      disabled={isLoading}
                      className="transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {t('This name will be displayed to other users. Leave empty to remain anonymous.')}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Icons.mail className="h-4 w-4" />
                    <span>{t('Email Address')}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t('Enter your email address')}
                      disabled={isLoading}
                      className="transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {t('Email is used for notifications and account recovery. OTP verification required for changes.')}
                  </p>
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button type="submit" disabled={isLoading || !form.formState.isValid} className="flex-1">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t('Saving...') : t('Save Changes')}
              </Button>

              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
                {t('Cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
