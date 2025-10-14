/**
 * Pagination Component
 * Single Responsibility: Pagination controls and logic
 */
export class PaginationComponent {
  updateControls(currentPage: number, totalPages: number): void {
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

  paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

  calculateTotalPages(totalItems: number, pageSize: number): number {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }
}
