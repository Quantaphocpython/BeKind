import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/configs/i18n/request.ts')

const nextConfig: NextConfig = withNextIntl({})

export default nextConfig
