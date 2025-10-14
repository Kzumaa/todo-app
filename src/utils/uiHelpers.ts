import type { Todo } from "../types/todo";

export function formatDate(date: Date | undefined): string {
  if (!date) return "No due date";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function createTodoCard(
  todo: Todo,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  onToggleComplete: (id: number) => void
): HTMLElement {
  const card = document.createElement("div");
  card.className = "todo-card";
  card.dataset.todoId = todo.id.toString();

  if (todo.completed) {
    card.classList.add("completed");
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < now;

  if (isOverdue) {
    card.classList.add("overdue");
  }

  card.innerHTML = `
    <div class="todo-header">
      <h3 class="todo-title ${
        todo.completed ? "crossed-out" : ""
      }">${escapeHtml(todo.title)}</h3>
    </div>
    <div class="todo-body">
      <p class="todo-description">${escapeHtml(
        truncateText(todo.description)
      )}</p>
      ${
        todo.dueDate
          ? `<p class="todo-due-date ${
              isOverdue ? "overdue-text" : ""
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

  // Add event listeners
  const completeBtn = card.querySelector(".btn-complete") as HTMLButtonElement;
  const editBtn = card.querySelector(".btn-edit") as HTMLButtonElement;
  const deleteBtn = card.querySelector(".btn-delete") as HTMLButtonElement;

  completeBtn.addEventListener("click", () => onToggleComplete(todo.id));
  editBtn.addEventListener("click", () => onEdit(todo.id));
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      onDelete(todo.id);
    }
  });

  return card;
}

export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function renderTodoList(
  todos: Todo[],
  container: HTMLElement,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  onToggleComplete: (id: number) => void
): void {
  container.innerHTML = "";

  if (todos.length === 0) {
    container.innerHTML = '<p class="empty-message">No todos here yet!</p>';
    return;
  }

  todos.forEach((todo) => {
    const card = createTodoCard(todo, onEdit, onDelete, onToggleComplete);
    container.appendChild(card);
  });
}

export function showEditModal(todo: Todo): void {
  const modal = document.getElementById("editModal") as HTMLElement;
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

  editIdInput.value = todo.id.toString();
  editTitleInput.value = todo.title;
  editDescriptionInput.value = todo.description;
  editDueDateInput.value = todo.dueDate ? formatDateForInput(todo.dueDate) : "";

  modal.style.display = "block";
}

export function hideEditModal(): void {
  const modal = document.getElementById("editModal") as HTMLElement;
  modal.style.display = "none";
}

export function formatDateForInput(date: Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function updatePaginationControls(
  currentPage: number,
  totalPages: number
): void {
  const pageInfo = document.getElementById("pageInfo") as HTMLElement;
  const prevBtn = document.getElementById("prevPage") as HTMLButtonElement;
  const nextBtn = document.getElementById("nextPage") as HTMLButtonElement;

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

export function paginateArray<T>(
  array: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}
