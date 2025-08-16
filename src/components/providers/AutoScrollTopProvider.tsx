'use client'

import { useIsomorphicEffect } from '@/shared/hooks'
import { ScrollType, useAppScroll } from '@/shared/hooks/useAppScroll'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

export const AutoScrollTopProvider = () => {
  const pathname = usePathname()
  const { scroll } = useAppScroll()
  const prevPathnameRef = useRef<string | null>(null)

  useIsomorphicEffect(() => {
    const prevPathname = prevPathnameRef.current

    // Only scroll if the base route changed (not just parameters)
    if (prevPathname && pathname && prevPathname !== pathname) {
      const prevBaseRoute = prevPathname.split('?')[0].split('#')[0]
      const currentBaseRoute = pathname.split('?')[0].split('#')[0]

      if (prevBaseRoute !== currentBaseRoute) {
        scroll({
          type: ScrollType.ToTop,
        })
      }
    }

    prevPathnameRef.current = pathname
  }, [pathname])

  return null
}
