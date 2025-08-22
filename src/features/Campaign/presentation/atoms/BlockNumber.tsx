'use client'

interface BlockNumberProps {
  blockNumber: string | number
  className?: string
}

export const BlockNumber = ({ blockNumber, className }: BlockNumberProps) => {
  return <p className={`text-xs text-muted-foreground ${className || ''}`}>Block #{blockNumber}</p>
}
