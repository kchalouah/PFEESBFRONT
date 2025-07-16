import { Component, OnInit, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MachineService } from "../../services/machine.service"
import { IlotService } from "../../services/ilot.service"
import { Machine, Ilot } from "../../models/ilot.model"

@Component({
  selector: "app-machine-form",
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
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} une Machine</h2>
    <mat-dialog-content>
      <form [formGroup]="machineForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="machineForm.get('name')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Type</mat-label>
            <input matInput formControlName="type">
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Modèle</mat-label>
            <input matInput formControlName="model">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Numéro de série</mat-label>
          <input matInput formControlName="serialNumber">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Îlot</mat-label>
          <mat-select formControlName="ilot">
            <mat-option *ngFor="let ilot of ilots" [value]="ilot">
              {{ ilot.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="machineForm.invalid">
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
export class MachineFormComponent implements OnInit {
  machineForm: FormGroup
  ilots: Ilot[] = []

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    private ilotService: IlotService,
    private dialogRef: MatDialogRef<MachineFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Machine | null,
  ) {
    this.machineForm = this.fb.group({
      name: ["", Validators.required],
      type: [""],
      model: [""],
      serialNumber: [""],
      ilot: [""],
    })
  }

  ngOnInit() {
    this.loadIlots()
    if (this.data) {
      this.machineForm.patchValue({
        name: this.data.name,
        type: this.data.type,
        model: this.data.model,
        serialNumber: this.data.serialNumber,
        ilot: this.data.ilot || "",
      })
    }
  }

  loadIlots() {
    this.ilotService.getAllIlots().subscribe({
      next: (ilots) => {
        this.ilots = ilots
      },
      error: (error) => {
        console.error("Error loading ilots:", error)
      },
    })
  }

  onSave() {
    if (this.machineForm.valid) {
      const machineData = this.machineForm.value

      if (this.data) {
        this.machineService.updateMachine(this.data.id!, machineData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating machine:", error)
          },
        })
      } else {
        this.machineService.createMachine(machineData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating machine:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
