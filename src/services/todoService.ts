import type { Todo } from "../types/todo";
import type { TodoDTO } from "../types/api";
import { TodoApiRepository } from "../repositories/todoRepository";

/**
 * Todo Service - Business logic for todos
 * Simplified: Uses functions instead of class
 */

const repository = new TodoApiRepository();

// Helper: Convert DTO to Domain model
const toDomain = (dto: TodoDTO): Todo => ({
  id: dto.id!,
  title: dto.title,
  description: dto.description,
  completed: dto.completed,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
});

export async function getAllTodos(): Promise<Todo[]> {
  const dtos = await repository.findAll();
  return dtos.map(toDomain);
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  try {
    const dto = await repository.findById(id);
    return toDomain(dto);
  } catch (error) {
    console.error(`Todo with id ${id} not found`);
    return undefined;
  }
}

export async function addTodo(
  data: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">
): Promise<Todo | null> {
  try {
    const createDto = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? data.dueDate.toISOString() : null,
    };
    const dto = await repository.create(createDto);
    return toDomain(dto);
  } catch (error) {
    console.error("Error adding todo:", error);
    return null;
  }
}

export async function updateTodo(
  id: number,
  updates: Partial<Omit<Todo, "id" | "createdAt">>
): Promise<Todo | undefined> {
  try {
    const updateDto: any = {};
    if (updates.title !== undefined) updateDto.title = updates.title;
    if (updates.description !== undefined)
      updateDto.description = updates.description;
    if (updates.completed !== undefined)
      updateDto.completed = updates.completed;
    if (updates.dueDate !== undefined) {
      updateDto.dueDate = updates.dueDate
        ? updates.dueDate.toISOString()
        : null;
    }

    const dto = await repository.update(id, updateDto);
    return toDomain(dto);
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    return undefined;
  }
}

export async function deleteTodo(id: number): Promise<boolean> {
  try {
    await repository.delete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    return false;
  }
}

export async function toggleTodoComplete(
  id: number
): Promise<Todo | undefined> {
  const todo = await getTodoById(id);
  if (!todo) return undefined;
  return await updateTodo(id, { completed: !todo.completed });
}

export async function searchTodos(query: string): Promise<Todo[]> {
  const todos = await getAllTodos();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return todos;
  return todos.filter((todo) => todo.title.toLowerCase().includes(lowerQuery));
}
