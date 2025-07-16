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
import { DemandeService } from "../../services/demande.service"
import { MachineService } from "../../services/machine.service"
import { UserService } from "../../services/user.service"
import { DemandeDelegue } from "../../models/demande.model"
import { Machine } from "../../models/ilot.model"
import { AppUser } from "../../models/user.model"

@Component({
  selector: "app-demande-delegue-form",
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
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} une Demande Déléguée</h2>
    <mat-dialog-content>
      <form [formGroup]="demandeForm">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>OF</mat-label>
          <input matInput formControlName="of_demande" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date</mat-label>
          <input matInput type="date" formControlName="date_demande" required />
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
          <mat-label>Date de délégation</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="delegationDate" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Délégué à</mat-label>
          <mat-select formControlName="delegatedTo">
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
  `],
})
export class DemandeDelegueFormComponent implements OnInit {
  demandeForm: FormGroup;
  machines: Machine[] = [];
  users: AppUser[] = [];
  data: DemandeDelegue | null;

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService,
    private machineService: MachineService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DemandeDelegueFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: DemandeDelegue | null,
  ) {
    this.data = data;
    this.demandeForm = this.fb.group({
      of_demande: ["", Validators.required],
      date_demande: ["", Validators.required],
      status: ["EN_ATTENTE", Validators.required],
      etq: [""],
      duree_en_minutes: [0],
      delegatedTo: [""],
      delegationDate: [""],
      operateur: [""],
      controleur: [""],
      machine: [""],
    });
  }

  ngOnInit() {
    this.loadMachines();
    this.loadUsers();
    if (this.data) {
      this.demandeForm.patchValue(this.data);
    }
  }

  loadMachines() {
    this.machineService.getAllMachines().subscribe({
      next: (machines) => (this.machines = machines),
      error: (error) => console.error("Error loading machines:", error),
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error("Error loading users:", error),
    });
  }

  onSave() {
    if (this.demandeForm.valid) {
      const demandeData = this.demandeForm.value;

      const request = this.data
        ? this.demandeService.updateDemande(this.data.id!, demandeData)
        : this.demandeService.createDemande(demandeData);

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error("Error saving demande delegue:", error),
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
