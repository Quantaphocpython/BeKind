import Providers from '@/components/providers'
import { routing } from '@/configs/i18n/routing'
import { Locale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode } from 'react'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: Omit<LocaleLayoutProps, 'children'>) {
  const { locale } = await props.params

  const t = await getTranslations({ locale, namespace: 'LocaleLayout' })

  return {
    title: t('title'),
  }
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  const header = await headers()
  const localeHeader = header.get('x-next-intl-locale')
  if (localeHeader === null) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={localeHeader} suppressHydrationWarning>
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NextTopLoader showSpinner={false} />
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
