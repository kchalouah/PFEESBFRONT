import { Component, Inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { DemandeService } from "../../services/demande.service"
import { MachineService } from "../../services/machine.service"
import { UserService } from "../../services/user.service"
import { DemandeFinale } from "../../models/demande.model"
import { Ilot, Machine } from "../../models/ilot.model"
import { AppUser } from "../../models/user.model"

@Component({
  selector: "app-demande-finale-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} une Demande Finale</h2>
    <mat-dialog-content>
      <form [formGroup]="demandeForm">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>OF</mat-label>
          <input matInput formControlName="of_demande" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date de la demande</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date_demande" required />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="EN_ATTENTE">En attente</mat-option>
            <mat-option value="EN_COURS">En cours</mat-option>
            <mat-option value="TERMINE">Terminé</mat-option>
            <mat-option value="ANNULE">Annulé</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Étiquette</mat-label>
          <input matInput formControlName="etq" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Durée (en minutes)</mat-label>
          <input matInput type="number" formControlName="duree_en_minutes" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de produits contrôlés</mat-label>
          <input matInput type="number" formControlName="nombre_produit_controle" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ilot</mat-label>
          <mat-select formControlName="ilot">
            <mat-option *ngFor="let ilot of ilots" [value]="ilot">
              {{ ilot.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Décision finale</mat-label>
          <mat-select formControlName="finalDecision">
            <mat-option value="APPROUVE">Approuvé</mat-option>
            <mat-option value="REJETE">Rejeté</mat-option>
            <mat-option value="EN_ATTENTE_APPROBATION">En attente d'approbation</mat-option>
            <mat-option value="REPORTE">Reporté</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date d'approbation</mat-label>
          <input matInput [matDatepicker]="pickerApp" formControlName="approvedDate" />
          <mat-datepicker-toggle matSuffix [for]="pickerApp"></mat-datepicker-toggle>
          <mat-datepicker #pickerApp></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Manager</mat-label>
          <mat-select formControlName="manager">
            <mat-option *ngFor="let user of users" [value]="user">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Opérateur</mat-label>
          <mat-select formControlName="operateur">
            <mat-option *ngFor="let user of users" [value]="user">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contrôleur</mat-label>
          <mat-select formControlName="controleur">
            <mat-option *ngFor="let user of users" [value]="user">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Machine</mat-label>
          <mat-select formControlName="machine">
            <mat-option *ngFor="let machine of machines" [value]="machine">
              {{ machine.name }} ({{ machine.ilot?.name }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="started">Démarrée</mat-checkbox>
          <mat-checkbox formControlName="finished">Terminée</mat-checkbox>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="demandeForm.invalid">
        {{ data ? 'Modifier' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 600px;
    }
    .checkbox-container {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
    }
  `],
})
export class DemandeFinaleFormComponent implements OnInit {
  demandeForm: FormGroup;
  machines: Machine[] = [];
  ilots: Ilot[] = [];
  users: AppUser[] = [];

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService,
    private machineService: MachineService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DemandeFinaleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DemandeFinale | null,
  ) {
    this.demandeForm = this.fb.group({
      of_demande: ["", Validators.required],
      date_demande: ["", Validators.required],
      status: ["EN_ATTENTE", Validators.required],
      etq: [""],
      duree_en_minutes: [0],
      nombre_produit_controle: [0],
      ilot: [""],
      finalDecision: [""],
      approvedDate: [""],
      manager: [""],
      operateur: [""],
      controleur: [""],
      machine: [""],
      started: [false],
      finished: [false],
    });
  }

  loadIlots() {
    this.machineService.getAllIlots().subscribe({
      next: (ilots) => (this.ilots = ilots),
      error: (error) => console.error("Error loading ilots:", error),
    });
  }

  ngOnInit() {
    this.loadMachines();
    this.loadIlots();
    this.loadUsers();
    if (this.data) {
      this.demandeForm.patchValue(this.data);
    }
  }

  loadMachines() {
    this.machineService.getAllMachines().subscribe({
      next: (machines) => this.machines = machines,
      error: (error) => console.error("Erreur chargement machines:", error),
    });
  }


  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error("Erreur chargement utilisateurs:", error),
    });
  }

  onSave() {
    if (this.demandeForm.valid) {
      const demandeData = this.demandeForm.value;

      const request = this.data
        ? this.demandeService.updateDemandeFinale(this.data.id!, demandeData)
        : this.demandeService.createDemandeFinale(demandeData);

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error("Erreur enregistrement demande finale:", error),
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
