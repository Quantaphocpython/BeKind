import MainLayout from '@/components/layout/MainLayout'
import Providers from '@/components/providers'
import I18nProvider from '@/components/providers/I18nProvider'
import { routing } from '@/configs/i18n/routing'
import '@rainbow-me/rainbowkit/styles.css'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Inter, Montserrat } from 'next/font/google'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode } from 'react'
import 'reflect-metadata'
import '../globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  const header = await headers()
  const localeHeader = header.get('x-next-intl-locale')

  if (localeHeader === null) {
    notFound()
  }

  return (
    <html lang={localeHeader} suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <I18nProvider locale={localeHeader}>
          <Providers>
            <NextTopLoader showSpinner={false} color="var(--primary)" />

            <NuqsAdapter>
              <MainLayout>{children}</MainLayout>
            </NuqsAdapter>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: Omit<LocaleLayoutProps, 'children'>) {
  const { locale } = await props.params

  const t = await getTranslations({ locale })

  return {
    title: t('BeKind'),
    icons: {
      icon: '/images/logo.png',
    },
  }
}
