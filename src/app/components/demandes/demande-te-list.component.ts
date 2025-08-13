import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemandeTe } from '../../models/demande.model';
import { DemandeTeFormComponent } from './demande-te-form.component';
import { DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-demande-te-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
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
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="demandeTeColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: demandeTeColumns;"></tr>
      </table>
    </div>
  `
})
export class DemandeTeListComponent implements OnInit {
  @Input() demandesTe: DemandeTe[] = [];
  demandeTeColumns: string[] = [
    'id',
    'of_demande',
    'teSpecificField',
    'teStatus',
    'status',
    'actions'
  ];

  constructor(private dialog: MatDialog, private demandeService: DemandeService) {}

  ngOnInit() {}

  openDemandeTeForm(demande?: DemandeTe) {
    const dialogRef = this.dialog.open(DemandeTeFormComponent, {
      width: '700px',
      data: demande || null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Optionally emit event to parent to reload
      }
    });
  }

  editDemandeTe(demande: DemandeTe) {
    this.openDemandeTeForm(demande);
  }

  deleteDemandeTe(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande TE ?')) {
      this.demandeService.deleteDemandeTe(id).subscribe();
    }
  }
}

