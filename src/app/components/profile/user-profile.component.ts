import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTabsModule } from "@angular/material/tabs"
import { AuthService } from "../../services/auth.service"
import { UserService } from "../../services/user.service"
import { NotificationService } from "../../services/notification.service"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mon Profil</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Informations personnelles">
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Prénom</mat-label>
                    <input matInput formControlName="firstName">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Nom</mat-label>
                    <input matInput formControlName="lastName">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom d'utilisateur</mat-label>
                  <input matInput formControlName="username">
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid">
                    Mettre à jour
                  </button>
                </div>
              </form>
            </mat-tab>

            <mat-tab label="Changer le mot de passe">
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mot de passe actuel</mat-label>
                  <input matInput type="password" formControlName="currentPassword">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nouveau mot de passe</mat-label>
                  <input matInput type="password" formControlName="newPassword">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmer le nouveau mot de passe</mat-label>
                  <input matInput type="password" formControlName="confirmPassword">
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid">
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }
    .form-actions {
      margin-top: 20px;
    }
    .mat-mdc-tab-body-content {
      padding: 20px 0;
    }
  `,
  ],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup
  passwordForm: FormGroup
  currentUser: any

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      username: ["", Validators.required],
    })

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user
        this.profileForm.patchValue(user)
      }
    })
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword")
    const confirmPassword = form.get("confirmPassword")
    return newPassword && confirmPassword && newPassword.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value
      this.userService.updateUser(this.currentUser.id, profileData).subscribe({
        next: () => {
          this.notificationService.showSuccess("Profil mis à jour avec succès")
        },
        error: () => {
          this.notificationService.showError("Erreur lors de la mise à jour du profil")
        },
      })
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value
      // Implement password change API call
      this.notificationService.showSuccess("Mot de passe changé avec succès")
      this.passwordForm.reset()
    }
  }
}
