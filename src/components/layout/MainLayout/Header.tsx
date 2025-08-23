'use client'

import { SettingsDropdown } from '@/components/common'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserProfileDropdown } from '@/features/User'
import { RouteEnum } from '@/shared/constants'
import { useToggle, useTranslations } from '@/shared/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const navigation = [
  { name: 'Home', href: RouteEnum.Home },
  { name: 'About', href: RouteEnum.About },
  { name: 'Campaigns', href: RouteEnum.Campaigns },
  { name: 'Contact', href: RouteEnum.Contact },
]

export default function Header() {
  const t = useTranslations()
  const [toggle, setToggle] = useToggle(false)
  const pathname = usePathname()

  const locales = ['en', 'vi'] as const
  const normalizePath = useCallback(
    (path: string) => {
      const localePrefix = new RegExp(`^/(${locales.join('|')})(?=/|$)`)
      const normalized = path.replace(localePrefix, '') || '/'
      return normalized
    },
    [locales],
  )

  const activeHref = useMemo(() => {
    const current = normalizePath(pathname || '')
    const match = navigation.find((item) =>
      item.href === '/' ? current === '/' : current === item.href || current.startsWith(`${item.href}/`),
    )
    return match?.href
  }, [pathname, normalizePath])

  return (
    <header
      id="app-header"
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[var(--header-height)]"
    >
      <div className="container relative mx-auto px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center h-[var(--header-height)]">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 justify-self-start">
          <Image src="/images/logo.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold">{t('BeKind')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navigation.map((item) => {
            const isActive = !!activeHref && item.href === activeHref
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors relative pb-1 border-b-2 ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-foreground/80 border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                {t(item.name)}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3 justify-self-end">
          <SettingsDropdown />
          <UserProfileDropdown />
        </div>

        {/* Mobile Menu */}
        <Sheet open={toggle} onOpenChange={setToggle}>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="lg:hidden h-8 w-8 ml-auto">
              <Icons.menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-8 p-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setToggle()}
                >
                  {t(item.name)}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-6 border-t">
                <SettingsDropdown />
                <UserProfileDropdown />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
