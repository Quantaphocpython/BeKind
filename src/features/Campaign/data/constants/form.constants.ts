// Form validation messages

export enum FORM_STATE {
  IDLE = 'idle',
  CONTRACT_PENDING = 'contract_pending',
  CONTRACT_SUCCESS = 'contract_success',
  API_PENDING = 'api_pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Form configuration
export const FORM_CONFIG = {
  SUCCESS_MESSAGE_DURATION: 3000, // 3 seconds
  CHARACTER_WARNING_THRESHOLD: 0.9, // 90% of max length
} as const
