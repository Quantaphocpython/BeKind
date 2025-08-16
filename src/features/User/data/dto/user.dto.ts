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
  name?: string
}

export interface CreateUserResponseDto {
  user: UserDto
}

export interface UserListResponseDto {
  users: UserDto[]
}
