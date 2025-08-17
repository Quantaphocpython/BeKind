import React from 'react'
import { FORM_STATE } from '../constants'

export interface FormStateUtils {
  getFormStateMessage: (formState: FORM_STATE, errorMessage?: string) => string
  getFormStateIcon: (formState: FORM_STATE) => React.ReactNode | null
  getFormStateVariant: (formState: FORM_STATE) => 'default' | 'destructive'
}
