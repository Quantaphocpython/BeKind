import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

const CreateCampaignPage = dynamic(
  () => import('@/features/Campaign/presentation/pages/CreateCampaignPage').then((mod) => mod.CreateCampaignPage),
  {
    loading: () => <LoadingSpinner />,
  },
)

export default function CreateCampaign() {
  return <CreateCampaignPage />
}
