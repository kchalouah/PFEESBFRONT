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
import { AuthService } from "../../services/auth.service"
import { ExcelExportService } from '../../services/excel-export.service'

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
    <!-- Your existing template unchanged -->
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Demandes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>

            <!-- Onglet Demandes Générales -->
            <mat-tab label="Demandes Générales">
              <div class="tab-content">
                <button mat-raised-button color="primary" (click)="openDemandeForm()">Ajouter Demande</button>
                <table mat-table [dataSource]="demandes" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
                  </ng-container>

                  <ng-container matColumnDef="of_demande">
                    <th mat-header-cell *matHeaderCellDef> OF Demande </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Statut </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button color="primary" (click)="editDemande(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemande(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <button *ngIf="isAdmin()" mat-button color="accent" (click)="approveDemande(demande.id!)">Approuver</button>
                      <button *ngIf="isAdmin()" mat-button color="warn" (click)="rejectDemande(demande.id!)">Rejeter</button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['id', 'of_demande', 'status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['id', 'of_demande', 'status', 'actions'];"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Onglet Demandes Déléguées -->
            <mat-tab label="Demandes Déléguées">
              <div class="tab-content">
                <button mat-raised-button color="primary" (click)="openDemandeDelegueForm()">Ajouter Demande Déléguée</button>
                <table mat-table [dataSource]="demandesDelegue" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
                  </ng-container>

                  <ng-container matColumnDef="of_demande">
                    <th mat-header-cell *matHeaderCellDef> OF Demande </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
                  </ng-container>

                  <ng-container matColumnDef="delegatedTo">
                    <th mat-header-cell *matHeaderCellDef> Délégué à </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.delegatedTo?.firstName}} {{demande.delegatedTo?.lastName}} </td>
                  </ng-container>

                  <ng-container matColumnDef="delegationDate">
                    <th mat-header-cell *matHeaderCellDef> Date de Délégation </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.delegationDate | date:'dd/MM/yyyy'}} </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Statut </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button color="primary" (click)="editDemandeDelegue(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeDelegue(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <button *ngIf="isAdmin()" mat-button color="accent" (click)="approveDemande(demande.id!)">Approuver</button>
                      <button *ngIf="isAdmin()" mat-button color="warn" (click)="rejectDemande(demande.id!)">Rejeter</button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['id', 'of_demande', 'delegatedTo', 'delegationDate', 'status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['id', 'of_demande', 'delegatedTo', 'delegationDate', 'status', 'actions'];"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Onglet Demandes Finales -->
            <mat-tab label="Demandes Finales">
              <div class="tab-content">
                <button mat-raised-button color="primary" (click)="openDemandeFinaleForm()">Ajouter Demande Finale</button>
                <table mat-table [dataSource]="demandesFinale" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
                  </ng-container>

                  <ng-container matColumnDef="of_demande">
                    <th mat-header-cell *matHeaderCellDef> OF Demande </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
                  </ng-container>

                  <ng-container matColumnDef="finalDecision">
                    <th mat-header-cell *matHeaderCellDef> Décision Finale </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.finalDecision}} </td>
                  </ng-container>

                  <ng-container matColumnDef="approvedDate">
                    <th mat-header-cell *matHeaderCellDef> Date d'Approbation </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.approvedDate | date:'dd/MM/yyyy'}} </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Statut </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button color="primary" (click)="editDemandeFinale(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeFinale(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <button *ngIf="isAdmin()" mat-button color="accent" (click)="approveDemande(demande.id!)">Approuver</button>
                      <button *ngIf="isAdmin()" mat-button color="warn" (click)="rejectDemande(demande.id!)">Rejeter</button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['id', 'of_demande', 'finalDecision', 'approvedDate', 'status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['id', 'of_demande', 'finalDecision', 'approvedDate', 'status', 'actions'];"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Onglet Demandes TE -->
            <mat-tab label="Demandes TE">
              <div class="tab-content">
                <button mat-raised-button color="primary" (click)="openDemandeTeForm()">Ajouter Demande TE</button>
                <table mat-table [dataSource]="demandesTe" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
                  </ng-container>

                  <ng-container matColumnDef="of_demande">
                    <th mat-header-cell *matHeaderCellDef> OF Demande </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
                  </ng-container>

                  <ng-container matColumnDef="teSpecificField">
                    <th mat-header-cell *matHeaderCellDef> Champ TE </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.teSpecificField}} </td>
                  </ng-container>

                  <ng-container matColumnDef="teStatus">
                    <th mat-header-cell *matHeaderCellDef> Statut TE </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.teStatus}} </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Statut </th>
                    <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let demande">
                      <button mat-icon-button color="primary" (click)="editDemandeTe(demande)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteDemandeTe(demande.id!)">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <button *ngIf="isAdmin()" mat-button color="accent" (click)="approveDemande(demande.id!)">Approuver</button>
                      <button *ngIf="isAdmin()" mat-button color="warn" (click)="rejectDemande(demande.id!)">Rejeter</button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['id', 'of_demande', 'teSpecificField', 'teStatus', 'status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['id', 'of_demande', 'teSpecificField', 'teStatus', 'status', 'actions'];"></tr>
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
        display: flex;
        gap: 15px;
        align-items: center;
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

  currentUser: any | null = null

  constructor(
    private demandeService: DemandeService,
    private dialog: MatDialog,
    private authService: AuthService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit() {
    // Subscribe to current user from auth service
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user
    })

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

  approveDemande(id: number) {
    const managerId = this.currentUser?.id
    if (!managerId) {
      console.error("Manager id not found for approval")
      return
    }
    this.demandeService.approveDemande(id, managerId).subscribe(() => this.loadAllDemandes())
  }

  rejectDemande(id: number) {
    const managerId = this.currentUser?.id
    if (!managerId) {
      console.error("Manager id not found for rejection")
      return
    }
    this.demandeService.rejectDemande(id, managerId).subscribe(() => this.loadAllDemandes())
  }

  isAdmin(): boolean {
    return this.authService.hasRole("ADMIN")
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





// Replace your export function with
exportDemandesToExcel(type: string) {
  switch(type) {
    case 'generale':
      this.excelExportService.exportDemandesToExcel(this.demandes, 'Demandes_Generales')
      break
    case 'delegue':
      this.excelExportService.exportDemandesToExcel(this.demandesDelegue, 'Demandes_Deleguees')
      break
    case 'finale':
      this.excelExportService.exportDemandesToExcel(this.demandesFinale, 'Demandes_Finales')
      break
    case 'te':
      this.excelExportService.exportDemandesToExcel(this.demandesTe, 'Demandes_TE')
      break
  }
} }

