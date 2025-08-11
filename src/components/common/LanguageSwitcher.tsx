'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTranslations } from '@/shared/hooks'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

const languages = [
  { code: 'en', name: 'English', flag: Icons.usFlag },
  { code: 'vi', name: 'Tiếng Việt', flag: Icons.vietnamFlag },
]

export default function LanguageSwitcher() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLanguage = languages.find((lang) => lang.code === locale)

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  const CurrentFlag = currentLanguage?.flag as React.ComponentType<{ className?: string }>

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 px-3">
          {CurrentFlag && <CurrentFlag className="h-4 w-6" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => {
          const FlagComponent = language.flag as React.ComponentType<{ className?: string }>
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="gap-3 cursor-pointer"
            >
              <FlagComponent className="h-4 w-6" />
              <span>{language.name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
