'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/shared/hooks'
import { cn } from '@/shared/utils'
import { useTheme } from 'next-themes'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme === 'dark')
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const changeTheme = async () => {
    if (!buttonRef.current) return

    const newTheme = theme === 'dark' ? 'light' : 'dark'

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
        setIsDarkMode(newTheme === 'dark')
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const y = top + height / 2
    const x = left + width / 2

    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom))

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }

  return (
    <Button ref={buttonRef} onClick={changeTheme} variant="outline" size="sm">
      <Icons.sun
        className={cn('h-4 w-4 transition-all duration-300', isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0')}
      />
      <Icons.moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100',
        )}
      />
      <span className="sr-only">{t('Theme')}</span>
    </Button>
  )
}

export default ToggleThemeButton
