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
    <div className="space-y-3">
      <Label htmlFor={props.name} className="text-base font-semibold text-foreground/90">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {type === 'textarea' ? (
        <div className="relative group">
          <Textarea
            id={props.name}
            placeholder={placeholder}
            className={`min-h-[140px] resize-none text-base leading-relaxed border-2 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm ${
              error
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border/50 hover:border-border focus:border-primary/50'
            }`}
            {...props}
          />
          {error && (
            <div className="absolute -bottom-6 left-0 flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-500 font-medium">{error.message}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative group">
          <input
            id={props.name}
            type={type}
            placeholder={placeholder}
            className={`flex h-12 w-full rounded-xl border-2 transition-all duration-300 bg-background/50 backdrop-blur-sm px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border/50 hover:border-border focus:border-primary/50'
            }`}
            {...props}
          />
          {error && (
            <div className="absolute -bottom-6 left-0 flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-500 font-medium">{error.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
