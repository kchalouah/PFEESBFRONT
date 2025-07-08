import { Component, OnInit, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { IlotService } from "../../services/ilot.service"
import { Ilot } from "../../models/ilot.model"

@Component({
  selector: "app-ilot-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} un Îlot</h2>
    <mat-dialog-content>
      <form [formGroup]="ilotForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="ilotForm.get('name')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Emplacement</mat-label>
          <input matInput formControlName="location">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="ilotForm.invalid">
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
export class IlotFormComponent implements OnInit {
  ilotForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private ilotService: IlotService,
    private dialogRef: MatDialogRef<IlotFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ilot | null,
  ) {
    this.ilotForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      location: [""],
    })
  }

  ngOnInit() {
    if (this.data) {
      this.ilotForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        location: this.data.location,
      })
    }
  }

  onSave() {
    if (this.ilotForm.valid) {
      const ilotData = this.ilotForm.value

      if (this.data) {
        this.ilotService.updateIlot(this.data.id!, ilotData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating ilot:", error)
          },
        })
      } else {
        this.ilotService.createIlot(ilotData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating ilot:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
