'use client'

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { CreateCampaignForm } from '../molecules/CreateCampaignForm'

export const CreateCampaignPage = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <AnimatedGradientText className="text-4xl md:text-6xl font-bold mb-4">
              Create Your Campaign
            </AnimatedGradientText>
          </div>
          <AnimatedShinyText className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start making a difference today. Create a charitable campaign and connect with donors worldwide.
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
