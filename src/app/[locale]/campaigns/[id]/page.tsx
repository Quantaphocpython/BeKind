import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

const CampaignDetailPage = dynamic(
  () => import('@/features/Campaign/presentation/pages/CampaignDetailPage').then((mod) => mod.CampaignDetailPage),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  },
)

export default function CampaignDetail() {
  return <CampaignDetailPage />
}
