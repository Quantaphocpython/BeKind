'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import FuzzyText from '@/components/ui/fuzzy-text'
import { useTranslations } from '@/shared/hooks'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function NotFoundPage() {
  const t = useTranslations()
  const { theme } = useTheme()

  const textColor = theme === 'dark' ? '#ffffff' : '#000000'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <FuzzyText
          fontSize="clamp(4rem, 15vw, 8rem)"
          fontWeight={900}
          color={textColor}
          baseIntensity={0.08}
          hoverIntensity={0.15}
          enableHover={true}
        >
          404
        </FuzzyText>

        <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
          <FuzzyText
            baseIntensity={0.08}
            hoverIntensity={0.15}
            enableHover={true}
            color={textColor}
            fontSize="clamp(1rem, 8vw, 1.5rem)"
            fontWeight={900}
          >
            {t('Page Not Found')}
          </FuzzyText>
        </h2>

        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Icons.moveLeft className="h-4 w-4" />
              <span>{t('Back to Home')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
