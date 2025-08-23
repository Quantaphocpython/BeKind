'use client'

import { Icons } from '@/components/icons'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { VoteDto } from '@/server/dto/campaign.dto'
import { CampaignDto } from '../../data/dto'
import { CampaignDescription } from '../molecules/CampaignDescription'
import { CampaignSupporters } from '../molecules/CampaignSupporters'
import { CampaignTabTrigger } from '../molecules/CampaignTabTrigger'
import { CampaignTransactions } from '../molecules/CampaignTransactions'
import { ProofSection } from '../molecules/ProofSection'

interface CampaignContentTabsProps {
  campaign: CampaignDto
  supporters: VoteDto[]
}

export const CampaignContentTabs = ({ campaign, supporters }: CampaignContentTabsProps) => {
  return (
    <div className="flex-1 min-w-0">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/30 border border-border/50 rounded-xl backdrop-blur-sm">
          <CampaignTabTrigger
            value="description"
            icon={<Icons.page className="h-4 w-4" />}
            labelKey="Description"
            shortLabelKey="Desc"
          />
          <CampaignTabTrigger
            value="supporters"
            icon={<Icons.users className="h-4 w-4" />}
            labelKey="Supporters"
            shortLabelKey="Sup"
            badgeCount={supporters.length}
          />
          <CampaignTabTrigger
            value="transactions"
            icon={<Icons.activity className="h-4 w-4" />}
            labelKey="Transactions"
            shortLabelKey="Tx"
          />
          <CampaignTabTrigger
            value="proofs"
            icon={<Icons.clipboardList className="h-4 w-4" />}
            labelKey="Proofs"
            shortLabelKey="Proof"
          />
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <CampaignDescription description={campaign.description} />
        </TabsContent>

        <TabsContent value="supporters" className="mt-6">
          <CampaignSupporters supporters={supporters} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <CampaignTransactions campaignId={campaign.campaignId} />
        </TabsContent>

        <TabsContent value="proofs" className="mt-6">
          <ProofSection campaignId={campaign.campaignId} campaignOwner={campaign.owner} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
