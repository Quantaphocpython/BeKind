'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const footerLinks = {
  quickLinks: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
  social: [
    { name: 'Twitter', href: '#', icon: Icons.twitter },
    { name: 'GitHub', href: '#', icon: Icons.gitHub },
  ],
}

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Icons.handCoins className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">{t('Charity Platform')}</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              BeKind is revolutionizing charitable giving through blockchain technology, ensuring transparency,
              security, and maximum impact for every donation.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('Quick Links')}</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
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
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">{t('Newsletter')}</h3>
            <p className="text-muted-foreground mb-4">{t('Stay updated')}</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder={t('Email')} className="flex-1" />
              <Button size="sm">{t('Subscribe')}</Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 {t('Charity Platform')}. {t('All rights reserved')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
