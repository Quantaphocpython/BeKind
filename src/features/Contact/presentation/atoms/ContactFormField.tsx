'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface ContactFormFieldProps {
  label: string
  name?: string
  type?: 'text' | 'email' | 'textarea'
  placeholder?: string
  required?: boolean
  error?: FieldError
}

const ContactFormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, ContactFormFieldProps>(
  ({ label, name, type = 'text', placeholder, required = false, error }, ref) => {
    const t = useTranslations()

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {type === 'textarea' ? (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
            className={`min-h-[120px] ${error ? 'border-red-500 focus:border-red-500' : ''}`}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            className={error ? 'border-red-500 focus:border-red-500' : ''}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    )
  },
)

ContactFormField.displayName = 'ContactFormField'

export default ContactFormField
