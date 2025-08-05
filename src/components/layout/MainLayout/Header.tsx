'use client'

import { ConnectWallet, LanguageSwitcher, ToggleThemeButton } from '@/components/common'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useToggle } from '@/shared/hooks/useToggle'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const t = useTranslations()
  const [toggle, setToggle] = useToggle(false)

  return (
    <header
      id="app-header"
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Icons.handCoins className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">{t('Charity Platform')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {t(item.name)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSwitcher />
          <ToggleThemeButton />
          <ConnectWallet />
        </div>

        {/* Mobile Menu */}
        <Sheet open={toggle} onOpenChange={setToggle}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
              <Icons.menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-8">
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
                <LanguageSwitcher />
                <ToggleThemeButton />
                <ConnectWallet />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

