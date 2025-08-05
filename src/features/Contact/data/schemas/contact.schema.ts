import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Helper function to create schema with custom messages
export const createContactFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t('Name must be at least 2 characters'))
      .max(50, t('Name must be less than 50 characters'))
      .regex(/^[a-zA-Z\s]+$/, t('Name can only contain letters and spaces')),
    email: z.string().email(t('Please enter a valid email address')).min(1, t('Email is required')),
    subject: z
      .string()
      .min(5, t('Subject must be at least 5 characters'))
      .max(100, t('Subject must be less than 100 characters')),
    message: z
      .string()
      .min(10, t('Message must be at least 10 characters'))
      .max(1000, t('Message must be less than 1000 characters')),
  })
