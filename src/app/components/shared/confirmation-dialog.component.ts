import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

export interface ConfirmationData {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header" [ngClass]="data.type || 'warning'">
        <mat-icon class="dialog-icon">
          {{ getIcon() }}
        </mat-icon>
        <h2>{{ data.title }}</h2>
      </div>

      <div class="dialog-content">
        <p>{{ data.message }}</p>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Annuler' }}
        </button>
        <button mat-raised-button
                [color]="getButtonColor()"
                (click)="onConfirm()">
          {{ data.confirmText || 'Confirmer' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .confirmation-dialog {
      padding: 0;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 4px 4px 0 0;
    }
    .dialog-header.warning {
      background-color: #fff3cd;
      color: #856404;
    }
    .dialog-header.danger {
      background-color: #f8d7da;
      color: #721c24;
    }
    .dialog-header.info {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    .dialog-icon {
      margin-right: 12px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .dialog-content {
      padding: 20px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid #e0e0e0;
    }
  `,
  ],
})
export class ConfirmationDialogComponent {
  data: ConfirmationData
  dialogRef: MatDialogRef<ConfirmationDialogComponent>

  constructor(
    dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ConfirmationData
  ) {
    this.dialogRef = dialogRef
    this.data = data
  }

  getIcon(): string {
    switch (this.data.type) {
      case "danger":
        return "warning"
      case "info":
        return "info"
      default:
        return "help_outline"
    }
  }

  getButtonColor(): string {
    return this.data.type === "danger" ? "warn" : "primary"
  }

  onConfirm(): void {
    this.dialogRef.close(true)
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }
}
