import type { Todo } from "../types/todo";

/**
 * Edit Modal Component
 * Single Responsibility: Managing the edit modal
 */
export class EditModalComponent {
  private modal: HTMLElement | null;
  private form: HTMLFormElement | null;
  private closeBtn: HTMLElement | null;

  constructor() {
    this.modal = document.getElementById("editModal");
    this.form = document.getElementById("editForm") as HTMLFormElement;
    this.closeBtn = document.querySelector(".close");
    this.setupEventListeners();
  }

  show(todo: Todo): void {
    if (!this.modal) return;

    this.populateForm(todo);
    this.modal.style.display = "block";
  }

  hide(): void {
    if (!this.modal) return;
    this.modal.style.display = "none";
  }

  onSubmit(callback: (id: number, data: FormData) => void): void {
    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.form!);
      const id = parseInt(
        (document.getElementById("editId") as HTMLInputElement).value
      );
      callback(id, formData);
    });
  }

  private populateForm(todo: Todo): void {
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
        ? this.formatDateForInput(todo.dueDate)
        : "";
    }
  }

  private setupEventListeners(): void {
    // Close button
    this.closeBtn?.addEventListener("click", () => this.hide());

    // Click outside modal
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split("T")[0];
  }
}
