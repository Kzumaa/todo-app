import type { Todo } from "../types/todo";

export type TodoStatus = "all" | "completed" | "overdue" | "normal";

export interface CategorizedTodos {
  completed: Todo[];
  overdue: Todo[];
  normal: Todo[];
}

/**
 * Todo Filter Service - Filtering and categorizing logic
 * Simplified: Uses functions instead of class
 */

const getTodayMidnight = (): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export function filterByStatus(todos: Todo[], status: TodoStatus): Todo[] {
  if (status === "all") return todos;

  const now = getTodayMidnight();

  switch (status) {
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "overdue":
      return todos.filter(
        (todo) =>
          !todo.completed && todo.dueDate && new Date(todo.dueDate) < now
      );
    case "normal":
      return todos.filter(
        (todo) =>
          !todo.completed && (!todo.dueDate || new Date(todo.dueDate) >= now)
      );
    default:
      return todos;
  }
}

export function categorize(todos: Todo[]): CategorizedTodos {
  const now = getTodayMidnight();

  const completed: Todo[] = [];
  const overdue: Todo[] = [];
  const normal: Todo[] = [];

  todos.forEach((todo) => {
    if (todo.completed) {
      completed.push(todo);
    } else if (todo.dueDate && new Date(todo.dueDate) < now) {
      overdue.push(todo);
    } else {
      normal.push(todo);
    }
  });

  return { completed, overdue, normal };
}

export function isOverdue(todo: Todo): boolean {
  if (todo.completed || !todo.dueDate) return false;
  const now = getTodayMidnight();
  return new Date(todo.dueDate) < now;
}
