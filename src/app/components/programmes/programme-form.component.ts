import { Component, OnInit, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { ProgrammeService } from "../../services/programme.service"
import { MachineService } from "../../services/machine.service"
import { Programme, Machine } from "../../models/ilot.model"

@Component({
  selector: "app-programme-form",
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
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} un Programme</h2>
    <mat-dialog-content>
      <form [formGroup]="programmeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="programmeForm.get('name')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Durée (minutes)</mat-label>
          <input matInput type="number" formControlName="duration" min="0">
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
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="programmeForm.invalid">
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
      min-width: 500px;
    }
  `,
  ],
})
export class ProgrammeFormComponent implements OnInit {
  programmeForm: FormGroup
  machines: Machine[] = []

  constructor(
    private fb: FormBuilder,
    private programmeService: ProgrammeService,
    private machineService: MachineService,
    private dialogRef: MatDialogRef<ProgrammeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Programme | null,
  ) {
    this.programmeForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      duration: [""],
      machineId: [""],
    })
  }

  ngOnInit() {
    this.loadMachines()
    if (this.data) {
      this.programmeForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        duration: this.data.duration,
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

  onSave() {
    if (this.programmeForm.valid) {
      const programmeData = this.programmeForm.value

      if (this.data) {
        this.programmeService.updateProgramme(this.data.id!, programmeData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating programme:", error)
          },
        })
      } else {
        this.programmeService.createProgramme(programmeData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating programme:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
