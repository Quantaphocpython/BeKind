import { EMAIL_SUBJECTS, EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum'
import { SendSmtpEmail, TransactionalEmailsApi } from '@sendinblue/client'
import fs from 'fs'
import { injectable } from 'inversify'
import path from 'path'
import { EmailData, IEmailService } from '../interface/EmailService.interface'

@injectable()
export class EmailService implements IEmailService {
  private apiInstance: TransactionalEmailsApi
  private senderEmail: string
  private templatesPath: string

  constructor() {
    this.apiInstance = new TransactionalEmailsApi()

    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is required')
    }

    this.apiInstance.setApiKey(0, apiKey)
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@bekind.com'
    this.templatesPath = path.join(process.cwd(), 'public', 'templates')
  }

  private readTemplateFile(templateId: EmailTemplateEnum): string {
    try {
      const filePath = path.join(this.templatesPath, templateId)

      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found: ${filePath}`)
      }

      return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
      console.error(`Error reading template file for ${templateId}:`, error)
      throw error
    }
  }

  private renderTemplate(templateContent: string, params: Record<string, any>): string {
    let renderedContent = templateContent

    Object.entries(params).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      renderedContent = renderedContent.replace(placeholder, String(value))
    })

    return renderedContent
  }

  async sendTemplateEmail(emailData: EmailData): Promise<boolean> {
    try {
      const { to, templateId, params = {}, subject, from } = emailData

      const templateContent = this.readTemplateFile(templateId)

      const htmlContent = this.renderTemplate(templateContent, params)

      const toEmails = Array.isArray(to) ? to : [to]

      const sendSmtpEmail: SendSmtpEmail = {
        to: toEmails.map((email) => ({ email })),
        subject: subject || EMAIL_SUBJECTS[templateId],
        htmlContent,
        sender: { email: from || this.senderEmail },
      }

      await this.apiInstance.sendTransacEmail(sendSmtpEmail)

      return true
    } catch (error) {
      console.error('Error sending template email:', error)
      return false
    }
  }

  async sendSimpleEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
    textContent?: string,
  ): Promise<boolean> {
    try {
      const toEmails = Array.isArray(to) ? to : [to]

      const sendSmtpEmail: SendSmtpEmail = {
        to: toEmails.map((email) => ({ email })),
        subject,
        htmlContent,
        textContent,
        sender: { email: this.senderEmail },
      }

      await this.apiInstance.sendTransacEmail(sendSmtpEmail)

      return true
    } catch (error) {
      console.error('Error sending simple email:', error)
      return false
    }
  }
}
