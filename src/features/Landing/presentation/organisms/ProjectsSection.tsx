'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTranslations } from 'next-intl'

const projects = [
  {
    id: 1,
    title: 'Emergency Relief',
    description: 'Providing immediate assistance to communities affected by natural disasters',
    image: '/api/placeholder/400/250',
    goal: 50000,
    raised: 35000,
    daysLeft: 15,
    category: 'Emergency Relief',
  },
  {
    id: 2,
    title: 'Education Support',
    description: 'Building schools and providing educational resources for underprivileged children',
    image: '/api/placeholder/400/250',
    goal: 75000,
    raised: 52000,
    daysLeft: 30,
    category: 'Education Support',
  },
  {
    id: 3,
    title: 'Healthcare Access',
    description: 'Improving healthcare infrastructure and access to medical services',
    image: '/api/placeholder/400/250',
    goal: 100000,
    raised: 68000,
    daysLeft: 45,
    category: 'Healthcare Access',
  },
]

export default function ProjectsSection() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Featured Projects')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('Support meaningful causes')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const progress = (project.raised / project.goal) * 100
            return (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {t(project.category)}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
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
                      <span className="font-semibold text-primary">${project.raised.toLocaleString()}</span>
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
