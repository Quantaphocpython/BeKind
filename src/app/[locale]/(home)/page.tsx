import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations()

  return (
    <div>
      <h1>{t('Hello World')}</h1>
      <p>{t('This is a test page')}</p>
    </div>
  )
}
