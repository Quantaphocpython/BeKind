import NotFoundPage from '@/components/common/pages/NotFoundPage'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations()

  return <NotFoundPage />
}

