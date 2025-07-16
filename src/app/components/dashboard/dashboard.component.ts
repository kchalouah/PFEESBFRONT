import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-wrapper" *ngIf="username; else loading">
      <h1 class="welcome-message">
        Bienvenue sur la plateforme d'outillage <span class="brand">Safran</span>, <br />
        <span class="username">{{ username }}</span> !
      </h1>

      <div class="dashboard-container">
        <!-- ADMIN -->
        <ng-container *ngIf="hasRole('ROLE_ADMIN')">
          <a class="dashboard-card" routerLink="/users" matRipple>
            <mat-icon>group</mat-icon>
            <span>Gestion des utilisateurs</span>
          </a>
          <a class="dashboard-card" routerLink="/machines" matRipple>
            <mat-icon>build</mat-icon>
            <span>Gestion des machines</span>
          </a>
          <a class="dashboard-card" routerLink="/programmes" matRipple>
            <mat-icon>event</mat-icon>
            <span>Programmes</span>
          </a>
        </ng-container>

        <!-- MANAGER -->
        <ng-container *ngIf="hasRole('ROLE_MANAGER')">
          <a class="dashboard-card" routerLink="/ilots" matRipple>
            <mat-icon>account_tree</mat-icon>
            <span>Gestion des îlots</span>
          </a>
          <a class="dashboard-card" routerLink="/programmes" matRipple>
            <mat-icon>event</mat-icon>
            <span>Programmes</span>
          </a>
          <a class="dashboard-card" routerLink="/metiers" matRipple>
            <mat-icon>work_outline</mat-icon>
            <span>Gestion des métiers</span>
          </a>
        </ng-container>

        <!-- CONTRÔLEUR -->
        <ng-container *ngIf="hasRole('ROLE_CONTROLEUR')">
          <a class="dashboard-card" routerLink="/verifications" matRipple>
            <mat-icon>fact_check</mat-icon>
            <span>Vérifications</span>
          </a>
        </ng-container>

        <!-- OPÉRATEUR -->
        <ng-container *ngIf="hasRole('ROLE_OPERATEUR')">
          <a class="dashboard-card" routerLink="/mes-demandes" matRipple>
            <mat-icon>assignment_ind</mat-icon>
            <span>Mes demandes</span>
          </a>
        </ng-container>

        <!-- Liens communs -->
        <a class="dashboard-card" routerLink="/demandes" matRipple>
          <mat-icon>assignment</mat-icon>
          <span>Demandes</span>
        </a>
        <a class="dashboard-card" routerLink="/ilots" matRipple>
          <mat-icon>settings_input_component</mat-icon>
          <span>IIoT</span>
        </a>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-icon class="loading-icon" aria-hidden="true">hourglass_empty</mat-icon>
        <p>Chargement...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f9fbfd;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 3rem 1rem;
      box-sizing: border-box;
    }
    .dashboard-wrapper {
      max-width: 1280px;
      width: 100%;
    }
    .welcome-message {
      font-weight: 900;
      font-size: 2.8rem;
      color: #0d47a1;
      margin-bottom: 2.5rem;
      text-align: center;
      line-height: 1.2;
    }
    .brand {
      color: #1e88e5;
      font-style: italic;
    }
    .username {
      color: #1565c0;
      text-transform: capitalize;
    }
    .dashboard-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
    }
    .dashboard-card {
      background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
      color: #fff;
      cursor: pointer;
      padding: 2.5rem 1.5rem;
      text-decoration: none;
      user-select: none;
      font-weight: 700;
      font-size: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      text-align: center;
    }
    .dashboard-card mat-icon {
      font-size: 60px;
      margin-bottom: 1.2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
    }
    .dashboard-card:hover {
      box-shadow: 0 14px 35px rgba(33, 150, 243, 0.6);
      transform: translateY(-10px) scale(1.05);
      background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 7rem;
      color: #90a4ae;
    }
    .loading-icon {
      font-size: 72px;
      animation: spin 1.8s linear infinite;
      margin-bottom: 1.2rem;
    }
    @keyframes spin {
      from { transform: rotate(0deg);}
      to { transform: rotate(360deg);}
    }
    @media (max-width: 600px) {
      .welcome-message {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
      }
      .dashboard-container {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .dashboard-card {
        font-size: 1rem;
        padding: 2rem 1rem;
      }
      .dashboard-card mat-icon {
        font-size: 48px;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  username = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: any) => {
      this.username = user?.sub || 'Utilisateur';
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
