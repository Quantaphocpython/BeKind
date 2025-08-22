'use client'

import { Icons } from '@/components/icons'

interface TransactionHashProps {
  hash: string
  className?: string
}

export const TransactionHash = ({ hash, className }: TransactionHashProps) => {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <Icons.hash className="h-3 w-3 text-muted-foreground" />
      <a
        href={`https://sepolia.etherscan.io/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary hover:underline truncate"
      >
        {hash.slice(0, 8)}...{hash.slice(-6)}
      </a>
    </div>
  )
}
