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

  const onSubmit = async (data: ContactFormData) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? t('Sending...') : t('Send Message')}
      </Button>
    </form>
  )
}
