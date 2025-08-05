'use client'

import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  value: string
  label: string
  description: string
}

export default function StatCard({ value, label, description }: StatCardProps) {
  return (
    <Card className="text-center border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-3xl font-bold mb-2 text-primary">{value}</h3>
        <p className="text-lg font-semibold mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
