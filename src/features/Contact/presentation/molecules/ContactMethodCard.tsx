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
    <div className="group text-center p-8 bg-card rounded-xl border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-3 text-foreground">{t(title)}</h3>
      <p className="text-primary font-medium mb-3 text-base">{value}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{t(description)}</p>
    </div>
  )
}
