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
      name: 'Kaitou',
      role: 'CEO & Founder',
      avatar: '/api/placeholder/200/200',
      bio: 'Passionate blockchain enthusiast dedicated to revolutionizing charitable giving through decentralized technology.',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        twitter: 'https://twitter.com/sarahjohnson',
      },
    },
  ],
  STATS: [
    {
      id: 'transparency',
      value: '100%',
      label: 'Transparency',
      description: 'All transactions are publicly verifiable',
    },
    {
      id: 'security',
      value: '256-bit',
      label: 'Encryption',
      description: 'Military-grade security protection',
    },
    {
      id: 'fees',
      value: '0%',
      label: 'Platform Fees',
      description: 'No hidden charges or fees',
    },
    {
      id: 'support',
      value: '24/7',
      label: 'Support',
      description: 'Round-the-clock assistance',
    },
  ],
} as const
