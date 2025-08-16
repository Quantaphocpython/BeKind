'use client'

import { LanguageSwitcher, ToggleThemeButton } from '@/components/common'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function SettingsDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <Icons.settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit min-w-fit p-3 flex gap-2">
        <LanguageSwitcher />
        <ToggleThemeButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
