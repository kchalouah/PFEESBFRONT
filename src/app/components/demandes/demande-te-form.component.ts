import { Component, Inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { DemandeService } from "../../services/demande.service"
import { MachineService } from "../../services/machine.service"
import { UserService } from "../../services/user.service"
import { DemandeTe } from "../../models/demande.model"
import { Machine } from "../../models/ilot.model"
import { AppUser } from "../../models/user.model"

@Component({
  selector: "app-demande-te-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} une Demande TE</h2>
    <mat-dialog-content>
      <form [formGroup]="demandeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>OF</mat-label>
          <input matInput formControlName="of_demande" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date de la demande</mat-label>
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
          <mat-label>Statut TE</mat-label>
          <mat-select formControlName="teStatus">
            <mat-option value="NOUVEAU">Nouveau</mat-option>
            <mat-option value="EN_ANALYSE">En analyse</mat-option>
            <mat-option value="EN_TEST">En test</mat-option>
            <mat-option value="VALIDE">Validé</mat-option>
            <mat-option value="REJETE">Rejeté</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ingénieur TE</mat-label>
          <mat-select formControlName="teEngineer">
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
export class DemandeTeFormComponent implements OnInit {
  demandeForm: FormGroup
  machines: Machine[] = []
  users: AppUser[] = []

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService,
    private machineService: MachineService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DemandeTeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DemandeTe | null,
  ) {
    this.demandeForm = this.fb.group({
      of_demande: ["", Validators.required],
      date_demande: ["", Validators.required],
      status: ["EN_ATTENTE", Validators.required],
      etq: [""],
      duree_en_minutes: [0],
      teStatus: ["NOUVEAU", Validators.required],
      teEngineer: [""],
      operateur: [""],
      controleur: [""],
      machine: [""],
    })
  }

  ngOnInit() {
    this.loadMachines()
    this.loadUsers()
    if (this.data) {
      this.demandeForm.patchValue(this.data)
    }
  }

  loadMachines() {
    this.machineService.getAllMachines().subscribe({
      next: (machines) => this.machines = machines,
      error: (error) => console.error("Erreur chargement machines:", error),
    })
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error("Erreur chargement utilisateurs:", error),
    })
  }

  onSave() {
    if (this.demandeForm.valid) {
      const demandeData = this.demandeForm.value

      const request = this.data
        ? this.demandeService.updateDemande(this.data.id!, demandeData)
        : this.demandeService.createDemande(demandeData)

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error("Erreur sauvegarde demande TE:", error),
      })
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
