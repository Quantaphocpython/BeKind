// Frontend DTOs for User feature
export interface UserDto {
  id: string
  address: string
  name?: string | null
  email?: string | null
  trustScore: number
  createdAt: string
}

export interface CreateUserRequestDto {
  address: string
  name?: string // Optional - backend will generate if not provided
  email?: string // Optional - for notifications
}

export interface CreateUserResponseDto {
  user: UserDto
}

export interface UserListResponseDto {
  users: UserDto[]
}

export interface SendOtpRequestDto {
  email: string
  userAddress: string
}

export interface SendOtpResponseDto {
  success: boolean
  message: string
}

export interface VerifyOtpRequestDto {
  email: string
  otp: string
  userAddress: string
}

export interface VerifyOtpResponseDto {
  success: boolean
  message: string
}

export interface UpdateUserEmailRequestDto {
  email: string
  userAddress: string
}
