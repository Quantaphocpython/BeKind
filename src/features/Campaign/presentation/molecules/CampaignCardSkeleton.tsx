import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const CampaignCardSkeleton = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="w-full aspect-[16/9] bg-accent animate-pulse" />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-6 w-16 ml-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Section */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          {/* Amount Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          {/* Campaign Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          {/* Action Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
