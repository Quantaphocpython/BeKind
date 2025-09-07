'use client'

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
      className={`group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 hover:from-card/90 hover:to-muted/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20 ${className || ''}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        {/* User Display - Top Section với không gian riêng */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <UserDisplay
              address={supporter.user?.address}
              name={supporter.user?.name || undefined}
              size="lg"
              showAddress={false}
              className="hover:scale-105 transition-transform duration-200"
              avatarClassName="shadow-lg hover:shadow-xl transition-shadow duration-200"
            />
            {/* Enhanced online indicator */}
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-background bg-green-500 shadow-sm">
              <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-75" />
            </div>
          </div>
        </div>

        {/* Transaction Details - Bottom Section */}
        <div className="space-y-3">
          {/* Date and Amount Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SupporterDate date={supporter.createdAt} />
            </div>
            {supporter.amount && (
              <div className="text-right">
                <SupporterAmount amount={supporter.amount} />
              </div>
            )}
          </div>

          {/* Transaction Hash and Block Number */}
          {/* <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {supporter.transactionHash && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
                <Icons.hash className="h-3 w-3" />
                <span className="font-mono text-xs">
                  {supporter.transactionHash.slice(0, 6)}...{supporter.transactionHash.slice(-4)}
                </span>
              </div>
            )}
            {supporter.blockNumber && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
                <Icons.layers className="h-3 w-3" />
                <span className="font-mono text-xs">#{supporter.blockNumber}</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  )
}
