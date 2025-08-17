import OpenEffect from '@/components/common/organisms/OpenEffect'
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

      <OpenEffect animation="growIn">
        <StatsSection />
      </OpenEffect>

      <OpenEffect animation="growIn">
        <PlatformFeaturesSection />
      </OpenEffect>

      <OpenEffect animation="growIn">
        <ProjectsSection />
      </OpenEffect>

      <OpenEffect animation="growIn">
        <CallToActionSection />
      </OpenEffect>

      <OpenEffect animation="growIn">
        <TestimonialsSection />
      </OpenEffect>
    </>
  )
}
