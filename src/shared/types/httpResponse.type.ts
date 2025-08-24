export interface HttpResponse<T> {
  status: number
  message: string
  data: T
}

export interface Pagination<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export type PaginationResponse<T> = HttpResponse<Pagination<T>>

// export interface PaginatedResponseDto<T> {
//   data: T[]
//   pagination: {
//     page: number
//     limit: number
//     total: number
//     totalPages: number
//     hasNext: boolean
//     hasPrev: boolean
//   }
// }
