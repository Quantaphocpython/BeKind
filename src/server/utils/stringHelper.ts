// Backend utility functions for string manipulation

const ADJECTIVES = [
  'Brave',
  'Wise',
  'Swift',
  'Bright',
  'Calm',
  'Clever',
  'Daring',
  'Eager',
  'Friendly',
  'Gentle',
  'Happy',
  'Kind',
  'Lively',
  'Merry',
  'Noble',
  'Peaceful',
  'Quick',
  'Radiant',
  'Smart',
  'Tender',
  'Unique',
  'Vibrant',
  'Warm',
  'Zealous',
]

const NOUNS = [
  'Hero',
  'Explorer',
  'Pioneer',
  'Guardian',
  'Warrior',
  'Sage',
  'Mage',
  'Knight',
  'Wanderer',
  'Seeker',
  'Dreamer',
  'Creator',
  'Builder',
  'Artist',
  'Scholar',
  'Mentor',
  'Leader',
  'Helper',
  'Friend',
  'Companion',
  'Guide',
  'Teacher',
  'Healer',
  'Protector',
]

/**
 * Generates a random username with a number suffix
 * Format: [Adjective][Noun][RandomNumber]
 * Example: BraveHero123, WiseExplorer456
 */
export function generateRandomUserNameWithNumber(): string {
  const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const randomNumber = Math.floor(Math.random() * 1000) + 1

  return `${randomAdjective}${randomNoun}${randomNumber}`
}

/**
 * Truncates an Ethereum address to show only first and last few characters
 * Example: 0x1234...5678
 */
export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address || address.length < startLength + endLength) {
    return address
  }

  const start = address.slice(0, startLength)
  const end = address.slice(-endLength)

  return `${start}...${end}`
}
