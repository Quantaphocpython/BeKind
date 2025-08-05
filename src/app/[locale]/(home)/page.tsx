import LoadingSpinner from '@/components/shared/LoadingSpinner'
import dynamic from 'next/dynamic'

// Dynamic import for better performance
const LandingPage = dynamic(() => import('@/features/Landing/presentation/pages/LandingPage'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export default function Home() {
  return <LandingPage />
}
