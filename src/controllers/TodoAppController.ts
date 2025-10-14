import { TodoService } from "../services/todoService";
import { TodoFilterService } from "../services/todoFilterService";
import type { TodoStatus } from "../services/todoFilterService";
import { TodoListComponent } from "../components/TodoList";
import { EditModalComponent } from "../components/EditModal";
import { PaginationComponent } from "../components/Pagination";
import type { Todo } from "../types/todo";

/**
 * Application State
 */
interface AppState {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  statusFilter: TodoStatus;
}

/**
 * Todo Application Controller
 * Orchestrates all components and services
 * Follows Controller pattern
 */
export class TodoAppController {
  private state: AppState;
  private todoService: TodoService;
  private filterService: TodoFilterService;
  private listComponent: TodoListComponent;
  private modalComponent: EditModalComponent;
  private paginationComponent: PaginationComponent;

  constructor() {
    this.state = {
      currentPage: 1,
      pageSize: 6,
      searchQuery: "",
      statusFilter: "all",
    };

    // Initialize services (Dependency Injection)
    this.todoService = new TodoService();
    this.filterService = new TodoFilterService();

    // Initialize components
    this.listComponent = new TodoListComponent();
    this.modalComponent = new EditModalComponent();
    this.paginationComponent = new PaginationComponent();
  }

  async initialize(): Promise<void> {
    this.setupEventListeners();
    await this.render();
  }

  private setupEventListeners(): void {
    this.setupFormListeners();
    this.setupSearchAndFilter();
    this.setupPagination();
    this.setupModal();
  }

  private setupFormListeners(): void {
    const todoForm = document.getElementById("todoForm") as HTMLFormElement;
    todoForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleAddTodo(new FormData(todoForm));
      todoForm.reset();
    });
  }

  private setupSearchAndFilter(): void {
    const searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    searchInput?.addEventListener("input", async (e) => {
      this.state.searchQuery = (e.target as HTMLInputElement).value;
      this.state.currentPage = 1;
      await this.render();
    });

    const statusFilter = document.getElementById(
      "statusFilter"
    ) as HTMLSelectElement;
    statusFilter?.addEventListener("change", async (e) => {
      this.state.statusFilter = (e.target as HTMLSelectElement)
        .value as TodoStatus;
      this.state.currentPage = 1;
      await this.render();
    });
  }

  private setupPagination(): void {
    const prevBtn = document.getElementById("prevPage") as HTMLButtonElement;
    prevBtn?.addEventListener("click", async () => {
      if (this.state.currentPage > 1) {
        this.state.currentPage--;
        await this.render();
      }
    });

    const nextBtn = document.getElementById("nextPage") as HTMLButtonElement;
    nextBtn?.addEventListener("click", async () => {
      this.state.currentPage++;
      await this.render();
    });

    const pageSizeSelect = document.getElementById(
      "pageSize"
    ) as HTMLSelectElement;
    pageSizeSelect?.addEventListener("change", async (e) => {
      this.state.pageSize = parseInt((e.target as HTMLSelectElement).value);
      this.state.currentPage = 1;
      await this.render();
    });
  }

  private setupModal(): void {
    this.modalComponent.onSubmit(async (id, formData) => {
      await this.handleEditTodo(id, formData);
      this.modalComponent.hide();
    });
  }

  private async handleAddTodo(formData: FormData): Promise<void> {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDateStr = formData.get("dueDate") as string;

    await this.todoService.add({
      title,
      description,
      dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
    });

    this.state.currentPage = 1;
    await this.render();
  }

  private async handleEditTodo(id: number, formData: FormData): Promise<void> {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDateStr = formData.get("dueDate") as string;

    await this.todoService.update(id, {
      title,
      description,
      dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
    });

    await this.render();
  }

  private async handleEdit(id: number): Promise<void> {
    const todo = await this.todoService.getById(id);
    if (todo) {
      this.modalComponent.show(todo);
    }
  }

  private async handleDelete(id: number): Promise<void> {
    await this.todoService.delete(id);
    await this.render();
  }

  private async handleToggleComplete(id: number): Promise<void> {
    await this.todoService.toggleComplete(id);
    await this.render();
  }

  private async render(): Promise<void> {
    // Get todos
    let todos = await this.getTodos();

    // Apply filters
    todos = this.filterService.filterByStatus(todos, this.state.statusFilter);

    // Categorize
    const categorized = this.filterService.categorize(todos);

    // Pagination
    const maxTodos = Math.max(
      categorized.completed.length,
      categorized.normal.length,
      categorized.overdue.length
    );

    const totalPages = this.paginationComponent.calculateTotalPages(
      maxTodos,
      this.state.pageSize
    );

    // Adjust current page if needed
    if (this.state.currentPage > totalPages) {
      this.state.currentPage = totalPages;
    }

    // Paginate each category
    const paginatedCompleted = this.paginationComponent.paginate(
      categorized.completed,
      this.state.currentPage,
      this.state.pageSize
    );
    const paginatedNormal = this.paginationComponent.paginate(
      categorized.normal,
      this.state.currentPage,
      this.state.pageSize
    );
    const paginatedOverdue = this.paginationComponent.paginate(
      categorized.overdue,
      this.state.currentPage,
      this.state.pageSize
    );

    // Render lists
    const handlers = {
      onEdit: (id: number) => this.handleEdit(id),
      onDelete: (id: number) => this.handleDelete(id),
      onToggleComplete: (id: number) => this.handleToggleComplete(id),
    };

    const completedContainer = document.getElementById(
      "completedTodos"
    ) as HTMLElement;
    const normalContainer = document.getElementById(
      "normalTodos"
    ) as HTMLElement;
    const overdueContainer = document.getElementById(
      "overdueTodos"
    ) as HTMLElement;

    this.listComponent.render(paginatedCompleted, completedContainer, handlers);
    this.listComponent.render(paginatedNormal, normalContainer, handlers);
    this.listComponent.render(paginatedOverdue, overdueContainer, handlers);

    // Update pagination controls
    this.paginationComponent.updateControls(this.state.currentPage, totalPages);
  }

  private async getTodos(): Promise<Todo[]> {
    if (this.state.searchQuery) {
      return await this.todoService.search(this.state.searchQuery);
    }
    return await this.todoService.getAll();
  }
}
