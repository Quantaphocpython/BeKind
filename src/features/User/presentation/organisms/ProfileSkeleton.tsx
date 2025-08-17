import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Profile Card Skeleton */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Trust Score Skeleton */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <Separator />

            {/* User Details Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Edit Button Skeleton */}
            <Separator />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
