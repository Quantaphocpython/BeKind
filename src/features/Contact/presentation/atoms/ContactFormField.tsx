'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from '@/shared/hooks'
import { FieldError } from 'react-hook-form'

interface ContactFormFieldProps {
  label: string
  name?: string // Made optional
  type?: 'text' | 'email' | 'textarea'
  placeholder?: string
  required?: boolean
  error?: FieldError // Changed type to FieldError
}

export default function ContactFormField({
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  ...props
}: ContactFormFieldProps) {
  const t = useTranslations()

  return (
    <div className="space-y-2">
      <Label htmlFor={props.name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={props.name}
          placeholder={placeholder}
          className={`min-h-[120px] resize-none ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          {...props}
        />
      ) : (
        <input
          id={props.name}
          type={type}
          placeholder={placeholder}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      )}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
