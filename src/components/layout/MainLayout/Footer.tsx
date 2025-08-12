'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks'
import Image from 'next/image'
import Link from 'next/link'

const quickLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
]

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
]

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Icons.twitter },
  { name: 'LinkedIn', href: '#', icon: Icons.linkedIn },
  { name: 'GitHub', href: '#', icon: Icons.gitHub },
]

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="logo" width={32} height={32} />
              <span className="text-xl font-bold">{t('BeKind')}</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t(
                'BeKind is revolutionizing charitable giving through blockchain technology, ensuring transparency, security, and maximum impact for every donation.',
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('Quick Links')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t('Support')}</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">{t('Social Media')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('Follow us on social media')}</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon as React.ComponentType<{ className?: string }>
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 {t('BeKind')}. {t('All rights reserved')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
