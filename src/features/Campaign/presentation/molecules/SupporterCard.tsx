'use client'

import { Icons } from '@/components/icons'
import { UserDisplay } from '@/features/User'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { SupporterAmount } from '../atoms/SupporterAmount'
import { SupporterDate } from '../atoms/SupporterDate'

interface SupporterCardProps {
  supporter: VoteDto
  className?: string
}

export const SupporterCard = ({ supporter, className }: SupporterCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-gradient-to-br from-card via-card to-muted/20 hover:from-card/80 hover:to-muted/30 transition-all duration-300 hover:shadow-md ${className || ''}`}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-4">
        <div className="flex items-center gap-3">
          {/* Compact Avatar */}
          <div className="relative">
            <UserDisplay
              address={supporter.user?.address}
              name={supporter.user?.name || undefined}
              size="md"
              showAddress={false}
              className="ring-2 ring-offset-1 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-green-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-0.5">
                <SupporterDate date={supporter.createdAt} />
              </div>
              {supporter.amount && (
                <div className="text-right">
                  <SupporterAmount amount={supporter.amount} />
                </div>
              )}
            </div>

            {/* Transaction details compact */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {supporter.transactionHash && (
                <div className="flex items-center gap-1">
                  <Icons.hash className="h-3 w-3" />
                  <span className="font-mono">
                    {supporter.transactionHash.slice(0, 6)}...{supporter.transactionHash.slice(-4)}
                  </span>
                </div>
              )}
              {supporter.blockNumber && (
                <div className="flex items-center gap-1">
                  <Icons.layers className="h-3 w-3" />
                  <span className="font-mono">#{supporter.blockNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
