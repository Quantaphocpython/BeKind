export const ABOUT_CONSTANTS = {
  MISSION: {
    title: 'Our Mission',
    description:
      'To revolutionize charitable giving through blockchain technology, ensuring transparency, security, and maximum impact for every donation.',
  },
  VISION: {
    title: 'Our Vision',
    description:
      'A world where every act of kindness is transparent, traceable, and impactful, building trust between donors and those in need.',
  },
  VALUES: [
    {
      id: 'transparency',
      icon: 'shield',
      title: 'Transparency',
      description:
        'Every transaction is recorded on the blockchain, ensuring complete transparency and accountability.',
    },
    {
      id: 'security',
      icon: 'lock',
      title: 'Security',
      description: 'Advanced blockchain technology protects your donations and personal information.',
    },
    {
      id: 'impact',
      icon: 'heart',
      title: 'Impact',
      description: 'We focus on measurable outcomes and real-world impact for every donation made.',
    },
    {
      id: 'community',
      icon: 'users',
      title: 'Community',
      description: 'Building a global community of donors and beneficiaries connected through technology.',
    },
  ],
  TEAM: [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      avatar: '/api/placeholder/200/200',
      bio: 'Former blockchain developer with 10+ years experience in charitable organizations.',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        twitter: 'https://twitter.com/sarahjohnson',
      },
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO',
      avatar: '/api/placeholder/200/200',
      bio: 'Blockchain architect with expertise in DeFi and smart contract development.',
      social: {
        linkedin: 'https://linkedin.com/in/michael-chen',
        github: 'https://github.com/michaelchen',
      },
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      avatar: '/api/placeholder/200/200',
      bio: 'Non-profit veteran with deep understanding of charitable operations and donor relations.',
      social: {
        linkedin: 'https://linkedin.com/in/emma-rodriguez',
        twitter: 'https://twitter.com/emmarodriguez',
      },
    },
  ],
  STATS: [
    {
      id: 'donations',
      value: '$2.5M+',
      label: 'Total Donations',
      description: 'Raised through our platform',
    },
    {
      id: 'projects',
      value: '150+',
      label: 'Active Projects',
      description: 'Ongoing charitable projects',
    },
    {
      id: 'people',
      value: '50K+',
      label: 'People Helped',
      description: 'Lives impacted worldwide',
    },
    {
      id: 'countries',
      value: '25+',
      label: 'Countries',
      description: 'Global reach and impact',
    },
  ],
} as const
