// Matches the backend's centralized response shape:
// { success, message, data?, meta? } for success,
// { success: false, message, details? } for errors.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  details?: ValidationErrorDetail[];
}
