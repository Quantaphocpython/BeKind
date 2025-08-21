'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import Image from 'next/image'

export interface CampaignBannerProps {
  title: string
  coverImage: string
  campaignId: string | number
  statusBadge?: { label: string; className?: string }
  variant?: 'default' | 'compact'
  className?: string
}

export const CampaignBanner = ({
  title,
  coverImage,
  campaignId,
  statusBadge,
  variant = 'default',
  className,
}: CampaignBannerProps) => {
  return (
    // <CHANGE> Enhanced banner with better gradient overlay and improved visual hierarchy
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl shadow-2xl',
        variant === 'compact' ? 'aspect-[16/6] md:aspect-[16/5]' : 'aspect-[16/9]',
        className,
      )}
    >
      <Image
        src={coverImage || '/placeholder.svg'}
        alt={title}
        fill
        className="object-cover transform-gpu transition-transform duration-700 ease-out hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
      />
      {/* <CHANGE> Enhanced gradient with multiple layers for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />

      {/* <CHANGE> Redesigned badge layout with glassmorphism effect */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        {statusBadge && (
          <Badge
            className={cn(
              'bg-primary/90 text-primary-foreground backdrop-blur-md border border-white/20 shadow-lg px-4 py-2 text-sm font-semibold',
              statusBadge.className,
            )}
          >
            {statusBadge.label}
          </Badge>
        )}
        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-mono border border-white/30 shadow-lg">
          #{campaignId}
        </div>
      </div>

      {/* <CHANGE> Added bottom overlay with campaign title for better visual hierarchy */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
        <h1
          className={cn(
            'text-white font-bold leading-tight drop-shadow-lg',
            variant === 'compact' ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl',
          )}
        >
          {title}
        </h1>
      </div>
    </div>
  )
}

export default CampaignBanner
