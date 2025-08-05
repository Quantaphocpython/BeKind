import FeaturesSection from '../organisms/FeaturesSection'
import HeroSection from '../organisms/HeroSection'
import NewsletterSection from '../organisms/NewsletterSection'
import ProjectsSection from '../organisms/ProjectsSection'
import StatsSection from '../organisms/StatsSection'
import TestimonialsSection from '../organisms/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
