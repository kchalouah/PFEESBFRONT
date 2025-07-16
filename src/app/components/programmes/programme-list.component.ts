import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import  { ProgrammeService } from "../../services/programme.service"
import { Programme } from "../../models/ilot.model"
import { ProgrammeFormComponent } from "./programme-form.component"
import { MachineService } from "../../services/machine.service"
import { Machine } from "../../models/ilot.model"

@Component({
  selector: "app-programme-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Programmes</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" (click)="openProgrammeForm()">
            <mat-icon>add</mat-icon>
            Nouveau Programme
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="programmes" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let programme">{{ programme.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let programme">{{ programme.name }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let programme">{{ programme.description || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="duration">
              <th mat-header-cell *matHeaderCellDef>Durée (min)</th>
              <td mat-cell *matCellDef="let programme">{{ programme.duration ?? '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="machine">
              <th mat-header-cell *matHeaderCellDef>Machine</th>
              <td mat-cell *matCellDef="let programme">{{ getMachineName(programme) }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let programme">
                <button mat-icon-button (click)="editProgramme(programme)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteProgramme(programme.id!)">
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
  `,
  ],
})
export class ProgrammeListComponent implements OnInit {
  programmes: Programme[] = []
  machines: Machine[] = []
  displayedColumns: string[] = ["id", "name", "description", "duration", "machine", "actions"]

  constructor(
    private programmeService: ProgrammeService,
    private machineService: MachineService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadMachines()
  }

  loadMachines() {
    this.machineService.getAllMachines().subscribe({
      next: (machines) => {
        this.machines = machines
        this.loadProgrammes()
      },
      error: (error) => {
        console.error("Error loading machines:", error)
        this.loadProgrammes()
      },
    })
  }

  loadProgrammes() {
    this.programmeService.getAllProgrammes().subscribe({
      next: (programmes) => {
        this.programmes = programmes
      },
      error: (error) => {
        console.error("Error loading programmes:", error)
      },
    })
  }

  getMachineName(programme: Programme): string {
    if (programme.machine && programme.machine.name) return programme.machine.name
    if (programme.machine && programme.machine.id) {
      const found = this.machines.find(m => m.id === programme.machine?.id)
      return found?.name ?? "-"
    }
    return "-"
  }

  openProgrammeForm(programme?: Programme) {
    const dialogRef = this.dialog.open(ProgrammeFormComponent, {
      width: "600px",
      data: programme || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProgrammes()
      }
    })
  }

  editProgramme(programme: Programme) {
    this.openProgrammeForm(programme)
  }

  deleteProgramme(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      this.programmeService.deleteProgramme(id).subscribe({
        next: () => {
          this.loadProgrammes()
        },
        error: (error) => {
          console.error("Error deleting programme:", error)
        },
      })
    }
  }
}
