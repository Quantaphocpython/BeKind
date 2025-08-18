'use client'

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { useTranslations } from '@/shared/hooks'
import { CreateCampaignForm } from '../molecules/CreateCampaignForm'

export const CreateCampaignPage = () => {
  const t = useTranslations()

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_60%)]"
        aria-hidden
      />
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <AnimatedGradientText className="text-4xl md:text-6xl font-bold mb-3">
              {t('Create Your Campaign')}
            </AnimatedGradientText>
            <div className="mx-auto h-0.5 w-24 rounded bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <AnimatedShinyText className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('Start making a difference today. Create a charitable campaign and connect with donors worldwide.')}
          </AnimatedShinyText>
        </div>

        {/* Form Section */}
        <div className="flex justify-center">
          <div className="w-full">
            <CreateCampaignForm />
          </div>
        </div>
      </div>
    </div>
  )
}
