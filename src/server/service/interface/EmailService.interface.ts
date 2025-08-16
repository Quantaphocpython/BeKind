import { EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum'

export interface EmailData {
  to: string | string[]
  templateId: EmailTemplateEnum
  params?: Record<string, any>
  subject?: string
  from?: string
}

export interface IEmailService {
  sendTemplateEmail(emailData: EmailData): Promise<boolean>
  sendSimpleEmail(to: string | string[], subject: string, htmlContent: string, textContent?: string): Promise<boolean>
}
