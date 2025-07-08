import { Component, Inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { UserService } from "../../services/user.service"
import { AppUser, UserRole } from "../../models/user.model"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"

@Component({
  selector: "app-user-form",
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
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} un Utilisateur</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom d'utilisateur</mat-label>
          <input matInput formControlName="username" required>
          <mat-error *ngIf="userForm.get('username')?.hasError('required')">
            Le nom d'utilisateur est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">
            L'email est requis
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
            Format d'email invalide
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="firstName" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="lastName" required>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!data">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-error *ngIf="userForm.get('password')?.hasError('required')">
            Le mot de passe est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rôles</mat-label>
          <mat-select formControlName="roleIds" multiple>
            <mat-option *ngFor="let role of roles" [value]="role.id">
              {{ role.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="userForm.invalid">
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
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  roles: UserRole[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppUser | null,
  ) {
    this.userForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: [""],
      roleIds: [[]],
    })

    if (!this.data) {
      this.userForm.get("password")?.setValidators([Validators.required])
    }
  }

  ngOnInit() {
    this.loadRoles()
    if (this.data) {
      this.userForm.patchValue({
        username: this.data.username,
        email: this.data.email,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        roleIds: this.data.roles?.map((r) => r.id) || [],
      })
    }
  }

  loadRoles() {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles
      },
      error: (error) => {
        console.error("Error loading roles:", error)
      },
    })
  }

  onSave() {
    if (this.userForm.valid) {
      const userData = this.userForm.value

      if (this.data) {
        this.userService.updateUser(this.data.id!, userData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error updating user:", error)
          },
        })
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error("Error creating user:", error)
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
