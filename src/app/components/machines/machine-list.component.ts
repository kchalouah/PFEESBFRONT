import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import { MachineService } from "../../services/machine.service"
import { Machine } from "../../models/ilot.model"
import { MachineFormComponent } from "./machine-form.component"

@Component({
  selector: "app-machine-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Machines</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" (click)="openMachineForm()">
            <mat-icon>add</mat-icon>
            Nouvelle Machine
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="machines" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let machine">{{ machine.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let machine">{{ machine.name }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let machine">{{ machine.type }}</td>
            </ng-container>

            <ng-container matColumnDef="model">
              <th mat-header-cell *matHeaderCellDef>Modèle</th>
              <td mat-cell *matCellDef="let machine">{{ machine.model }}</td>
            </ng-container>

            <ng-container matColumnDef="ilot">
              <th mat-header-cell *matHeaderCellDef>Îlot</th>
              <td mat-cell *matCellDef="let machine">{{ machine.ilot?.name }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let machine">
                <button mat-icon-button (click)="editMachine(machine)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMachine(machine.id!)">
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
export class MachineListComponent implements OnInit {
  machines: Machine[] = []
  displayedColumns: string[] = ["id", "name", "type", "model", "ilot", "actions"]

  constructor(
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
      },
      error: (error) => {
        console.error("Error loading machines:", error)
      },
    })
  }

  openMachineForm(machine?: Machine) {
    const dialogRef = this.dialog.open(MachineFormComponent, {
      width: "600px",
      data: machine || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMachines()
      }
    })
  }

  editMachine(machine: Machine) {
    this.openMachineForm(machine)
  }

  deleteMachine(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette machine ?")) {
      this.machineService.deleteMachine(id).subscribe({
        next: () => {
          this.loadMachines()
        },
        error: (error) => {
          console.error("Error deleting machine:", error)
        },
      })
    }
  }
}
