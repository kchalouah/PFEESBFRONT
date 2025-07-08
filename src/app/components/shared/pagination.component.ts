import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator"

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalItems"
      [pageSize]="pageSize"
      [pageIndex]="currentPage"
      [pageSizeOptions]="pageSizeOptions"
      [showFirstLastButtons]="true"
      (page)="onPageChange($event)"
      class="pagination-container">
    </mat-paginator>
  `,
  styles: [
    `
    .pagination-container {
      margin-top: 20px;
      background: white;
      border-radius: 4px;
    }
  `,
  ],
})
export class PaginationComponent {
  @Input() totalItems = 0
  @Input() pageSize = 10
  @Input() currentPage = 0
  @Input() pageSizeOptions = [5, 10, 25, 50]
  @Output() pageChange = new EventEmitter<PageEvent>()

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event)
  }
}
