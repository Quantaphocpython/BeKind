'use client'

import { Icons } from '@/components/icons'
import { useTranslations } from '@/shared/hooks'

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
    <div className="text-center p-6 bg-background rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-primary font-medium mb-2">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
