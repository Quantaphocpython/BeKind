'use client'

import { Icons } from '@/components/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignDescription } from '../molecules/CampaignDescription'
import { CampaignSidebar } from '../molecules/CampaignSidebar'
import { CampaignSupporters } from '../molecules/CampaignSupporters'
import { CampaignTransactions } from '../molecules/CampaignTransactions'

interface CampaignContentTabsProps {
  campaign: CampaignDto
  supporters: VoteDto[]
}

export const CampaignContentTabs = ({ campaign, supporters }: CampaignContentTabsProps) => {
  const t = useTranslations()
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="mb-6 h-12 bg-muted/50 p-1 rounded-xl relative z-20">
        <TabsTrigger
          value="description"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 relative z-10 cursor-pointer"
        >
          <Icons.edit className="h-4 w-4" />
          {t('Description')}
        </TabsTrigger>
        <TabsTrigger
          value="supporters"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 relative z-10 cursor-pointer"
        >
          <Icons.users className="h-4 w-4" />
          {t('Supporters')}
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 relative z-10 cursor-pointer"
        >
          <Icons.trendingUp className="h-4 w-4" />
          {t('Transactions')}
        </TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
        <div className="min-h-[600px]">
          <TabsContent value="description" className="mt-0">
            <CampaignDescription description={campaign.description} />
          </TabsContent>
          <TabsContent value="supporters" className="mt-0">
            <CampaignSupporters supporters={supporters} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-0">
            <CampaignTransactions campaignId={campaign.campaignId} />
          </TabsContent>
        </div>

        <aside className="hidden lg:block w-full max-w-[320px]">
          <CampaignSidebar campaign={campaign} />
        </aside>
      </div>
    </Tabs>
  )
}
