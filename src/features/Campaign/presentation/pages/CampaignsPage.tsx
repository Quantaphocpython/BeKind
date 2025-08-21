'use client'

import { CampaignList } from '../organisms/CampaignList'

export const CampaignsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 pt-12 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Discover and support charitable campaigns
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Explore featured causes, track progress transparently, and make an impact with secure on-chain
                donations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <CampaignList />
      </div>
    </div>
  )
}
