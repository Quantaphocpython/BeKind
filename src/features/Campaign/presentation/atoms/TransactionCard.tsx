'use client'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { getShortAddress } from '@/features/User/data/utils/avatar.utils'
import { UserAvatar } from '@/features/User/presentation/atoms/UserAvatar'
import type { TransactionDto } from '@/server/dto/campaign.dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { useLocale } from 'next-intl'
import { formatEther } from 'viem'

interface TransactionCardProps {
  transaction: TransactionDto
  className?: string
}

export const TransactionCard = ({ transaction, className }: TransactionCardProps) => {
  const t = useTranslations()
  const locale = useLocale()

  const handleCardClick = () => {
    const sepoliaExplorerUrl = `https://sepolia.etherscan.io/tx/${transaction.hash}`
    window.open(sepoliaExplorerUrl, '_blank', 'noopener,noreferrer')
  }

  const getStatusConfig = () => {
    switch (transaction.status) {
      case 'success':
        return {
          label: t('Success'),
          className:
            'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
          icon: <Icons.checkCircle className="h-3 w-3" />,
        }
      case 'pending':
        return {
          label: t('Pending'),
          className:
            'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
          icon: <Icons.clock className="h-3 w-3" />,
        }
      case 'failed':
        return {
          label: t('Failed'),
          className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
          icon: <Icons.xCircle className="h-3 w-3" />,
        }
    }
  }

  const getTypeConfig = () => {
    switch (transaction.type) {
      case 'donation':
        return {
          label: t('Donation'),
          className:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
          icon: <Icons.heart className="h-3 w-3" />,
        }
      case 'withdrawal':
        return {
          label: t('Withdrawal'),
          className:
            'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
          icon: <Icons.arrowUpRight className="h-3 w-3" />,
        }
      case 'creation':
        return {
          label: t('Creation'),
          className:
            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
          icon: <Icons.plus className="h-3 w-3" />,
        }
    }
  }

  const statusConfig = getStatusConfig()
  const typeConfig = getTypeConfig()
  const valueInEth = Number.parseFloat(formatEther(BigInt(transaction.value)))

  return (
    <div
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 hover:from-card/90 hover:to-muted/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer ${className || ''}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          {/* Avatar with status indicator */}
          <div className="relative">
            <UserAvatar
              address={transaction.from}
              name={undefined}
              size="md"
              className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            />
            {/* Enhanced status indicator */}
            <div
              className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-background shadow-sm ${
                statusConfig.className.includes('success')
                  ? 'bg-green-500'
                  : statusConfig.className.includes('failed')
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              }`}
            >
              <div
                className={`absolute inset-0 rounded-full animate-pulse opacity-75 ${
                  statusConfig.className.includes('success')
                    ? 'bg-green-400'
                    : statusConfig.className.includes('failed')
                      ? 'bg-red-400'
                      : 'bg-yellow-400'
                }`}
              />
            </div>
          </div>

          {/* Transaction Details - All in one line */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{getShortAddress(transaction.from)}</span>
                <Icons.arrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{getShortAddress(transaction.to)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className={`text-xs px-2 py-1 ${typeConfig.className}`}>
                  {typeConfig.icon}
                  {typeConfig.label}
                </Badge>
                <Badge variant="outline" className={`text-xs px-2 py-1 ${statusConfig.className}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Amount and Timestamp */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-50 dark:bg-green-950/30">
                <Icons.coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {valueInEth.toFixed(4)} ETH
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                <Icons.clock className="h-3 w-3" />
                <span>
                  {new Date(transaction.timestamp).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              {/* Highlighted Transaction Hash with Copy */}
              <div className="flex items-center gap-1.5 px-3 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors duration-200 group/copy">
                <Icons.hash className="h-3 w-3 text-primary" />
                <span className="font-mono text-xs font-semibold text-primary">
                  {transaction.hash.slice(0, 8)}...{transaction.hash.slice(-6)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(transaction.hash)
                    // You could add a toast notification here
                  }}
                  className="opacity-0 group-hover/copy:opacity-100 transition-opacity duration-200 p-1 hover:bg-primary/20 rounded"
                  title="Copy transaction hash"
                >
                  <Icons.copy className="h-3 w-3 text-primary" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
                <Icons.layers className="h-3 w-3" />
                <span className="font-mono text-xs">#{transaction.blockNumber}</span>
              </div>
              {/* <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <Icons.externalLink className="h-3 w-3" />
                <span className="text-xs font-medium">View on Explorer</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
