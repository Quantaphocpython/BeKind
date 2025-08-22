'use client'

import ParsedContent from '@/components/common/organisms/Editor/ParsedContent'
import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/shared/hooks/useTranslations'

interface CampaignDescriptionProps {
  description: string
}

export const CampaignDescription = ({ description }: CampaignDescriptionProps) => {
  const t = useTranslations()

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30 min-h-[600px]">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icons.page className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              {t('Campaign Description')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('Detailed information about this charitable campaign')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="prose-lg max-w-none">
        <ParsedContent
          contentClassName="prose prose-lg max-w-none [overflow-wrap:anywhere] prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
          htmlContent={description}
        />
      </CardContent>
    </Card>
  )
}
