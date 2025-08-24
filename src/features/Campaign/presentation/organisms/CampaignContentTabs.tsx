'use client'

import { Icons } from '@/components/icons'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { CampaignDto } from '../../data/dto'
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
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div className="flex-1 min-w-0">
      <Tabs defaultValue="description" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/30 border border-border/50 rounded-xl backdrop-blur-sm relative">
          <motion.div
            className="absolute inset-y-1 bg-background/80 rounded-lg shadow-sm border border-border/20 -z-10"
            initial={false}
            animate={{
              transform: `translateX(${
                activeTab === 'description'
                  ? '0%'
                  : activeTab === 'supporters'
                    ? '100%'
                    : activeTab === 'transactions'
                      ? '200%'
                      : '300%'
              })`,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
            }}
            style={{
              width: '25%',
            }}
          />

          <div className="relative z-10 contents">
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
          </div>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CampaignDescription description={campaign.description} />
          </motion.div>
        </TabsContent>

        <TabsContent value="supporters" className="mt-6">
          <motion.div
            key="supporters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CampaignSupporters supporters={supporters} />
          </motion.div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CampaignTransactions campaignId={campaign.campaignId} />
          </motion.div>
        </TabsContent>

        <TabsContent value="proofs" className="mt-6">
          <motion.div
            key="proofs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProofSection campaignId={campaign.campaignId} campaignOwner={campaign.owner} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

