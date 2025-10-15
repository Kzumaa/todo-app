import type { Todo } from "../types/todo";
import { isOverdue } from "../services/todoFilterService";

/**
 * UI Component Functions - Simple functional approach
 */

// Helpers
const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateForInput = (date: Date): string => {
  return new Date(date).toISOString().split("T")[0];
};

// Create a single todo card
export function createTodoCard(
  todo: Todo,
  handlers: {
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
  }
): HTMLElement {
  const card = document.createElement("div");
  card.className = "todo-card";
  card.dataset.todoId = todo.id.toString();

  if (todo.completed) card.classList.add("completed");
  if (isOverdue(todo)) card.classList.add("overdue");

  card.innerHTML = `
    <div class="todo-header">
      <h3 class="todo-title ${todo.completed ? "crossed-out" : ""}">
        ${escapeHtml(todo.title)}
      </h3>
    </div>
    <div class="todo-body">
      <p class="todo-description">
        ${escapeHtml(truncateText(todo.description))}
      </p>
      ${
        todo.dueDate
          ? `<p class="todo-due-date ${
              isOverdue(todo) ? "overdue-text" : ""
            }">📅 ${formatDate(todo.dueDate)}</p>`
          : ""
      }
    </div>
    <div class="todo-actions">
      <button class="btn btn-small btn-complete" data-id="${todo.id}">
        ${todo.completed ? "↩️ Uncomplete" : "✓ Complete"}
      </button>
      <button class="btn btn-small btn-edit" data-id="${
        todo.id
      }">✏️ Edit</button>
      <button class="btn btn-small btn-delete" data-id="${
        todo.id
      }">🗑️ Delete</button>
    </div>
  `;

  // Attach event listeners
  const completeBtn = card.querySelector(".btn-complete") as HTMLButtonElement;
  const editBtn = card.querySelector(".btn-edit") as HTMLButtonElement;
  const deleteBtn = card.querySelector(".btn-delete") as HTMLButtonElement;

  completeBtn?.addEventListener("click", () =>
    handlers.onToggleComplete(todo.id)
  );
  editBtn?.addEventListener("click", () => handlers.onEdit(todo.id));
  deleteBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      handlers.onDelete(todo.id);
    }
  });

  return card;
}

// Render a list of todos
export function renderTodoList(
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
    container.innerHTML = '<p class="empty-message">No todos here yet!</p>';
    return;
  }

  todos.forEach((todo) => {
    const card = createTodoCard(todo, handlers);
    container.appendChild(card);
  });
}

// Modal functions
export function showEditModal(todo: Todo): void {
  const modal = document.getElementById("editModal") as HTMLElement;
  if (!modal) return;

  const editIdInput = document.getElementById("editId") as HTMLInputElement;
  const editTitleInput = document.getElementById(
    "editTitle"
  ) as HTMLInputElement;
  const editDescriptionInput = document.getElementById(
    "editDescription"
  ) as HTMLTextAreaElement;
  const editDueDateInput = document.getElementById(
    "editDueDate"
  ) as HTMLInputElement;

  if (editIdInput) editIdInput.value = todo.id.toString();
  if (editTitleInput) editTitleInput.value = todo.title;
  if (editDescriptionInput) editDescriptionInput.value = todo.description;
  if (editDueDateInput) {
    editDueDateInput.value = todo.dueDate
      ? formatDateForInput(todo.dueDate)
      : "";
  }

  modal.style.display = "block";
}

export function hideEditModal(): void {
  const modal = document.getElementById("editModal") as HTMLElement;
  if (modal) modal.style.display = "none";
}

// Pagination functions
export function paginateArray<T>(
  array: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

export function updatePaginationControls(
  currentPage: number,
  totalPages: number
): void {
  const pageInfo = document.getElementById("pageInfo") as HTMLElement;
  const prevBtn = document.getElementById("prevPage") as HTMLButtonElement;
  const nextBtn = document.getElementById("nextPage") as HTMLButtonElement;

  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
  }
}

export function calculateTotalPages(
  totalItems: number,
  pageSize: number
): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
