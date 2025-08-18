import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

// Dynamic import for better performance
const ContactPage = dynamic(() => import('@/features/Contact/presentation/pages/ContactPage'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export default function Contact() {
  return <ContactPage />
}
