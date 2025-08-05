import { useTranslations } from '@/shared/hooks'
import ContactForm from '../organisms/ContactForm'
import ContactMethods from '../organisms/ContactMethods'

export default function ContactPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('Get in Touch')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('We would love to hear from you. Send us a message and we will respond as soon as possible.')}
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-20">
          <ContactMethods />
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">{t('Send us a Message')}</h2>
              <p className="text-muted-foreground text-lg">
                {t('Fill out the form below and we will get back to you within 24 hours')}
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
