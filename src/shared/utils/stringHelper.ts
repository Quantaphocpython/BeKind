// Generate random user names
const adjectives = [
  'Brave',
  'Wise',
  'Kind',
  'Bright',
  'Swift',
  'Noble',
  'Gentle',
  'Clever',
  'Happy',
  'Calm',
  'Bold',
  'Smart',
  'Quick',
  'Fair',
  'Warm',
  'Cool',
  'Strong',
  'Light',
  'Dark',
  'Pure',
  'Wild',
  'Free',
  'Safe',
  'True',
]

const nouns = [
  'Hero',
  'Star',
  'Moon',
  'Sun',
  'Wind',
  'River',
  'Mountain',
  'Ocean',
  'Forest',
  'Eagle',
  'Lion',
  'Wolf',
  'Bear',
  'Dragon',
  'Phoenix',
  'Tiger',
  'Warrior',
  'Sage',
  'Knight',
  'Wizard',
  'Archer',
  'Mage',
  'Guardian',
  'Explorer',
]

/**
 * Generate a random user name using adjective + noun pattern
 * @returns A random user name like "BraveHero", "WiseSage", etc.
 */
export const generateRandomUserName = (): string => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${randomAdjective}${randomNoun}`
}

/**
 * Truncate wallet address for display
 * @param address The wallet address to truncate
 * @param startLength Number of characters to show at the start (default: 6)
 * @param endLength Number of characters to show at the end (default: 4)
 * @returns Truncated address like "0x1234...5678"
 */
export const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}
