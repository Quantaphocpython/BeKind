'use client'

import { container, TYPES } from '@/features/Common/container'
import { useApiMutation, useApiQuery } from '@/shared/hooks'
import { HttpResponse } from '@/shared/types/httpResponse.type'
import { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { CreateUserRequestDto, UserDto } from '../dto'
import { UserService } from '../services/user.service'
import { useUserStore } from '../state'

export const useUser = (queryOptions?: any, mutationOptions?: any) => {
  const { address, isConnected } = useAccount()
  const { setUser, setLoading, setError, clearUser } = useUserStore()
  const hasAttemptedCreate = useRef(false)

  // Query to get user by address
  const {
    data: userResponse,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
    ...queryProps
  } = useApiQuery(
    ['user', address || ''],
    async (): Promise<HttpResponse<UserDto>> => {
      if (!address) {
        throw new Error('Address is required')
      }
      const userService = container.get(TYPES.UserService) as UserService
      return await userService.getUserByAddress(address)
    },
    {
      enabled: !!address && isConnected,
      select: (response) => response?.data || null,
      ...queryOptions,
    },
  )

  // Mutation to create user
  const {
    mutateAsync: createUser,
    isPending: isCreatingUser,
    error: createError,
    ...mutationProps
  } = useApiMutation(
    async (data: CreateUserRequestDto) => {
      const userService = container.get(TYPES.UserService) as UserService
      return await userService.createUserIfNotExists(data)
    },
    {
      onSuccess: (response) => {
        setUser(response.data.user)
        hasAttemptedCreate.current = true
      },
      onError: (error) => {
        setError(error instanceof Error ? error.message : 'Failed to create user')
        hasAttemptedCreate.current = true
      },
      invalidateQueries: [['user', address || '']],
      ...mutationOptions,
    },
  )

  // Sync user state with store
  useEffect(() => {
    setLoading(isLoadingUser)
    if (userResponse) {
      setUser(userResponse)
    } else if (userError) {
      setError(userError instanceof Error ? userError.message : 'Failed to fetch user')
    }
  }, [userResponse, isLoadingUser, userError, setUser, setLoading, setError])

  // Clear user when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      clearUser()
      hasAttemptedCreate.current = false
    }
  }, [isConnected, address, clearUser])

  // Auto-create user when wallet connects and user doesn't exist
  useEffect(() => {
    if (
      isConnected &&
      address &&
      !isLoadingUser &&
      !userResponse &&
      !userError &&
      !hasAttemptedCreate.current &&
      !isCreatingUser
    ) {
      hasAttemptedCreate.current = true
      createUser({ address })
    }
  }, [isConnected, address, isLoadingUser, userResponse, userError, createUser, isCreatingUser])

  return {
    user: userResponse,
    isLoading: isLoadingUser || isCreatingUser,
    error: userError || createError,
    refetchUser,
    createUser,
    isCreatingUser,
    ...queryProps,
    ...mutationProps,
  }
}
