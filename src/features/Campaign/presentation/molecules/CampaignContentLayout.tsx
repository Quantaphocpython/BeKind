'use client'

import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

interface CampaignContentLayoutProps {
  icon: React.ReactNode
  title: string
  description: string
  metric?: {
    label: string
    value: string
    color?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const CampaignContentLayout: React.FC<CampaignContentLayoutProps> = ({
  icon,
  title,
  description,
  metric,
  actions,
  children,
  className = '',
}) => {
  return (
    <Card
      className={`border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 min-h-[500px] overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-border/20 bg-gradient-to-r from-background/50 to-muted/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <div className="text-primary text-xl">{icon}</div>
              </div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
          {(metric || actions) && (
            <div className="flex items-center space-x-4 flex-shrink-0">
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
              {actions}
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
