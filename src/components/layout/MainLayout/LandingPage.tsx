import FeaturesSection from '../../../features/Landing/presentation/organisms/FeaturesSection'
import HeroSection from '../../../features/Landing/presentation/organisms/HeroSection'
import NewsletterSection from '../../../features/Landing/presentation/organisms/NewsletterSection'
import ProjectsSection from '../../../features/Landing/presentation/organisms/ProjectsSection'
import StatsSection from '../../../features/Landing/presentation/organisms/StatsSection'
import TestimonialsSection from '../../../features/Landing/presentation/organisms/TestimonialsSection'

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
