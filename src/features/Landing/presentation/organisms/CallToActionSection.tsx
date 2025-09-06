'use client'

import { Button } from '@/components/ui/button'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useTranslations } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import { useRouter } from 'next/navigation'

export default function CallToActionSection() {
  const t = useTranslations()
  const router = useRouter()

  const handleCreateCampaign = () => {
    const url = routeConfig(RouteEnum.CreateCampaign)
    router.push(url)
  }

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    router.push(RouteEnum.About)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-500/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t('Ready to Make a Difference?')}
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            {t('Join thousands of campaign creators who are already making an impact on our platform.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleCreateCampaign}
              size="lg"
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold"
            >
              {t('Start Your Campaign Today')}
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className="px-6 py-3 border border-border text-foreground font-semibold hover:bg-accent transition-colors"
            >
              {t('Learn More')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
