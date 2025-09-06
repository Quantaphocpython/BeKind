import { useTranslations } from '@/shared/hooks'
import { darkTheme, lightTheme, Locale, RainbowKitProvider as RainbowKitProviderRender } from '@rainbow-me/rainbowkit'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'

const RainbowKitProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  const locale = useLocale()
  const t = useTranslations()

  return (
    <RainbowKitProviderRender
      id="rainbowkit"
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
      locale={locale as Locale}
      coolMode
      showRecentTransactions
      appInfo={{
        appName: 'BeKind',
        disclaimer: ({ Text, Link }) => (
          <Text>
            {t('By connecting your wallet, you agree to the')} <Link href="/terms">{t('Terms of Service')}</Link>{' '}
            {t('and')} <Link href="/privacy">{t('Privacy Policy')}</Link>.
          </Text>
        ),
      }}
    >
      {children}
    </RainbowKitProviderRender>
  )
}

export default RainbowKitProvider
