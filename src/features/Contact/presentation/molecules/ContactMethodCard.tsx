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
    <div className="group relative text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex justify-center mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-500 shadow-lg group-hover:shadow-xl">
            {IconComponent && (
              <IconComponent className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        </div>

        <h3 className="font-bold text-xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
          {t(title)}
        </h3>

        <p className="text-primary font-semibold mb-4 text-lg group-hover:scale-105 transition-transform duration-300">
          {value}
        </p>

        <p className="text-muted-foreground leading-relaxed text-base">{t(description)}</p>
      </div>
    </div>
  )
}
