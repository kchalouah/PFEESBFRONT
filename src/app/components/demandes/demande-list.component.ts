import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import { MatTabsModule } from "@angular/material/tabs"
import { DemandeService } from "../../services/demande.service"
import { Demande, DemandeDelegue, DemandeFinale, DemandeTe } from "../../models/demande.model"
import { DemandeFormComponent } from "./demande-form.component"
import { DemandeFinaleFormComponent } from "./demande-finale-form.component"
import { DemandeDelegueFormComponent } from "./demande-delegue-form.component"
import { DemandeTeFormComponent } from "./demande-te-form.component"

@Component({
  selector: "app-demande-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Demandes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <!-- Demandes Générales -->
            <mat-tab label="Demandes Générales">
              <div class="tab-content">
                <div class="tab-header">
                  <button mat-raised-button color="primary" (click)="openDemandeForm()">
                    <mat-icon>add</mat-icon>
                    Nouvelle Demande
                  </button>
                </div>
                <table mat-table [dataSource]="demandes" class="mat-elevation-z8">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let demande">
                      <mat-chip [color]="getStatusColor(demande.status)">
                        {{ demande.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="priority">
                    <th mat-header-cell *matHeaderCellDef>Priorité</th>
                    <td mat-cell *matCellDef="let demande">
                      <mat-chip [color]="getPriorityColor(demande.priority)">
                        {{ demande.priority }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button (click)="editDemande(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemande(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="demandeColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: demandeColumns;"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Demandes Déléguées -->
            <mat-tab label="Demandes Déléguées">
              <div class="tab-content">
                <div class="tab-header">
                  <button mat-raised-button color="primary" (click)="openDemandeDelegueForm()">
                    <mat-icon>add</mat-icon>
                    Nouvelle Demande Déléguée
                  </button>
                </div>
                <table mat-table [dataSource]="demandesDelegue" class="mat-elevation-z8">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="delegatedTo">
                    <th mat-header-cell *matHeaderCellDef>Délégué à</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.delegatedUser?.firstName }} {{ demande.delegatedUser?.lastName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="delegationDate">
                    <th mat-header-cell *matHeaderCellDef>Date de délégation</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.delegationDate | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let demande">
                      <mat-chip [color]="getStatusColor(demande.status)">
                        {{ demande.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button (click)="editDemandeDelegue(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeDelegue(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="demandeDelegueColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: demandeDelegueColumns;"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Demandes Finales -->
            <mat-tab label="Demandes Finales">
              <div class="tab-content">
                <div class="tab-header">
                  <button mat-raised-button color="primary" (click)="openDemandeFinaleForm()">
                    <mat-icon>add</mat-icon>
                    Nouvelle Demande Finale
                  </button>
                </div>
                <table mat-table [dataSource]="demandesFinale" class="mat-elevation-z8">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="finalDecision">
                    <th mat-header-cell *matHeaderCellDef>Décision finale</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.finalDecision }}</td>
                  </ng-container>

                  <ng-container matColumnDef="finalDate">
                    <th mat-header-cell *matHeaderCellDef>Date finale</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.finalDate | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let demande">
                      <mat-chip [color]="getStatusColor(demande.status)">
                        {{ demande.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button (click)="editDemandeFinale(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeFinale(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="demandeFinaleColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: demandeFinaleColumns;"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Demandes TE -->
            <mat-tab label="Demandes TE">
              <div class="tab-content">
                <div class="tab-header">
                  <button mat-raised-button color="primary" (click)="openDemandeTeForm()">
                    <mat-icon>add</mat-icon>
                    Nouvelle Demande TE
                  </button>
                </div>
                <table mat-table [dataSource]="demandesTe" class="mat-elevation-z8">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="teSpecificField">
                    <th mat-header-cell *matHeaderCellDef>Champ TE</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.teSpecificField }}</td>
                  </ng-container>

                  <ng-container matColumnDef="teStatus">
                    <th mat-header-cell *matHeaderCellDef>Statut TE</th>
                    <td mat-cell *matCellDef="let demande">{{ demande.teStatus }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let demande">
                      <mat-chip [color]="getStatusColor(demande.status)">
                        {{ demande.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button (click)="editDemandeTe(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeTe(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="demandeTeColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: demandeTeColumns;"></tr>
                </table>
              </div>
            </mat-tab>
          </mat-tab-group>
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
      margin-top: 20px;
    }
    .tab-content {
      padding: 20px 0;
    }
    .tab-header {
      margin-bottom: 20px;
    }
  `,
  ],
})
export class DemandeListComponent implements OnInit {
  demandes: Demande[] = []
  demandesDelegue: DemandeDelegue[] = []
  demandesFinale: DemandeFinale[] = []
  demandesTe: DemandeTe[] = []

  demandeColumns: string[] = ["id", "title", "status", "priority", "actions"]
  demandeDelegueColumns: string[] = ["id", "title", "delegatedTo", "delegationDate", "status", "actions"]
  demandeFinaleColumns: string[] = ["id", "title", "finalDecision", "finalDate", "status", "actions"]
  demandeTeColumns: string[] = ["id", "title", "teSpecificField", "teStatus", "status", "actions"]

  constructor(
    private demandeService: DemandeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadAllDemandes()
  }

  loadAllDemandes() {
    this.loadDemandes()
    this.loadDemandesDelegue()
    this.loadDemandesFinale()
    this.loadDemandesTe()
  }

  loadDemandes() {
    this.demandeService.getAllDemandes().subscribe({
      next: (demandes) => {
        this.demandes = demandes
      },
      error: (error) => {
        console.error("Error loading demandes:", error)
      },
    })
  }

  loadDemandesDelegue() {
    this.demandeService.getAllDemandesDelegue().subscribe({
      next: (demandes) => {
        this.demandesDelegue = demandes
      },
      error: (error) => {
        console.error("Error loading demandes delegue:", error)
      },
    })
  }

  loadDemandesFinale() {
    this.demandeService.getAllDemandesFinale().subscribe({
      next: (demandes) => {
        this.demandesFinale = demandes
      },
      error: (error) => {
        console.error("Error loading demandes finale:", error)
      },
    })
  }

  loadDemandesTe() {
    this.demandeService.getAllDemandesTe().subscribe({
      next: (demandes) => {
        this.demandesTe = demandes
      },
      error: (error) => {
        console.error("Error loading demandes te:", error)
      },
    })
  }

  // Demandes Générales
  openDemandeForm(demande?: Demande) {
    const dialogRef = this.dialog.open(DemandeFormComponent, {
      width: "700px",
      data: demande || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDemandes()
      }
    })
  }

  editDemande(demande: Demande) {
    this.openDemandeForm(demande)
  }

  deleteDemande(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => {
          this.loadDemandes()
        },
        error: (error) => {
          console.error("Error deleting demande:", error)
        },
      })
    }
  }

  // Demandes Déléguées
  openDemandeDelegueForm(demande?: DemandeDelegue) {
    const dialogRef = this.dialog.open(DemandeDelegueFormComponent, {
      width: "700px",
      data: demande || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDemandesDelegue()
      }
    })
  }

  editDemandeDelegue(demande: DemandeDelegue) {
    this.openDemandeDelegueForm(demande)
  }

  deleteDemandeDelegue(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande déléguée ?")) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => {
          this.loadDemandesDelegue()
        },
        error: (error) => {
          console.error("Error deleting demande delegue:", error)
        },
      })
    }
  }

  // Demandes Finales
  openDemandeFinaleForm(demande?: DemandeFinale) {
    const dialogRef = this.dialog.open(DemandeFinaleFormComponent, {
      width: "700px",
      data: demande || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDemandesFinale()
      }
    })
  }

  editDemandeFinale(demande: DemandeFinale) {
    this.openDemandeFinaleForm(demande)
  }

  deleteDemandeFinale(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande finale ?")) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => {
          this.loadDemandesFinale()
        },
        error: (error) => {
          console.error("Error deleting demande finale:", error)
        },
      })
    }
  }

  // Demandes TE
  openDemandeTeForm(demande?: DemandeTe) {
    const dialogRef = this.dialog.open(DemandeTeFormComponent, {
      width: "700px",
      data: demande || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDemandesTe()
      }
    })
  }

  editDemandeTe(demande: DemandeTe) {
    this.openDemandeTeForm(demande)
  }

  deleteDemandeTe(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande TE ?")) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => {
          this.loadDemandesTe()
        },
        error: (error) => {
          console.error("Error deleting demande te:", error)
        },
      })
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case "en_cours":
        return "primary"
      case "termine":
        return "accent"
      case "annule":
        return "warn"
      default:
        return ""
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case "haute":
        return "warn"
      case "moyenne":
        return "primary"
      case "basse":
        return "accent"
      default:
        return ""
    }
  }
}
