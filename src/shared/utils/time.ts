export function formatRelativeTime(date: Date, locale: string = 'en'): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return locale === 'vi' ? 'vừa xong' : 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return locale === 'vi'
      ? `${diffInMinutes} phút trước`
      : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return locale === 'vi' ? `${diffInHours} giờ trước` : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return locale === 'vi' ? `${diffInDays} ngày trước` : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  // For older dates, show actual date
  return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}
