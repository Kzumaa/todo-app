import type { Todo } from "../types/todo";
import { TodoApiRepository } from "../repositories/todoRepository";
import { TodoMapper } from "../mappers/todoMapper";

/**
 * Todo Service
 * Single Responsibility: Business logic for todos
 * Delegates data access to repository
 * Delegates data transformation to mapper
 */
export class TodoService {
  private repository: TodoApiRepository;

  constructor(repository?: TodoApiRepository) {
    this.repository = repository || new TodoApiRepository();
  }

  async getAll(): Promise<Todo[]> {
    const dtos = await this.repository.findAll();
    return TodoMapper.toDomainList(dtos);
  }

  async getById(id: number): Promise<Todo | undefined> {
    try {
      const dto = await this.repository.findById(id);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      console.error(`Todo with id ${id} not found`);
      return undefined;
    }
  }

  async add(
    todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">
  ): Promise<Todo | null> {
    try {
      const createDto = TodoMapper.toCreateDTO(todoData);
      const dto = await this.repository.create(createDto);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }

  async update(
    id: number,
    updates: Partial<Omit<Todo, "id" | "createdAt">>
  ): Promise<Todo | undefined> {
    try {
      const updateDto = TodoMapper.toUpdateDTO(updates);
      const dto = await this.repository.update(id, updateDto);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      return undefined;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      return false;
    }
  }

  async toggleComplete(id: number): Promise<Todo | undefined> {
    const todo = await this.getById(id);
    if (!todo) return undefined;

    return await this.update(id, { completed: !todo.completed });
  }

  async search(query: string): Promise<Todo[]> {
    const todos = await this.getAll();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return todos;

    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(lowerQuery)
    );
  }
}
