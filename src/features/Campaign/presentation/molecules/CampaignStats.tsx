'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target, ThumbsUp, TrendingUp, Wallet } from 'lucide-react'

interface CampaignStatsProps {
  goalEth: number
  raisedEth: number
  votes: number
  size?: 'default' | 'compact'
}

export const CampaignStats = ({ goalEth, raisedEth, votes, size = 'default' }: CampaignStatsProps) => {
  const titleClass = size === 'compact' ? 'text-sm' : 'text-base'
  const valueClass = size === 'compact' ? 'text-xl md:text-2xl' : 'text-3xl'

  const progress = Math.min((raisedEth / goalEth) * 100, 100)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle
            className={`${titleClass} font-semibold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors`}
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Target className="h-4 w-4 text-primary" />
            </div>
            Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${valueClass} font-bold text-foreground`}>{goalEth.toFixed(3)} ETH</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle
            className={`${titleClass} font-semibold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors`}
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Raised
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`${valueClass} font-bold text-emerald-600 dark:text-emerald-400`}>{raisedEth.toFixed(3)} ETH</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% of goal</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle
            className={`${titleClass} font-semibold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors`}
          >
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <ThumbsUp className="h-4 w-4 text-accent" />
            </div>
            Votes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${valueClass} font-bold text-foreground`}>{votes}</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-accent/5 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle
            className={`${titleClass} font-semibold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors`}
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`${valueClass} font-bold text-primary`}>{progress.toFixed(1)}%</p>
          <div className="space-y-1">
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {progress >= 100 ? 'Goal achieved!' : `${(goalEth - raisedEth).toFixed(3)} ETH remaining`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignStats
