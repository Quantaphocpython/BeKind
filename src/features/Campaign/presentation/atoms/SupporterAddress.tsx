'use client'

import { getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { toast } from 'sonner'

interface SupporterAddressProps {
  address: string
  className?: string
}

export const SupporterAddress = ({ address, className }: SupporterAddressProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <p className="text-sm font-medium truncate">{getShortAddress(address)}</p>
      <button
        onClick={handleCopy}
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
        title="Copy address"
      >
        📋
      </button>
    </div>
  )
}
