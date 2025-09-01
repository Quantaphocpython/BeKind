'use client'

import { useLocale } from 'next-intl'

interface SupporterDateProps {
  date: string
  className?: string
}

export const SupporterDate = ({ date, className }: SupporterDateProps) => {
  const locale = useLocale()

  return (
    <p className={`text-xs text-muted-foreground ${className || ''}`}>
      {new Date(date).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </p>
  )
}
