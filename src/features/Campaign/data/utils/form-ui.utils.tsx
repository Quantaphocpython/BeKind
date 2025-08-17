import React from 'react'
import { CAMPAIGN_CONSTANTS, FORM_CONFIG } from '../constants'

export interface FormUIUtils {
  getCharacterCountColor: (length: number) => string
  getCharacterCountText: (length: number) => string
  getGoalInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
}

export const createFormUIUtils = (): FormUIUtils => ({
  getCharacterCountColor: (length: number) => {
    const threshold = CAMPAIGN_CONSTANTS.MAX_DESCRIPTION_LENGTH * FORM_CONFIG.CHARACTER_WARNING_THRESHOLD
    return length > threshold ? 'text-orange-500' : ''
  },

  getCharacterCountText: (length: number) => {
    return `${length || 0}/${CAMPAIGN_CONSTANTS.MAX_DESCRIPTION_LENGTH}`
  },

  getGoalInputProps: () => ({
    type: 'number',
    step: '0.001',
    min: CAMPAIGN_CONSTANTS.MIN_GOAL,
    max: CAMPAIGN_CONSTANTS.MAX_GOAL,
    placeholder: '0.1',
  }),
})
