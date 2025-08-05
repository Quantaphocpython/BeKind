'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Donor',
    avatar: '/api/placeholder/100/100',
    content:
      'BeKind has completely changed how I think about charitable giving. The transparency and real-time tracking give me confidence that my donations are making a real impact.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Project Organizer',
    avatar: '/api/placeholder/100/100',
    content:
      'As a project organizer, I love how BeKind connects us directly with donors. The blockchain technology ensures every transaction is transparent and secure.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Donor',
    avatar: '/api/placeholder/100/100',
    content:
      "I've been donating through BeKind for over a year now. The platform is user-friendly and I can see exactly where my money goes. Highly recommended!",
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
            <Card key={testimonial.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icons.star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
