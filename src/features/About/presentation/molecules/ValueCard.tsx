'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ValueCardProps {
  icon: keyof typeof Icons
  title: string
  description: string
}

export default function ValueCard({ icon, title, description }: ValueCardProps) {
  const IconComponent = Icons[icon] as React.ComponentType<{ className?: string }>

  return (
    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <IconComponent className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
