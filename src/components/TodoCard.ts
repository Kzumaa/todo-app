import type { Todo } from "../types/todo";

/**
 * Todo Card Component
 * Single Responsibility: Rendering a single todo card
 */
export class TodoCardComponent {
  create(
    todo: Todo,
    handlers: {
      onEdit: (id: number) => void;
      onDelete: (id: number) => void;
      onToggleComplete: (id: number) => void;
    }
  ): HTMLElement {
    const card = document.createElement("div");
    card.className = this.getCardClasses(todo);
    card.dataset.todoId = todo.id.toString();
    card.innerHTML = this.getCardHTML(todo);

    this.attachEventListeners(card, todo.id, handlers);

    return card;
  }

  private getCardClasses(todo: Todo): string {
    const classes = ["todo-card"];

    if (todo.completed) {
      classes.push("completed");
    }

    if (this.isOverdue(todo)) {
      classes.push("overdue");
    }

    return classes.join(" ");
  }

  private getCardHTML(todo: Todo): string {
    return `
      <div class="todo-header">
        <h3 class="todo-title ${todo.completed ? "crossed-out" : ""}">
          ${this.escapeHtml(todo.title)}
        </h3>
      </div>
      <div class="todo-body">
        <p class="todo-description">
          ${this.escapeHtml(this.truncateText(todo.description))}
        </p>
        ${this.getDueDateHTML(todo)}
      </div>
      <div class="todo-actions">
        <button class="btn btn-small btn-complete" data-id="${todo.id}">
          ${todo.completed ? "↩️ Uncomplete" : "✓ Complete"}
        </button>
        <button class="btn btn-small btn-edit" data-id="${todo.id}">
          ✏️ Edit
        </button>
        <button class="btn btn-small btn-delete" data-id="${todo.id}">
          🗑️ Delete
        </button>
      </div>
    `;
  }

  private getDueDateHTML(todo: Todo): string {
    if (!todo.dueDate) return "";

    const isOverdue = this.isOverdue(todo);
    const dateClass = isOverdue ? "overdue-text" : "";
    const formattedDate = this.formatDate(todo.dueDate);

    return `<p class="todo-due-date ${dateClass}">📅 ${formattedDate}</p>`;
  }

  private attachEventListeners(
    card: HTMLElement,
    todoId: number,
    handlers: {
      onEdit: (id: number) => void;
      onDelete: (id: number) => void;
      onToggleComplete: (id: number) => void;
    }
  ): void {
    const completeBtn = card.querySelector(
      ".btn-complete"
    ) as HTMLButtonElement;
    const editBtn = card.querySelector(".btn-edit") as HTMLButtonElement;
    const deleteBtn = card.querySelector(".btn-delete") as HTMLButtonElement;

    completeBtn?.addEventListener("click", () =>
      handlers.onToggleComplete(todoId)
    );
    editBtn?.addEventListener("click", () => handlers.onEdit(todoId));
    deleteBtn?.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this todo?")) {
        handlers.onDelete(todoId);
      }
    });
  }

  private isOverdue(todo: Todo): boolean {
    if (todo.completed || !todo.dueDate) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(todo.dueDate) < now;
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
