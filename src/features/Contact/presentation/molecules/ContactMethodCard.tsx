'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface ContactMethodCardProps {
  icon: keyof typeof Icons
  title: string
  value: string
  description: string
}

export default function ContactMethodCard({ icon, title, value, description }: ContactMethodCardProps) {
  const t = useTranslations()
  const IconComponent = Icons[icon] as React.ComponentType<{ className?: string }>

  return (
    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-primary font-medium mb-2">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
