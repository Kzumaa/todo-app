import type { Todo } from "../types/todo";
import type { TodoDTO, CreateTodoDTO, UpdateTodoDTO } from "../types/api";

/**
 * Mapper class for converting between domain models and DTOs
 * Single Responsibility: Data transformation
 */
export class TodoMapper {
  /**
   * Converts API DTO to domain Todo model
   */
  static toDomain(dto: TodoDTO): Todo {
    return {
      id: dto.id!,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    };
  }

  /**
   * Converts domain Todo model to API DTO
   */
  static toDTO(todo: Todo): TodoDTO {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    };
  }

  /**
   * Converts create request to DTO
   */
  static toCreateDTO(
    data: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">
  ): CreateTodoDTO {
    return {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? data.dueDate.toISOString() : null,
    };
  }

  /**
   * Converts update request to DTO
   */
  static toUpdateDTO(updates: Partial<Todo>): UpdateTodoDTO {
    const dto: UpdateTodoDTO = {};

    if (updates.title !== undefined) dto.title = updates.title;
    if (updates.description !== undefined)
      dto.description = updates.description;
    if (updates.completed !== undefined) dto.completed = updates.completed;
    if (updates.dueDate !== undefined) {
      dto.dueDate = updates.dueDate ? updates.dueDate.toISOString() : null;
    }

    return dto;
  }

  /**
   * Converts multiple DTOs to domain models
   */
  static toDomainList(dtos: TodoDTO[]): Todo[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}
