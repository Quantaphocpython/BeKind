import LoadingSpinner from '@/components/shared/LoadingSpinner'
import dynamic from 'next/dynamic'

const CampaignsPage = dynamic(
  () => import('@/features/Campaign/presentation/pages/CampaignsPage').then((mod) => mod.CampaignsPage),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  },
)

export default function Campaigns() {
  return <CampaignsPage />
}
