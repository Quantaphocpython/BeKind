import CallToActionSection from '../organisms/CallToActionSection'
import FAQSection from '../organisms/FAQSection'
import HeroSection from '../organisms/HeroSection'
import PlatformFeaturesSection from '../organisms/PlatformFeaturesSection'
import ProjectsSection from '../organisms/ProjectsSection'
import StatsSection from '../organisms/StatsSection'
import TestimonialsSection from '../organisms/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PlatformFeaturesSection />
      <ProjectsSection />
      <CallToActionSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
