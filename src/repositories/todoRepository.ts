import { httpClient } from "../services/http";
import type { TodoDTO } from "../types/api";

/**
 * Todo API Repository
 * Single Responsibility: API communication for todos
 * Follows Repository Pattern
 */
export class TodoApiRepository {
  private readonly endpoint = "/todos";

  async findAll(): Promise<TodoDTO[]> {
    return httpClient.get<TodoDTO[]>(this.endpoint);
  }

  async findById(id: number): Promise<TodoDTO> {
    return httpClient.get<TodoDTO>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<TodoDTO>): Promise<TodoDTO> {
    const payload = {
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<TodoDTO>(this.endpoint, payload);
  }

  async update(id: number, data: Partial<TodoDTO>): Promise<TodoDTO> {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return httpClient.put<TodoDTO>(`${this.endpoint}/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`${this.endpoint}/${id}`);
  }
}
