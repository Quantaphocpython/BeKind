'use client'

import { useTranslations } from 'next-intl'
import { ABOUT_CONSTANTS } from '../../data/constants/about.constants'
import TeamMemberCard from '../molecules/TeamMemberCard'

export default function AboutTeam() {
  const t = useTranslations()

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Meet Our Team')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('Meet Our Team Description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ABOUT_CONSTANTS.TEAM.map((member) => (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              role={member.role}
              avatar={member.avatar}
              bio={member.bio}
              social={member.social}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
