import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const generateUserAvatar = async (address: string): Promise<string> => {
  const avatar = createAvatar(avataaars, {
    seed: address,
    size: 128,
    backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
  })

  return await avatar.toDataUri()
}

export const generateUserAvatarUrl = async (address: string, size: number = 128): Promise<string> => {
  const avatar = createAvatar(avataaars, {
    seed: address,
    size,
    backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
  })

  return await avatar.toDataUri()
}

// Synchronous version for immediate use
export const generateUserAvatarSync = (address: string): string => {
  // Use a simple hash-based approach for immediate avatar generation
  const hash = address.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  // Use Dicebear's API URL for immediate generation
  const seed = Math.abs(hash).toString()
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,ffdfbf,ffd5dc,d1d4f9&size=128`
}

export const getShortAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
