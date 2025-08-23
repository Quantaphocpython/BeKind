'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { CampaignContentHeader } from './CampaignContentHeader'

interface CampaignDescriptionProps {
  description: string
}

export const CampaignDescription = ({ description }: CampaignDescriptionProps) => {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <CampaignContentHeader
        icon={<Icons.page className="h-6 w-6" />}
        title={t('Campaign Description')}
        description={t('Detailed information about this charitable campaign')}
      />

      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30 min-h-[500px]">
        <CardContent className="prose-lg max-w-none p-6">
          <ParsedContent
            contentClassName="prose prose-lg max-w-none [overflow-wrap:anywhere] prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            htmlContent={description}
          />
        </CardContent>
      </Card>
    </div>
  )
}
