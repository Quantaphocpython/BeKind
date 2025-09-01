import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

const CreateProofPage = dynamic(
  () => import('@/features/Campaign/presentation/pages/CreateProofPage').then((mod) => mod.CreateProofPage),
  {
    loading: () => <LoadingSpinner />,
  },
)

export default function CreateProof() {
  return <CreateProofPage />
}
