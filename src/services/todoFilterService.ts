import type { Todo } from "../types/todo";

export type TodoStatus = "all" | "completed" | "overdue" | "normal";

export interface CategorizedTodos {
  completed: Todo[];
  overdue: Todo[];
  normal: Todo[];
}

/**
 * Todo Filter Service
 * Single Responsibility: Filtering and categorizing todos
 */
export class TodoFilterService {
  /**
   * Filter todos by status
   */
  filterByStatus(todos: Todo[], status: TodoStatus): Todo[] {
    if (status === "all") return todos;

    const now = this.getTodayMidnight();

    switch (status) {
      case "completed":
        return this.getCompleted(todos);
      case "overdue":
        return this.getOverdue(todos, now);
      case "normal":
        return this.getNormal(todos, now);
      default:
        return todos;
    }
  }

  /**
   * Categorize todos into completed, overdue, and normal
   */
  categorize(todos: Todo[]): CategorizedTodos {
    const now = this.getTodayMidnight();

    return {
      completed: this.getCompleted(todos),
      overdue: this.getOverdue(todos, now),
      normal: this.getNormal(todos, now),
    };
  }

  /**
   * Check if a todo is overdue
   */
  isOverdue(todo: Todo): boolean {
    if (todo.completed || !todo.dueDate) return false;
    const now = this.getTodayMidnight();
    return new Date(todo.dueDate) < now;
  }

  private getCompleted(todos: Todo[]): Todo[] {
    return todos.filter((todo) => todo.completed);
  }

  private getOverdue(todos: Todo[], now: Date): Todo[] {
    return todos.filter(
      (todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now
    );
  }

  private getNormal(todos: Todo[], now: Date): Todo[] {
    return todos.filter(
      (todo) =>
        !todo.completed && (!todo.dueDate || new Date(todo.dueDate) >= now)
    );
  }

  private getTodayMidnight(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }
}
