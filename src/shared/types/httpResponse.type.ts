export interface HttpResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Pagination<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
}

export type PaginationResponse<T> = HttpResponse<Pagination<T>>;
