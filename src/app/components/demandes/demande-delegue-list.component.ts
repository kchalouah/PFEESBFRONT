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
    'delegatedTo',
    'delegationDate',
    'status',
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

