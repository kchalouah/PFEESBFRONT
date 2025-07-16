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
          <mat-card-subtitle>Gérez vos informations et mot de passe</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Informations personnelles">
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="firstName" placeholder="Votre prénom" />
                  <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                    Le prénom est requis
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="lastName" placeholder="Votre nom" />
                  <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                    Le nom est requis
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="exemple@mail.com" />
                  <mat-error *ngIf="profileForm.get('email')?.hasError('required')">L'email est requis</mat-error>
                  <mat-error *ngIf="profileForm.get('email')?.hasError('email')">Email invalide</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom d'utilisateur</mat-label>
                  <input matInput formControlName="username" placeholder="Nom d'utilisateur" />
                  <mat-error *ngIf="profileForm.get('username')?.hasError('required')">
                    Le nom d'utilisateur est requis
                  </mat-error>
                </mat-form-field>

                <div class="form-actions full-width">
                  <button
                    mat-flat-button
                    color="primary"
                    type="submit"
                    [disabled]="profileForm.invalid"
                    aria-label="Mettre à jour le profil"
                  >
                    <mat-icon>save</mat-icon>
                    Mettre à jour
                  </button>
                </div>
              </form>
            </mat-tab>

            <mat-tab label="Changer le mot de passe">
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mot de passe actuel</mat-label>
                  <input matInput type="password" formControlName="currentPassword" placeholder="Mot de passe actuel" />
                  <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                    Ce champ est requis
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nouveau mot de passe</mat-label>
                  <input matInput type="password" formControlName="newPassword" placeholder="Nouveau mot de passe" />
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                    Ce champ est requis
                  </mat-error>
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                    Minimum 6 caractères
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmer le nouveau mot de passe</mat-label>
                  <input matInput type="password" formControlName="confirmPassword" placeholder="Confirmer mot de passe" />
                  <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                    Ce champ est requis
                  </mat-error>
                  <mat-error *ngIf="passwordForm.errors?.['passwordMismatch']">
                    Les mots de passe ne correspondent pas
                  </mat-error>
                  <mat-error *ngIf="passwordForm.errors?.['passwordMismatch']">
                    Les mots de passe ne correspondent pas
                  </mat-error>

                </mat-form-field>

                <div class="form-actions full-width">
                  <button
                    mat-flat-button
                    color="accent"
                    type="submit"
                    [disabled]="passwordForm.invalid"
                    aria-label="Changer le mot de passe"
                  >
                    <mat-icon>lock</mat-icon>
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
        max-width: 700px;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      mat-card {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
      }

      mat-card-header {
        padding-bottom: 0;
      }

      mat-card-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1976d2;
      }

      mat-card-subtitle {
        font-size: 1rem;
        color: #555;
        margin-top: 4px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }

      button[mat-flat-button] {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.6rem 1.5rem;
        font-weight: 600;
        font-size: 1rem;
      }

      mat-icon {
        font-size: 20px;
      }

      @media (max-width: 600px) {
        .form-grid {
          grid-template-columns: 1fr;
        }

        .form-actions {
          justify-content: center;
        }
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
        this.profileForm.patchValue({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          username: user.sub || "",
        })
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
        next: () => this.notificationService.showSuccess("Profil mis à jour avec succès"),
        error: () => this.notificationService.showError("Erreur lors de la mise à jour du profil"),
      })
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value
      // Implémente ici l'appel API pour changer le mot de passe
      this.notificationService.showSuccess("Mot de passe changé avec succès")
      this.passwordForm.reset()
    }
  }
}
