import * as todoService from "./services/todoService";
import * as filterService from "./services/todoFilterService";
import type { TodoStatus } from "./services/todoFilterService";
import {
  renderTodoList,
  showEditModal,
  hideEditModal,
  paginateArray,
  updatePaginationControls,
  calculateTotalPages,
} from "./components/ui";

/**
 * Todo App - Functional approach
 * Simple state management and event handling
 */

// Application state
const state = {
  currentPage: 1,
  pageSize: 6,
  searchQuery: "",
  statusFilter: "all" as TodoStatus,
};

// Main render function
async function render() {
  // Get todos
  let todos = state.searchQuery
    ? await todoService.searchTodos(state.searchQuery)
    : await todoService.getAllTodos();

  // Apply filter
  todos = filterService.filterByStatus(todos, state.statusFilter);

  // Categorize
  const categorized = filterService.categorize(todos);

  // Calculate pagination
  const maxTodos = Math.max(
    categorized.completed.length,
    categorized.normal.length,
    categorized.overdue.length
  );

  const totalPages = calculateTotalPages(maxTodos, state.pageSize);

  // Adjust current page if needed
  if (state.currentPage > totalPages) {
    state.currentPage = totalPages;
  }

  // Paginate categories
  const paginatedCompleted = paginateArray(
    categorized.completed,
    state.currentPage,
    state.pageSize
  );
  const paginatedNormal = paginateArray(
    categorized.normal,
    state.currentPage,
    state.pageSize
  );
  const paginatedOverdue = paginateArray(
    categorized.overdue,
    state.currentPage,
    state.pageSize
  );

  // Event handlers
  const handlers = {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleComplete: handleToggleComplete,
  };

  // Render lists
  const completedContainer = document.getElementById(
    "completedTodos"
  ) as HTMLElement;
  const normalContainer = document.getElementById("normalTodos") as HTMLElement;
  const overdueContainer = document.getElementById(
    "overdueTodos"
  ) as HTMLElement;

  renderTodoList(paginatedCompleted, completedContainer, handlers);
  renderTodoList(paginatedNormal, normalContainer, handlers);
  renderTodoList(paginatedOverdue, overdueContainer, handlers);

  // Update pagination
  updatePaginationControls(state.currentPage, totalPages);
}

// Event handlers
async function handleAddTodo(e: Event) {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDateStr = formData.get("dueDate") as string;

  await todoService.addTodo({
    title,
    description,
    dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
  });

  form.reset();
  state.currentPage = 1;
  await render();
}

async function handleEditTodo(e: Event) {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  const id = parseInt(
    (document.getElementById("editId") as HTMLInputElement).value
  );
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDateStr = formData.get("dueDate") as string;

  await todoService.updateTodo(id, {
    title,
    description,
    dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
  });

  hideEditModal();
  await render();
}

async function handleEdit(id: number) {
  const todo = await todoService.getTodoById(id);
  if (todo) {
    showEditModal(todo);
  }
}

async function handleDelete(id: number) {
  await todoService.deleteTodo(id);
  await render();
}

async function handleToggleComplete(id: number) {
  await todoService.toggleTodoComplete(id);
  await render();
}

// Setup event listeners
function setupEventListeners() {
  // Add todo form
  const todoForm = document.getElementById("todoForm") as HTMLFormElement;
  todoForm?.addEventListener("submit", handleAddTodo);

  // Edit modal
  const editForm = document.getElementById("editForm") as HTMLFormElement;
  editForm?.addEventListener("submit", handleEditTodo);

  const closeModal = document.querySelector(".close") as HTMLElement;
  closeModal?.addEventListener("click", hideEditModal);

  const modal = document.getElementById("editModal") as HTMLElement;
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideEditModal();
    }
  });

  // Search
  const searchInput = document.getElementById(
    "searchInput"
  ) as HTMLInputElement;
  searchInput?.addEventListener("input", async (e) => {
    state.searchQuery = (e.target as HTMLInputElement).value;
    state.currentPage = 1;
    await render();
  });

  // Filter
  const statusFilter = document.getElementById(
    "statusFilter"
  ) as HTMLSelectElement;
  statusFilter?.addEventListener("change", async (e) => {
    state.statusFilter = (e.target as HTMLSelectElement).value as TodoStatus;
    state.currentPage = 1;
    await render();
  });

  // Pagination
  const prevBtn = document.getElementById("prevPage") as HTMLButtonElement;
  prevBtn?.addEventListener("click", async () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      await render();
    }
  });

  const nextBtn = document.getElementById("nextPage") as HTMLButtonElement;
  nextBtn?.addEventListener("click", async () => {
    state.currentPage++;
    await render();
  });

  const pageSizeSelect = document.getElementById(
    "pageSize"
  ) as HTMLSelectElement;
  pageSizeSelect?.addEventListener("change", async (e) => {
    state.pageSize = parseInt((e.target as HTMLSelectElement).value);
    state.currentPage = 1;
    await render();
  });
}

// Initialize the app
export async function initTodoApp() {
  setupEventListeners();
  await render();
}
