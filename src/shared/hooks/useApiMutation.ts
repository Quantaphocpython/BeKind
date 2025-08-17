import { HttpResponse } from '@/shared/types/httpResponse.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Generic API hook for POST/PUT/DELETE requests
export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<HttpResponse<TData>>,
  options?: {
    onSuccess?: (data: HttpResponse<TData>, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    invalidateQueries?: string[][]
  },
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }

      // Call custom onSuccess
      options?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      options?.onError?.(error, variables)
    },
  })
}
