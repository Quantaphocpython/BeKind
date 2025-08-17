import { SlideUp } from '@/components/common/organisms/OpenEffect'
import AboutHero from '../organisms/AboutHero'
import AboutStats from '../organisms/AboutStats'
import AboutTeam from '../organisms/AboutTeam'
import AboutValues from '../organisms/AboutValues'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />

      <SlideUp>
        <AboutStats />
      </SlideUp>

      <SlideUp>
        <AboutValues />
      </SlideUp>

      <SlideUp>
        <AboutTeam />
      </SlideUp>
    </div>
  )
}
