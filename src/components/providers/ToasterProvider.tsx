import { useTheme } from 'next-themes'
import { Toaster, ToasterProps } from 'sonner'

export default function ToasterProvider() {
  const { theme } = useTheme()

  return <Toaster position="top-right" richColors closeButton duration={4000} theme={theme as ToasterProps['theme']} />
}
