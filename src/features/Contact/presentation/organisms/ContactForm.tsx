'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CONTACT_CONSTANTS } from '../../data/constants/contact.constants'
import { createContactFormSchema, type ContactFormData } from '../../data/schemas/contact.schema'
import ContactFormField from '../atoms/ContactFormField'

export default function ContactForm() {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactFormSchema = createContactFormSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success notification
      toast.success(t('Message sent successfully! We will get back to you soon.'))

      // Reset form
      reset()
    } catch (error) {
      // Error notification
      toast.error(t('Failed to send message. Please try again.'))
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactFormField
          label={t('Name')}
          type="text"
          placeholder={t('Enter your name')}
          required
          error={errors.name}
          {...register(CONTACT_CONSTANTS.FORM_FIELDS.NAME)}
        />
        <ContactFormField
          label={t('Email')}
          type="email"
          placeholder={t('Enter your email')}
          required
          error={errors.email}
          {...register(CONTACT_CONSTANTS.FORM_FIELDS.EMAIL)}
        />
      </div>

      <ContactFormField
        label={t('Subject')}
        type="text"
        placeholder={t('Enter subject')}
        required
        error={errors.subject}
        {...register(CONTACT_CONSTANTS.FORM_FIELDS.SUBJECT)}
      />

      <ContactFormField
        label={t('Message')}
        type="textarea"
        placeholder={t('Enter your message')}
        required
        error={errors.message}
        {...register(CONTACT_CONSTANTS.FORM_FIELDS.MESSAGE)}
      />

      <div className="flex justify-center pt-8">
        <Button
          type="submit"
          size="lg"
          className="relative px-16 py-4 text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/80 hover:via-primary/70 hover:to-primary/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 disabled:transform-none disabled:scale-100 group overflow-hidden"
          disabled={isSubmitting}
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="relative flex items-center space-x-2">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t('Sending...')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>{t('Send Message')}</span>
              </>
            )}
          </span>
        </Button>
      </div>
    </form>
  )
}
