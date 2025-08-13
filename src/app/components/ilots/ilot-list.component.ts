import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import { IlotService } from "../../services/ilot.service"
import { Ilot } from "../../models/ilot.model"
import { IlotFormComponent } from "./ilot-form.component"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-ilot-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Îlots</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" (click)="openIlotForm()" *ngIf="canManageIlots()">
            <mat-icon>add</mat-icon>
            Nouvel Îlot
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="ilots" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let ilot">{{ ilot.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let ilot">{{ ilot.name }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let ilot">{{ ilot.description || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Emplacement</th>
              <td mat-cell *matCellDef="let ilot">{{ ilot.location || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let ilot">
                <ng-container *ngIf="canManageIlots()">
                  <button mat-icon-button (click)="editIlot(ilot)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteIlot(ilot.id!)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    mat-card-header {
      display: flex;
      align-items: center;
    }
    table {
      width: 100%;
    }
  `,
  ],
})
export class IlotListComponent implements OnInit {
  ilots: Ilot[] = []
  displayedColumns: string[] = ["id", "name", "description", "location", "actions"]

  constructor(
    private ilotService: IlotService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadIlots()
  }

  loadIlots() {
    this.ilotService.getAllIlots().subscribe({
      next: (ilots) => {
        this.ilots = ilots
      },
      error: (error) => {
        console.error("Error loading ilots:", error)
      },
    })
  }

  openIlotForm(ilot?: Ilot) {
    const dialogRef = this.dialog.open(IlotFormComponent, {
      width: "600px",
      data: ilot || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadIlots()
      }
    })
  }

  editIlot(ilot: Ilot) {
    this.openIlotForm(ilot)
  }

  deleteIlot(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet îlot ?")) {
      this.ilotService.deleteIlot(id).subscribe({
        next: () => {
          this.loadIlots()
        },
        error: (error) => {
          console.error("Error deleting ilot:", error)
        },
      })
    }
  }

  isAdmin(): boolean {
    return this.authService.hasRole("ROLE_ADMIN")
  }

  isManager(): boolean {
    return this.authService.hasRole("ROLE_MANAGER")
  }

  canManageIlots(): boolean {
    // Only Admin and Manager can manage ilots
    return this.isAdmin() || this.isManager()
  }
}
