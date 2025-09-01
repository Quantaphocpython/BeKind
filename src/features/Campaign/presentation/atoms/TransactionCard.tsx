'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'
import type { TransactionDto } from '@/server/dto/campaign.dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { formatEther } from 'viem'

interface TransactionCardProps {
  transaction: TransactionDto
  className?: string
}

export const TransactionCard = ({ transaction, className }: TransactionCardProps) => {
  const t = useTranslations()
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
      className={`group relative overflow-hidden rounded-lg border bg-gradient-to-br from-card via-card to-muted/20 hover:from-card/80 hover:to-muted/30 transition-all duration-300 hover:shadow-md cursor-pointer ${className || ''}`}
      onClick={() => {
        // TODO: Open modal with transaction details
        ;('Open transaction modal:', transaction.id)
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-4">
        <div className="flex items-center gap-3">
          {/* Compact Avatar */}
          <div className="relative">
            <Avatar className="size-10 ring-2 ring-offset-1 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300">
              <AvatarImage src={generateUserAvatarSync(transaction.from)} alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold text-sm">
                {getShortAddress(transaction.from).slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background ${statusConfig.className.includes('success') ? 'bg-green-500' : statusConfig.className.includes('failed') ? 'bg-red-500' : 'bg-yellow-500'}`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{getShortAddress(transaction.from)}</span>
                <Icons.arrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{getShortAddress(transaction.to)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className={`text-xs ${typeConfig.className}`}>
                  {typeConfig.icon}
                  {typeConfig.label}
                </Badge>
                <Badge variant="outline" className={`text-xs ${statusConfig.className}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Amount and Timestamp */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {valueInEth.toFixed(4)} ETH
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icons.clock className="h-3 w-3" />
                <span>
                  {new Date(transaction.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
