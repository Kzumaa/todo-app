import type { Todo } from "../types/todo";
import { TodoCardComponent } from "./TodoCard";

/**
 * Todo List Component
 * Single Responsibility: Rendering a list of todos
 */
export class TodoListComponent {
  private cardComponent: TodoCardComponent;

  constructor() {
    this.cardComponent = new TodoCardComponent();
  }

  render(
    todos: Todo[],
    container: HTMLElement,
    handlers: {
      onEdit: (id: number) => void;
      onDelete: (id: number) => void;
      onToggleComplete: (id: number) => void;
    }
  ): void {
    container.innerHTML = "";

    if (todos.length === 0) {
      this.renderEmptyState(container);
      return;
    }

    todos.forEach((todo) => {
      const card = this.cardComponent.create(todo, handlers);
      container.appendChild(card);
    });
  }

  private renderEmptyState(container: HTMLElement): void {
    container.innerHTML = '<p class="empty-message">No todos here yet!</p>';
  }
}
