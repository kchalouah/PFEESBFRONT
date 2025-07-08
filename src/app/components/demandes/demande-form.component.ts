import { Component, OnInit, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { DemandeService } from "../../services/demande.service"
import { MachineService } from "../../services/machine.service"
import  { UserService } from "../../services/user.service"
import { Demande } from "../../models/demande.model"
import { Machine } from "../../models/ilot.model"
import { AppUser } from "../../models/user.model"

@Component({
  selector: "app-demande-form",
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
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} une Demande</h2>
    <mat-dialog-content>
      <form [formGroup]="demandeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
          <mat-error *ngIf="demandeForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" required></textarea>
          <mat-error *ngIf="demandeForm.get('description')?.hasError('required')">
            La description est requise
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option value="EN_ATTENTE">En attente</mat-option>
              <mat-option value="EN_COURS">En cours</mat-option>
              <mat-option value="TERMINE">Terminé</mat-option>
              <mat-option value="ANNULE">Annulé</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="BASSE">Basse</mat-option>
              <mat-option value="MOYENNE">Moyenne</mat-option>
              <mat-option value="HAUTE">Haute</mat-option>
              <mat-option value="CRITIQUE">Critique</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Utilisateur</mat-label>
          <mat-select formControlName="userId">
            <mat-option *ngFor="let user of users" [value]="user.id">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Machine</mat-label>
          <mat-select formControlName="machineId">
            <mat-option *ngFor="let machine of machines" [value]="machine.id">
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
  styles: [
    `
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 600px;
    }
  `,
  ],
})
export class DemandeFormComponent implements OnInit {
  demandeForm: FormGroup
  machines: Machine[] = []
  users: AppUser[] = []
  data: Demande | null

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService,
    private machineService: MachineService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DemandeFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: Demande | null,
  ) {
    this.data = data
    this.demandeForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["EN_ATTENTE", Validators.required],
      priority: ["MOYENNE", Validators.required],
      userId: [""],
      machineId: [""],
    })
  }

  ngOnInit() {
    this.loadMachines()
    this.loadUsers()
    if (this.data) {
      this.demandeForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        status: this.data.status,
        priority: this.data.priority,
        userId: this.data.userId,
        machineId: this.data.machineId,
      })
    }
  }

  loadMachines() {
    this.machineService.getAllMachines().subscribe({
      next: (machines) => {
        this.machines = machines
      },
      error: (error) => {
        console.error("Error loading machines:", error)
      },
    })
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (error) => {
        console.error("Error loading users:", error)
      },
    })
  }

  onSave() {
    if (this.demandeForm.valid) {
      const demandeData = this.demandeForm.value

      if (this.data) {
        this.demandeService.updateDemande(this.data.id!, demandeData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating demande:", error)
          },
        })
      } else {
        this.demandeService.createDemande(demandeData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating demande:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
