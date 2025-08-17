// Frontend DTOs for User feature
export interface UserDto {
  id: string
  address: string
  name?: string | null
  trustScore: number
  createdAt: string
}

export interface CreateUserRequestDto {
  address: string
  name?: string // Optional - backend will generate if not provided
}

export interface CreateUserResponseDto {
  user: UserDto
}

export interface UserListResponseDto {
  users: UserDto[]
}
