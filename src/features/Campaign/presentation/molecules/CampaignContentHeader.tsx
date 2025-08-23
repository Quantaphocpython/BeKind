'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslations } from '@/shared/hooks/useTranslations'
import React from 'react'

interface CampaignContentHeaderProps {
  icon: React.ReactNode
  title: string
  description: string
  metric?: {
    label: string
    value: string
    color?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export const CampaignContentHeader: React.FC<CampaignContentHeaderProps> = ({
  icon,
  title,
  description,
  metric,
  action,
  className = '',
}) => {
  const t = useTranslations()

  return (
    <Card className={`p-6 bg-card/50 border-border/50 ${className}`}>
      <div className="flex items-start justify-between">
        {/* Left Section - Icon, Title, Description */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="text-primary text-xl">{icon}</div>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent" />

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Right Section - Metric and Action */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Metric */}
          {metric && (
            <div className="bg-secondary/20 border border-secondary/30 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
              <p
                className={`text-lg font-bold ${metric.color === 'destructive' ? 'text-destructive' : 'text-primary'}`}
              >
                {metric.value}
              </p>
            </div>
          )}

          {/* Action Button */}
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
