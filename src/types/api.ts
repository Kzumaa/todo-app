/**
 * Data Transfer Object for API communication
 * Represents the raw data structure from/to the API
 */
export interface TodoDTO {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

/**
 * Request DTO for creating a new todo
 */
export interface CreateTodoDTO {
  title: string;
  description: string;
  dueDate?: string | null;
}

/**
 * Request DTO for updating a todo
 */
export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
}

export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationResponse;
};

export type PaginationResponse = {
  total: number;
  page: number;
  pageSize: number;
};
