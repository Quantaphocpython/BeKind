import { QueryClient, QueryClientProvider as QueryClientProviderRender } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

interface QueryClientProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return (
    <QueryClientProviderRender client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProviderRender>
  )
}

export default QueryClientProvider
