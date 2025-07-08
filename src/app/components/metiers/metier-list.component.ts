import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import { MetierService } from "../../services/metier.service"
import { Metier } from "../../models/metier.model"
import { MetierFormComponent } from "./metier-form.component"

@Component({
  selector: "app-metier-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Métiers</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" (click)="openMetierForm()">
            <mat-icon>add</mat-icon>
            Nouveau Métier
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="metiers" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let metier">{{ metier.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let metier">{{ metier.name }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let metier">{{ metier.description }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Catégorie</th>
              <td mat-cell *matCellDef="let metier">{{ metier.category }}</td>
            </ng-container>

            <ng-container matColumnDef="requiredSkills">
              <th mat-header-cell *matHeaderCellDef>Compétences</th>
              <td mat-cell *matCellDef="let metier">
                <mat-chip-set *ngIf="metier.requiredSkills && metier.requiredSkills.length > 0">
                  <mat-chip *ngFor="let skill of metier.requiredSkills.slice(0, 2)">
                    {{ skill }}
                  </mat-chip>
                  <mat-chip *ngIf="metier.requiredSkills.length > 2">
                    +{{ metier.requiredSkills.length - 2 }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let metier">
                <button mat-icon-button (click)="editMetier(metier)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMetier(metier.id!)">
                  <mat-icon>delete</mat-icon>
                </button>
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
    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  `,
  ],
})
export class MetierListComponent implements OnInit {
  metiers: Metier[] = []
  displayedColumns: string[] = ["id", "name", "description", "category", "requiredSkills", "actions"]

  constructor(
    private metierService: MetierService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadMetiers()
  }

  loadMetiers() {
    this.metierService.getAllMetiers().subscribe({
      next: (metiers) => {
        this.metiers = metiers
      },
      error: (error) => {
        console.error("Error loading metiers:", error)
      },
    })
  }

  openMetierForm(metier?: Metier) {
    const dialogRef = this.dialog.open(MetierFormComponent, {
      width: "600px",
      data: metier || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMetiers()
      }
    })
  }

  editMetier(metier: Metier) {
    this.openMetierForm(metier)
  }

  deleteMetier(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce métier ?")) {
      this.metierService.deleteMetier(id).subscribe({
        next: () => {
          this.loadMetiers()
        },
        error: (error) => {
          console.error("Error deleting metier:", error)
        },
      })
    }
  }
}
