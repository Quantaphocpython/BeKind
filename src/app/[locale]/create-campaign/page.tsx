import LoadingSpinner from '@/components/shared/LoadingSpinner'
import dynamic from 'next/dynamic'

const CreateCampaignPage = dynamic(
  () => import('@/features/Campaign/presentation/pages/CreateCampaignPage').then((mod) => mod.CreateCampaignPage),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  },
)

export default function CreateCampaign() {
  return <CreateCampaignPage />
}
