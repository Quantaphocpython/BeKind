export const formatDateTime = (dateTime: string | null | undefined): string => {
  if (!dateTime) return 'N/A'
  try {
    const date = new Date(dateTime)
    // Kiểm tra xem đối tượng Date có hợp lệ không
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    // Get current locale for date formatting
    const locale = typeof window !== 'undefined' ? window.navigator.language.split('-')[0] : 'en'

    // Định dạng theo locale hiện tại
    return date.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Hiển thị định dạng 12 giờ với AM/PM
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'Invalid Date'
  }
}
