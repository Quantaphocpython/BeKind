'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslations } from '@/shared/hooks'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations()

  useEffect(() => {
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/95">
      <Card className="max-w-md mx-auto p-8 text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-foreground mb-4">{t('Oops! Something went wrong')}</h1>

        {/* Error Message */}
        <p className="text-muted-foreground mb-8">{t('We encountered an unexpected error. Please try again.')}</p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-left">
            <p className="text-sm text-red-800 font-mono break-all">{error.message || t('Unknown error')}</p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-1">
                {t('Error ID')}: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            {t('Try Again')}
          </Button>

          <Button onClick={() => (window.location.href = '/')} variant="outline" className="w-full">
            {t('Go Home')}
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-2">{t('Need help?')}</p>
          <a href="mailto:support@bekind.com" className="text-sm text-primary hover:underline">
            support@bekind.com
          </a>
        </div>
      </Card>
    </div>
  )
}
