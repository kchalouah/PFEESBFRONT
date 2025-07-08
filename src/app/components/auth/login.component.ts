import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <img src="assets/images/safran-logo.png" alt="Safran Logo" class="auth-logo" />
        <div class="auth-welcome">Bienvenue sur la plateforme</div>
        <div class="auth-avatar">
          <mat-icon>lock</mat-icon>
        </div>
        <mat-card-header>
          <mat-card-title>Connexion</mat-card-title>
          <mat-card-subtitle>Accédez à votre espace PFE</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" required autocomplete="username">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required autocomplete="current-password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" tabindex="-1">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="loginForm.invalid || isLoading" class="full-width">
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <div class="register-link">
            <p>Pas de compte ? <a routerLink="/register">S'inscrire</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 18px;
      }

      .register-link {
        margin-top: 18px;
        text-align: center;
      }

      .error-message {
        color: #d32f2f;
        margin-bottom: 12px;
        text-align: center;
        font-size: 0.98em;
      }

      .auth-logo {
        display: block;
        margin: 0 auto 16px auto;
        max-width: 90px;
        max-height: 90px;
        width: auto;
        height: auto;
        object-fit: contain;
      }

      @media (max-width: 480px) {
        .full-width {
          margin-bottom: 12px;
        }

        .auth-logo {
          max-width: 70px;
          max-height: 70px;
        }
      }
    `
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  hidePassword = true
  isLoading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.errorMessage = ""
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect."
          this.isLoading = false
        },
      })
    }
  }
}
