export type ApiSuccess<TData> = {
  status: "success";
  message: string;
  data: TData;
  metadata?: Record<string, unknown>;
};

export type ApiError = {
  status: "error";
  errorCode: string;
  message: string;
  validationDetails?: Record<string, unknown>;
};

export type ApiResponse<TData> = ApiSuccess<TData> | ApiError;

export type PageInfo = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  pageInfo: PageInfo;
};

export type QueryPagination = {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
};
