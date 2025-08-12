import { useTranslations } from '@/shared/hooks'
import ContactForm from '../organisms/ContactForm'
import ContactMethods from '../organisms/ContactMethods'

export default function ContactPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section with enhanced styling */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl mb-8 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent leading-tight">
            {t('Get in Touch')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
            {t('We would love to hear from you. Send us a message and we will respond as soon as possible.')}
          </p>
        </div>

        {/* Contact Methods with enhanced layout */}
        <div className="mb-24">
          <ContactMethods />
        </div>

        {/* Contact Form with enhanced styling */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full opacity-20" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full opacity-30" />

            <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-8 md:p-16 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-30" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {t('Send us a Message')}
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    {t('Fill out the form below and we will get back to you within 24 hours')}
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>

        {/* Additional info section */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium">{t('Your information is secure and will never be shared')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
