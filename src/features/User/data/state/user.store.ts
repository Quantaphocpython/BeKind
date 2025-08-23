import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UserDto } from '../dto'

interface UserState {
  user: UserDto | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  setUser: (user: UserDto | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearUser: () => void
  setLastFetched: (timestamp: number) => void
  shouldRefetch: () => boolean
  invalidateCache: () => void
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        error: null,
        lastFetched: null,
        setUser: (user) => set({ user, error: null, lastFetched: Date.now() }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error, isLoading: false }),
        clearUser: () => set({ user: null, error: null, isLoading: false, lastFetched: null }),
        setLastFetched: (timestamp) => set({ lastFetched: timestamp }),
        shouldRefetch: () => {
          const { lastFetched } = get()
          if (!lastFetched) return true
          return Date.now() - lastFetched > CACHE_DURATION
        },
        invalidateCache: () => set({ lastFetched: null }),
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          user: state.user,
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: 'user-store',
    },
  ),
)
