import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const CampaignDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto py-6">
        {/* Banner Skeleton */}
        <div className="flex items-center justify-between">
          <div className="relative aspect-[16/6] md:aspect-[16/5] w-full overflow-hidden rounded-2xl">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start py-6">
          {/* Left Column - Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              {/* Campaign Info Skeleton */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <CardTitle className="text-xl">
                      <Skeleton className="h-6 w-48" />
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Stats Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      <Skeleton className="h-4 w-16" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      <Skeleton className="h-4 w-20" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      <Skeleton className="h-4 w-16" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              </div>

              {/* Content Tabs Skeleton */}
              <div className="space-y-6">
                {/* Tab Triggers */}
                <div className="flex gap-2 overflow-x-auto">
                  <Skeleton className="h-12 w-32 flex-shrink-0" />
                  <Skeleton className="h-12 w-32 flex-shrink-0" />
                  <Skeleton className="h-12 w-32 flex-shrink-0" />
                  <Skeleton className="h-12 w-32 flex-shrink-0" />
                </div>

                {/* Tab Content */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <CardTitle>
                        <Skeleton className="h-6 w-48" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Donate Section */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="flex flex-col gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
                <CardContent className="px-6 text-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="flex flex-col gap-6">
          {/* Related Campaigns Skeleton */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section Skeleton */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Input */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-lg border bg-card">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-6 ml-auto" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailSkeleton
