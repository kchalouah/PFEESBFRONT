import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemandeFinale } from '../../models/demande.model';
import { DemandeFinaleFormComponent } from './demande-finale-form.component';
import { DemandeService } from '../../services/demande.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-demande-finale-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, DatePipe, MatSortModule],
  styles: [`
    .tab-content {
      padding: 16px;
    }
    table {
      width: 100%;
      margin-top: 16px;
    }
    .status-waiting, .decision-waiting {
      color: #ff9800;
      font-weight: 500;
    }
    .status-in-progress {
      color: #2196f3;
      font-weight: 500;
    }
    .status-completed, .decision-approved {
      color: #4caf50;
      font-weight: 500;
    }
    .status-cancelled, .decision-rejected {
      color: #f44336;
      font-weight: 500;
    }
    .decision-postponed {
      color: #9c27b0;
      font-weight: 500;
    }
  `],
  template: `
    <div class="tab-content">
      <button mat-raised-button color="primary" (click)="openDemandeFinaleForm()">Ajouter Demande Finale</button>
      <table mat-table [dataSource]="demandesFinale" matSort (matSortChange)="sortData($event)" class="mat-elevation-z8">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
          <td mat-cell *matCellDef="let demande"> {{demande.id}} </td>
        </ng-container>
        <ng-container matColumnDef="of_demande">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> OF Demande </th>
          <td mat-cell *matCellDef="let demande"> {{demande.of_demande}} </td>
        </ng-container>
        <ng-container matColumnDef="date_demande">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Date Demande </th>
          <td mat-cell *matCellDef="let demande"> {{demande.date_demande | date:'dd/MM/yyyy'}} </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Statut </th>
          <td mat-cell *matCellDef="let demande">
            <span [ngClass]="getStatusClass(demande.status)">
              {{getStatusLabel(demande.status)}}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="duree_en_minutes">
          <th mat-header-cell *matHeaderCellDef> Durée (min) </th>
          <td mat-cell *matCellDef="let demande"> {{demande.duree_en_minutes}} </td>
        </ng-container>
        <ng-container matColumnDef="etq">
          <th mat-header-cell *matHeaderCellDef> ETQ </th>
          <td mat-cell *matCellDef="let demande"> {{demande.etq}} </td>
        </ng-container>
        <ng-container matColumnDef="started">
          <th mat-header-cell *matHeaderCellDef> Démarrée </th>
          <td mat-cell *matCellDef="let demande"> {{demande.started ? 'Oui' : 'Non'}} </td>
        </ng-container>
        <ng-container matColumnDef="finished">
          <th mat-header-cell *matHeaderCellDef> Terminée </th>
          <td mat-cell *matCellDef="let demande"> {{demande.finished ? 'Oui' : 'Non'}} </td>
        </ng-container>
        <ng-container matColumnDef="nombre_produit_controle">
          <th mat-header-cell *matHeaderCellDef> Nb Produit Contrôlé </th>
          <td mat-cell *matCellDef="let demande"> {{demande.nombre_produit_controle}} </td>
        </ng-container>
        <ng-container matColumnDef="ilot">
          <th mat-header-cell *matHeaderCellDef> Ilot </th>
          <td mat-cell *matCellDef="let demande"> {{demande.ilot?.name}} </td>
        </ng-container>
        <ng-container matColumnDef="machine">
          <th mat-header-cell *matHeaderCellDef> Machine </th>
          <td mat-cell *matCellDef="let demande"> {{demande.machine?.name}} </td>
        </ng-container>
        <ng-container matColumnDef="operateur">
          <th mat-header-cell *matHeaderCellDef> Opérateur </th>
          <td mat-cell *matCellDef="let demande">
            {{demande.operateur?.firstName}} {{demande.operateur?.lastName}}
          </td>
        </ng-container>
        <ng-container matColumnDef="controleur">
          <th mat-header-cell *matHeaderCellDef> Contrôleur </th>
          <td mat-cell *matCellDef="let demande">
            {{demande.controleur?.firstName}} {{demande.controleur?.lastName}}
          </td>
        </ng-container>
        <ng-container matColumnDef="finalDecision">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Décision Finale </th>
          <td mat-cell *matCellDef="let demande">
            <span [ngClass]="getDecisionClass(demande.finalDecision)">
              {{getDecisionLabel(demande.finalDecision)}}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="approvedDate">
          <th mat-header-cell *matHeaderCellDef> Date d'Approbation </th>
          <td mat-cell *matCellDef="let demande"> {{demande.approvedDate | date:'dd/MM/yyyy'}} </td>
        </ng-container>
        <ng-container matColumnDef="manager">
          <th mat-header-cell *matHeaderCellDef> Manager </th>
          <td mat-cell *matCellDef="let demande">
            {{demande.manager?.firstName}} {{demande.manager?.lastName}}
          </td>
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
            <ng-container *ngIf="canApproveDemande()">
              <button mat-button color="primary" (click)="approveDemande(demande.id!)"
                      [disabled]="demande.finalDecision === 'APPROUVE'">
                Approuver
              </button>
              <button mat-button color="warn" (click)="rejectDemande(demande.id!)"
                      [disabled]="demande.finalDecision === 'REJETE'">
                Rejeter
              </button>
            </ng-container>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="demandeFinaleColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: demandeFinaleColumns;"></tr>
      </table>
    </div>
  `
})
export class DemandeFinaleListComponent implements OnInit {
  @Input() demandesFinale: DemandeFinale[] = [];
  @Output() demandeFinaleChanged = new EventEmitter<boolean>();
  private sortedData: DemandeFinale[] = [];
  demandeFinaleColumns: string[] = [
    'id',
    'of_demande',
    'date_demande',
    'status',
    'duree_en_minutes',
    'etq',
    'started',
    'finished',
    'nombre_produit_controle',
    'ilot',
    'machine',
    'operateur',
    'controleur',
    'finalDecision',
    'approvedDate',
    'manager',
    'actions'
  ];

