import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

interface I18nProviderProps {
  children: React.ReactNode
  locale: string
}

const I18nProvider = async ({ children, locale }: I18nProviderProps) => {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  )
}

export default I18nProvider
