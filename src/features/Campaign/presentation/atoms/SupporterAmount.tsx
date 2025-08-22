'use client'

interface SupporterAmountProps {
  amount: string
  className?: string
}

export const SupporterAmount = ({ amount, className }: SupporterAmountProps) => {
  return (
    <span className={`text-sm font-semibold text-green-600 dark:text-green-400 ${className || ''}`}>
      {parseFloat(amount).toFixed(4)} ETH
    </span>
  )
}
