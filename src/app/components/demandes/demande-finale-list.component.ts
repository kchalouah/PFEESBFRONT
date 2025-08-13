import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemandeFinale } from '../../models/demande.model';
import { DemandeFinaleFormComponent } from './demande-finale-form.component';
import { DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-demande-finale-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
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
  demandeFinaleColumns: string[] = [
    'id',
    'of_demande',
    'finalDecision',
    'approvedDate',
    'status',
    'actions'
  ];

  constructor(private dialog: MatDialog, private demandeService: DemandeService) {}

  ngOnInit() {}

  openDemandeFinaleForm(demande?: DemandeFinale) {
    const dialogRef = this.dialog.open(DemandeFinaleFormComponent, {
      width: '700px',
      data: demande || null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Optionally emit event to parent to reload
      }
    });
  }

  editDemandeFinale(demande: DemandeFinale) {
    this.openDemandeFinaleForm(demande);
  }

  deleteDemandeFinale(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande finale ?')) {
      this.demandeService.deleteDemandeFinale(id).subscribe();
    }
  }
}

