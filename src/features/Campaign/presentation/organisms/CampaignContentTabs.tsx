'use client'

import { Icons } from '@/components/icons'
import { AnimatedTabs, type TabItem } from '@/components/ui/animated-tabs'
import type { VoteDto } from '@/server/dto/campaign.dto'
import type { CampaignDto } from '../../data/dto'
import { CampaignDescription } from '../molecules/CampaignDescription'
import { CampaignSupporters } from '../molecules/CampaignSupporters'
import { CampaignTransactions } from '../molecules/CampaignTransactions'
import { ProofSection } from '../molecules/ProofSection'

interface CampaignContentTabsProps {
  campaign: CampaignDto
  supporters: VoteDto[]
}

export const CampaignContentTabs = ({ campaign, supporters }: CampaignContentTabsProps) => {
  const tabs: TabItem[] = [
    {
      value: 'description',
      icon: <Icons.page className="h-4 w-4" />,
      labelKey: 'Description',
      shortLabelKey: 'Desc',
      content: <CampaignDescription description={campaign.description} />,
    },
    {
      value: 'supporters',
      icon: <Icons.users className="h-4 w-4" />,
      labelKey: 'Supporters',
      shortLabelKey: 'Sup',
      badgeCount: supporters.length,
      content: <CampaignSupporters supporters={supporters} />,
    },
    {
      value: 'transactions',
      icon: <Icons.activity className="h-4 w-4" />,
      labelKey: 'Transactions',
      shortLabelKey: 'Tx',
      content: (
        <CampaignTransactions
          campaignId={campaign.campaignId}
          campaignOwner={campaign.owner}
          campaignGoal={campaign.goal}
          campaignBalance={campaign.balance}
        />
      ),
    },
    {
      value: 'proofs',
      icon: <Icons.clipboardList className="h-4 w-4" />,
      labelKey: 'Proofs',
      shortLabelKey: 'Proof',
      content: <ProofSection campaignId={campaign.campaignId} campaignOwner={campaign.owner} />,
    },
  ]

  return (
    <div className="flex-1 min-w-0">
      <AnimatedTabs tabs={tabs} defaultValue="description" className="w-full" />
    </div>
  )
}

