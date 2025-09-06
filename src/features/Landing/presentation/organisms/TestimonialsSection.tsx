'use client'

import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '@/features/User/presentation/atoms/UserAvatar'
import { useTranslations } from '@/shared/hooks'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Project Organizer',
    content:
      'BeKind has transformed how we manage charitable projects. The transparency and traceability features give our donors complete confidence in their contributions.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Donor',
    content:
      'I love being able to track exactly where my donations go. The blockchain technology ensures every penny is accounted for and reaches those who need it most.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Donor',
    content:
      'The real-time updates and impact reports make donating feel more personal and meaningful. I can see the direct impact of my contributions.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const t = useTranslations()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Testimonials')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('What donors say')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="rounded-2xl border border-muted/30 shadow-sm hover:shadow-lg transition-shadow bg-background"
            >
              <CardContent className="p-8 flex flex-col justify-between h-full">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icons.star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-8 italic relative">
                  <span className="absolute -left-4 -top-2 text-4xl text-muted-foreground/30">&ldquo;</span>
                  {testimonial.content}
                </p>

                {/* User Info */}
                <div className="flex items-center mt-auto">
                  <UserAvatar name={testimonial.name} size="lg" className="mr-4 ring-2 ring-primary/20" />
                  <div>
                    <p className="font-semibold text-base">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{t(testimonial.role)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
