'use client'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface TeamMemberCardProps {
  name: string
  role: string
  avatar: string
  bio: string
  social: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

export default function TeamMemberCard({ name, role, avatar, bio, social }: TeamMemberCardProps) {
  return (
    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <p className="text-primary font-medium">{role}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{bio}</p>
        <div className="flex justify-center space-x-3">
          {social.twitter && (
            <Link
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Icons.twitter className="h-4 w-4" />
            </Link>
          )}
          {social.github && (
            <Link
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Icons.gitHub className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
