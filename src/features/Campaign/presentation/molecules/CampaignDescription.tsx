'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignContentLayout } from './CampaignContentLayout'

interface CampaignDescriptionProps {
  description: string
}

export const CampaignDescription = ({ description }: CampaignDescriptionProps) => {
  const t = useTranslations()

  return (
    <CampaignContentLayout
      icon={<Icons.page className="h-6 w-6" />}
      title={t('Campaign Description')}
      description={t('Detailed information about this charitable campaign')}
    >
      <ParsedContent
        contentClassName="prose prose-lg max-w-none [overflow-wrap:anywhere] prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
        htmlContent={description}
      />
    </CampaignContentLayout>
  )
}
