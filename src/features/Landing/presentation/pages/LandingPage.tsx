import Editor from '@/components/common/Editor'
import OpenEffect from '@/components/common/OpenEffect'
import FeaturesSection from '../organisms/FeaturesSection'
import HeroSection from '../organisms/HeroSection'
import ProjectsSection from '../organisms/ProjectsSection'
import StatsSection from '../organisms/StatsSection'
import TestimonialsSection from '../organisms/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <Editor />
      <HeroSection />

      <OpenEffect animation="slideUp">
        <StatsSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <FeaturesSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <ProjectsSection />
      </OpenEffect>

      <OpenEffect animation="slideUp">
        <TestimonialsSection />
      </OpenEffect>
    </>
  )
}
