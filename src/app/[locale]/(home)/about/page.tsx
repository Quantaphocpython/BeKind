import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

// Dynamic import for better performance
const AboutPage = dynamic(() => import('@/features/About/presentation/pages/AboutPage'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export default function About() {
  return <AboutPage />
}
