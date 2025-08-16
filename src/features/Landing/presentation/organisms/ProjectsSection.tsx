'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTranslations } from '@/shared/hooks'
import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: 'Emergency Relief',
    description: 'Providing immediate assistance to communities affected by natural disasters.',
    goal: 50000,
    raised: 35000,
    daysLeft: 15,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Education Support',
    description: 'Building schools and providing educational resources for underprivileged children.',
    goal: 75000,
    raised: 52000,
    daysLeft: 30,
    image: 'https://images.unsplash.com/photo-1523240794102-9ebdcc4a44d1?auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Healthcare Access',
    description: 'Improving healthcare infrastructure and providing medical supplies.',
    goal: 100000,
    raised: 78000,
    daysLeft: 45,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80',
  },
]

export default function ProjectsSection() {
  const t = useTranslations()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Featured Projects')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('Support meaningful causes and track the impact of your donations in real-time')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const progress = (project.raised / project.goal) * 100
            return (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted relative">
                  <Image
                    width={100}
                    height={100}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{t(project.title)}</CardTitle>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('Project Goal')}</span>
                      <span className="font-semibold">${project.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{t('Raised')}</span>
                      <span className="font-semibold">${project.raised.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t('Days Left')}: {project.daysLeft}
                    </span>
                    <Button size="sm">{t('Donate Now')}</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t('View All Projects')}
          </Button>
        </div>
      </div>
    </section>
  )
}
