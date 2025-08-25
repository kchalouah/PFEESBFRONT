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
import { DemandeGeneraleListComponent } from './demande-generale-list.component';
import { DemandeDelegueListComponent } from './demande-delegue-list.component';
import { DemandeTeListComponent } from './demande-te-list.component';
import { DemandeFinaleListComponent } from './demande-finale-list.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';

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
    DemandeGeneraleListComponent,
    DemandeDelegueListComponent,
    DemandeTeListComponent,
    DemandeFinaleListComponent,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Demandes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Demandes Générales">
              <div class="tab-header">
                <button mat-raised-button color="primary" (click)="exportDemandesToExcel('generale')">
                  Exporter Excel
                </button>
              </div>
              <app-demande-generale-list [demandes]="demandes"></app-demande-generale-list>
            </mat-tab>
            <mat-tab label="Demandes Déléguées">
              <div class="tab-header">
                <button mat-raised-button color="primary" (click)="exportDemandesToExcel('delegue')">
                  Exporter Excel
                </button>
              </div>
              <app-demande-delegue-list [demandesDelegue]="demandesDelegue"></app-demande-delegue-list>
            </mat-tab>
            <mat-tab label="Demandes Finales">
              <div class="tab-header">
                <button mat-raised-button color="primary" (click)="exportDemandesToExcel('finale')">
                  Exporter Excel
                </button>
                <button mat-raised-button color="accent" (click)="openDemandeFinaleForm()" *ngIf="canAddDemande()">
                  Ajouter Demande Finale
                </button>
              </div>
              <!-- Table with approve/reject buttons for demandes finales -->
              <!-- Commented out the direct table implementation as we're using the component below
              <table mat-table [dataSource]="demandesFinale" class="mat-elevation-z8">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef> ID </th>
                  <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
                </ng-container>
                <ng-container matColumnDef="of_demande">
                  <th mat-header-cell *matHeaderCellDef> OF </th>
                  <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
                </ng-container>
                <ng-container matColumnDef="date_demande">
                  <th mat-header-cell *matHeaderCellDef> Date </th>
                  <td mat-cell *matCellDef="let demande"> {{demande.date_demande}} </td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef> Statut </th>
                  <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
                </ng-container>
                <ng-container matColumnDef="finalDecision">
                  <th mat-header-cell *matHeaderCellDef> Décision finale </th>
                  <td mat-cell *matCellDef="let demande"> {{demande.finalDecision || '-' }} </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> Actions </th>
                  <td mat-cell *matCellDef="let demande">
                    <ng-container *ngIf="canApproveDemande()">
                      <button mat-button color="primary" (click)="approveDemande(demande.id)" [disabled]="demande.finalDecision === 'Approuvée'">Approuver</button>
                      <button mat-button color="warn" (click)="rejectDemande(demande.id)" [disabled]="demande.finalDecision === 'Rejetée'">Rejeter</button>
                    </ng-container>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['id', 'of_demande', 'date_demande', 'status', 'finalDecision', 'actions']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['id', 'of_demande', 'date_demande', 'status', 'finalDecision', 'actions'];"></tr>
              </table>
              -->
              <app-demande-finale-list [demandesFinale]="demandesFinale" (demandeFinaleChanged)="loadDemandesFinale()"></app-demande-finale-list>
            </mat-tab>
            <mat-tab label="Demandes TE">
              <div class="tab-header">
                <button mat-raised-button color="primary" (click)="exportDemandesToExcel('te')">
                  Exporter Excel
                </button>
              </div>
              <app-demande-te-list [demandesTe]="demandesTe"></app-demande-te-list>
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
  demandes: Demande[] = [];
  demandesDelegue: DemandeDelegue[] = [];
  demandesFinale: DemandeFinale[] = [];
  demandesTe: DemandeTe[] = [];

  demandeColumns: string[] = [
    "id",
    "of_demande",
    "date_demande",
    "status",
    "duree_en_minutes",
    "etq",
    "started",
    "finished",
    "nombre_produit_controle",
    "operateur",
    "controleur",
    "actions"
  ]
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
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user
    })
    this.loadAllDemandes();
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
    this.demandeService.approveDemande(id, managerId).subscribe({
      next: () => this.loadDemandesFinale(),
      error: (error) => console.error("Error approving demande:", error)
    });
  }

  rejectDemande(id: number) {
    const managerId = this.currentUser?.id
    if (!managerId) {
      console.error("Manager id not found for rejection")
      return
    }
    this.demandeService.rejectDemande(id, managerId).subscribe({
      next: () => this.loadDemandesFinale(),
      error: (error) => console.error("Error rejecting demande:", error)
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole("ROLE_ADMIN")
  }

  isManager(): boolean {
    return this.authService.hasRole("ROLE_MANAGER")
  }

  isControleur(): boolean {
    return this.authService.hasRole("ROLE_CONTROLEUR")
  }

  isOperateur(): boolean {
    return this.authService.hasRole("ROLE_OPERATEUR")
  }

  canAddDemande(): boolean {
    // Admin, Manager, and Controleur can add demandes
    return this.isAdmin() || this.isManager() || this.isControleur()
  }

  canApproveDemande(): boolean {
    // Only Admin and Manager can approve/reject demandes
    return this.isAdmin() || this.isManager()
  }

  canModifyDemande(): boolean {
    // Admin, Manager, and Operateur can modify demandes
    return this.isAdmin() || this.isManager() || this.isOperateur()
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
  }}

// NOTE: If your child components (DemandeGeneraleListComponent, etc.) have their own ngOnInit or data loading logic,
// make sure they do NOT call any service methods or overwrite the @Input() data when using mock data.
// Only use the @Input() data passed from this parent component.
