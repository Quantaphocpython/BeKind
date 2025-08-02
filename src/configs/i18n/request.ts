import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const header = await headers()
  const localeFromHeader = header.get('x-next-intl-locale')
  const currentLocale = localeFromHeader || routing.defaultLocale

  try {
    const messages = (await import(`@/resources/locales/${currentLocale}.json`)).default
    return {
      locale: currentLocale,
      messages,
    }
  } catch (error) {
    console.error('Error loading messages:', error)

    return {
      locale: routing.defaultLocale,
      messages: (await import(`@/resources/locales/${routing.defaultLocale}.json`)).default,
    }
  }
})
