import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemandeDelegue } from '../../models/demande.model';
import { DemandeDelegueFormComponent } from './demande-delegue-form.component';
import { DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-demande-delegue-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
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
        <ng-container matColumnDef="date_demande">
          <th mat-header-cell *matHeaderCellDef> Date Demande </th>
          <td mat-cell *matCellDef="let demande"> {{demande.date_demande}} </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let demande"> {{demande.status}} </td>
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
        <ng-container matColumnDef="delegatedTo">
          <th mat-header-cell *matHeaderCellDef> Délégué à </th>
          <td mat-cell *matCellDef="let demande"> {{demande.delegatedTo?.firstName}} {{demande.delegatedTo?.lastName}} </td>
        </ng-container>
        <ng-container matColumnDef="delegationDate">
          <th mat-header-cell *matHeaderCellDef> Date de Délégation </th>
          <td mat-cell *matCellDef="let demande"> {{demande.delegationDate | date:'dd/MM/yyyy'}} </td>
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
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="demandeDelegueColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: demandeDelegueColumns;"></tr>
      </table>
    </div>
  `
})
export class DemandeDelegueListComponent implements OnInit {
  @Input() demandesDelegue: DemandeDelegue[] = [];
  demandeDelegueColumns: string[] = [
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
    'delegatedTo',
    'delegationDate',
    'actions'
  ];

  constructor(private dialog: MatDialog, private demandeService: DemandeService) {}

  ngOnInit() {}

  openDemandeDelegueForm(demande?: DemandeDelegue) {
    const dialogRef = this.dialog.open(DemandeDelegueFormComponent, {
      width: '700px',
      data: demande || null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Optionally emit event to parent to reload
      }
    });
  }

  editDemandeDelegue(demande: DemandeDelegue) {
    this.openDemandeDelegueForm(demande);
  }

  deleteDemandeDelegue(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande déléguée ?')) {
      this.demandeService.deleteDemandeDelegue(id).subscribe();
    }
  }
}
