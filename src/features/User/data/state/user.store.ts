import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UserDto } from '../dto'

interface UserState {
  user: UserDto | null
  isLoading: boolean
  error: string | null
  setUser: (user: UserDto | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      clearUser: () => set({ user: null, error: null, isLoading: false }),
    }),
    {
      name: 'user-store',
    },
  ),
)
