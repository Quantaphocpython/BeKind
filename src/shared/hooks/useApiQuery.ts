import { HttpResponse } from '@/shared/types/httpResponse.type'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

// Generic API hook for GET requests
export const useApiQuery = <TData>(
  queryKey: string[],
  fetcher: () => Promise<HttpResponse<TData>>,
  options?: {
    enabled?: boolean
    select?: (data: HttpResponse<TData>) => TData
  },
  ...props: UseQueryOptions<TData>[]
) => {
  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: options?.enabled ?? true,
    select: options?.select,
    ...props,
  })
}
