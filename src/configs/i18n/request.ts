import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { routing } from './routing'

const adjustKeys = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      typeof value === 'string'
        ? [key.replaceAll('.', '_'), value]
        : [key, typeof value === 'object' && value !== null ? adjustKeys(value) : value],
    ),
  )

export default getRequestConfig(async () => {
  const header = await headers()
  const localeFromHeader = header.get('x-next-intl-locale')
  const currentLocale = localeFromHeader || routing.defaultLocale

  try {
    const messages = (await import(`@/resources/locales/${currentLocale}.json`)).default

    // periods are parsed as path separators by next-intl, so we need to replace
    // them with underscores both here and in the t function returned by useTranslations
    return {
      locale: currentLocale,
      messages: adjustKeys(messages),
    }
  } catch (error) {
    console.error('Error loading messages:', error)

    const defaultMessages = (await import(`@/resources/locales/${routing.defaultLocale}.json`)).default
    return {
      locale: routing.defaultLocale,
      messages: adjustKeys(defaultMessages),
    }
  }
})
