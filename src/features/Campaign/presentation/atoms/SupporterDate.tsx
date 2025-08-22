'use client'

interface SupporterDateProps {
  date: string
  className?: string
}

export const SupporterDate = ({ date, className }: SupporterDateProps) => {
  return (
    <p className={`text-xs text-muted-foreground ${className || ''}`}>
      {new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </p>
  )
}
