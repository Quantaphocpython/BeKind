export const CONTACT_CONSTANTS = {
  FORM_FIELDS: {
    NAME: 'name',
    EMAIL: 'email',
    SUBJECT: 'subject',
    MESSAGE: 'message',
  },
  CONTACT_METHODS: [
    {
      id: 'email',
      icon: 'mail',
      title: 'Email',
      value: 'contact@bekind.org',
      description: 'Send us an email anytime',
    },
    {
      id: 'phone',
      icon: 'phone',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
    },
    {
      id: 'address',
      icon: 'mapPin',
      title: 'Office',
      value: '123 Blockchain St, Tech City, TC 12345',
      description: 'Visit our office',
    },
  ],
  SOCIAL_LINKS: [
    {
      id: 'twitter',
      icon: 'twitter',
      title: 'Twitter',
      url: 'https://twitter.com/bekind',
    },
    {
      id: 'facebook',
      icon: 'facebook',
      title: 'Facebook',
      url: 'https://facebook.com/bekind',
    },
    {
      id: 'linkedin',
      icon: 'linkedin',
      title: 'LinkedIn',
      url: 'https://linkedin.com/company/bekind',
    },
    {
      id: 'instagram',
      icon: 'instagram',
      title: 'Instagram',
      url: 'https://instagram.com/bekind',
    },
  ],
} as const
