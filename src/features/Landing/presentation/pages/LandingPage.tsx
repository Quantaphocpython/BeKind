import OpenEffect from '@/components/common/OpenEffect'
import CallToActionSection from '../organisms/CallToActionSection'
import HeroSection from '../organisms/HeroSection'
import PlatformFeaturesSection from '../organisms/PlatformFeaturesSection'
import ProjectsSection from '../organisms/ProjectsSection'
import StatsSection from '../organisms/StatsSection'
import TestimonialsSection from '../organisms/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />

      <OpenEffect animation="slideUp">
        <StatsSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <PlatformFeaturesSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <ProjectsSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <CallToActionSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <TestimonialsSection />
      </OpenEffect>
    </>
  )
}
