// User types for the User feature
export interface User {
  id: string
  address: string
  name?: string | null
  trustScore: number
  createdAt: Date
}

export interface CreateUserRequest {
  address: string
  name?: string
}

export interface UpdateUserRequest {
  name?: string
  trustScore?: number
}