  constructor(
    private dialog: MatDialog,
    private demandeService: DemandeService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  openDemandeFinaleForm(demande?: DemandeFinale) {
    const dialogRef = this.dialog.open(DemandeFinaleFormComponent, {
      width: '700px',
      data: demande || null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Emit event to parent to reload
        this.demandeFinaleChanged.emit(true);
      }
    });
  }

  editDemandeFinale(demande: DemandeFinale) {
    this.openDemandeFinaleForm(demande);
  }

  deleteDemandeFinale(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande finale ?')) {
      this.demandeService.deleteDemandeFinale(id).subscribe({
        next: () => {
          // Emit event to parent to reload
          this.demandeFinaleChanged.emit(true);
        },
        error: (error) => console.error('Error deleting demande finale:', error)
      });
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    switch (status) {
      case 'EN_ATTENTE': return 'status-waiting';
      case 'EN_COURS': return 'status-in-progress';
      case 'TERMINE': return 'status-completed';
      case 'ANNULE': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Non défini';
    switch (status) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'ANNULE': return 'Annulé';
      default: return status;
    }
  }

  getDecisionClass(decision: string | undefined): string {
    if (!decision) return '';
    switch (decision) {
      case 'APPROUVE': return 'decision-approved';
      case 'REJETE': return 'decision-rejected';
      case 'EN_ATTENTE_APPROBATION': return 'decision-waiting';
      case 'REPORTE': return 'decision-postponed';
      default: return '';
    }
  }

  getDecisionLabel(decision: string | undefined): string {
    if (!decision) return 'Non défini';
    switch (decision) {
      case 'APPROUVE': return 'Approuvé';
      case 'REJETE': return 'Rejeté';
      case 'EN_ATTENTE_APPROBATION': return 'En attente d\'approbation';
      case 'REPORTE': return 'Reporté';
      default: return decision;
    }
  }

  sortData(sort: Sort) {
    const data = [...this.demandesFinale];
    if (!sort.active || sort.direction === '') {
      this.demandesFinale = data;
      return;
    }

    this.demandesFinale = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'of_demande': return this.compare(a.of_demande, b.of_demande, isAsc);
        case 'date_demande': return this.compare(a.date_demande, b.date_demande, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'finalDecision': return this.compare(a.finalDecision, b.finalDecision, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean) {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return isAsc ? -1 : 1;
    if (b === undefined) return isAsc ? 1 : -1;
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Role-based access control methods
  isAdmin(): boolean {
    return this.authService.hasRole("ROLE_ADMIN");
  }

  isManager(): boolean {
    return this.authService.hasRole("ROLE_MANAGER");
  }

  canApproveDemande(): boolean {
    // Only Admin and Manager can approve/reject demandes
    return this.isAdmin() || this.isManager();
  }

  // Approve and reject methods
  approveDemande(id: number) {
    this.authService.currentUser$.subscribe(user => {
      if (!user || !user.id) {
        console.error("Manager id not found for approval");
        return;
      }
      this.demandeService.approveDemande(id, user.id).subscribe({
        next: () => {
          this.demandeFinaleChanged.emit(true);
        },
        error: (error) => console.error("Error approving demande:", error)
      });
    });
  }

  rejectDemande(id: number) {
    this.authService.currentUser$.subscribe(user => {
      if (!user || !user.id) {
        console.error("Manager id not found for rejection");
        return;
      }
      this.demandeService.rejectDemande(id, user.id).subscribe({
        next: () => {
          this.demandeFinaleChanged.emit(true);
        },
        error: (error) => console.error("Error rejecting demande:", error)
      });
    });
  }
}
