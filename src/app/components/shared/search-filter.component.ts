import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"

export interface FilterOption {
  value: string
  label: string
}

@Component({
  selector: "app-search-filter",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="search-filter-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Rechercher</mat-label>
        <input matInput 
               [(ngModel)]="searchTerm" 
               (ngModelChange)="onSearchChange()"
               [placeholder]="placeholder">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field" *ngIf="filterOptions.length > 0">
        <mat-label>Filtrer par</mat-label>
        <mat-select [(ngModel)]="selectedFilter" (ngModelChange)="onFilterChange()">
          <mat-option value="">Tous</mat-option>
          <mat-option *ngFor="let option of filterOptions" [value]="option.value">
            {{ option.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-icon-button (click)="clearFilters()" *ngIf="searchTerm || selectedFilter">
        <mat-icon>clear</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
    .search-filter-container {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .search-field {
      flex: 1;
      min-width: 200px;
    }
    .filter-field {
      min-width: 150px;
    }
  `,
  ],
})
export class SearchFilterComponent {
  @Input() placeholder = "Rechercher..."
  @Input() filterOptions: FilterOption[] = []
  @Output() searchChange = new EventEmitter<string>()
  @Output() filterChange = new EventEmitter<string>()

  searchTerm = ""
  selectedFilter = ""

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm)
  }

  onFilterChange(): void {
    this.filterChange.emit(this.selectedFilter)
  }

  clearFilters(): void {
    this.searchTerm = ""
    this.selectedFilter = ""
    this.searchChange.emit("")
    this.filterChange.emit("")
  }
}
