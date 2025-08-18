import LoadingSpinner from '@/components/common/atoms/Loading/LoadingSpinner'
import dynamic from 'next/dynamic'

const ProfileRender = dynamic(() => import('@/features/User/presentation').then((mod) => mod.ProfilePage), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export default function Profile() {
  return <ProfileRender />
}
