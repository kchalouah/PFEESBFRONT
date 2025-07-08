import { Component, OnInit, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatIconModule } from "@angular/material/icon"
import { MetierService } from "../../services/metier.service"
import { Metier } from "../../models/metier.model"

@Component({
  selector: "app-metier-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} un Métier</h2>
    <mat-dialog-content>
      <form [formGroup]="metierForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="metierForm.get('name')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Catégorie</mat-label>
          <mat-select formControlName="category">
            <mat-option value="TECHNIQUE">Technique</mat-option>
            <mat-option value="PRODUCTION">Production</mat-option>
            <mat-option value="MAINTENANCE">Maintenance</mat-option>
            <mat-option value="QUALITE">Qualité</mat-option>
            <mat-option value="LOGISTIQUE">Logistique</mat-option>
            <mat-option value="ADMINISTRATIF">Administratif</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="skills-section">
          <h4>Compétences requises</h4>
          <div formArrayName="requiredSkills">
            <div *ngFor="let skill of skillsArray.controls; let i = index" class="skill-input">
              <mat-form-field appearance="outline" class="skill-field">
                <mat-label>Compétence {{ i + 1 }}</mat-label>
                <input matInput [formControlName]="i">
              </mat-form-field>
              <button mat-icon-button type="button" color="warn" (click)="removeSkill(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <button mat-stroked-button type="button" (click)="addSkill()">
            <mat-icon>add</mat-icon>
            Ajouter une compétence
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="metierForm.invalid">
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
    .skills-section {
      margin-top: 20px;
    }
    .skill-input {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .skill-field {
      flex: 1;
    }
  `,
  ],
})
export class MetierFormComponent implements OnInit {
  metierForm: FormGroup
  data: Metier | null

  constructor(
    private fb: FormBuilder,
    private metierService: MetierService,
    private dialogRef: MatDialogRef<MetierFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: Metier | null,
  ) {
    this.data = data
    this.metierForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      category: [""],
      requiredSkills: this.fb.array([]),
    })
  }

  get skillsArray(): FormArray {
    return this.metierForm.get("requiredSkills") as FormArray
  }

  ngOnInit() {
    if (this.data) {
      this.metierForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        category: this.data.category,
      })

      // Add existing skills
      if (this.data.requiredSkills) {
        this.data.requiredSkills.forEach((skill) => {
          this.skillsArray.push(this.fb.control(skill))
        })
      }
    }

    // Add at least one skill field if none exist
    if (this.skillsArray.length === 0) {
      this.addSkill()
    }
  }

  addSkill() {
    this.skillsArray.push(this.fb.control(""))
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index)
  }

  onSave() {
    if (this.metierForm.valid) {
      const metierData = {
        ...this.metierForm.value,
        requiredSkills: this.metierForm.value.requiredSkills.filter((skill: string) => skill.trim() !== ""),
      }

      if (this.data) {
        this.metierService.updateMetier(this.data.id!, metierData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating metier:", error)
          },
        })
      } else {
        this.metierService.createMetier(metierData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating metier:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
