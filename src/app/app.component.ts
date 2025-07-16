import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="white" class="main-toolbar">
      <div class="toolbar-left">
        <img src="assets/images/safran-logo.png" alt="Logo" class="logo-image" />

        <!-- Liens communs -->
        <a mat-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </a>
        <a mat-button routerLink="/demandes">
          <mat-icon>assignment</mat-icon>
          Demandes
        </a>
        <a mat-button routerLink="/ilots">
          <mat-icon>device_hub</mat-icon>
          IIoT
        </a>

        <!-- ADMIN -->
        <ng-container *ngIf="hasRole('ROLE_ADMIN')">
          <a mat-button routerLink="/users">
            <mat-icon>people</mat-icon>
            Utilisateurs
          </a>
          <a mat-button routerLink="/machines">
            <mat-icon>precision_manufacturing</mat-icon>
            Machines
          </a>
        </ng-container>
        <a mat-button routerLink="/programmes">
          <mat-icon>schedule</mat-icon>
          Programmes
        </a>
        <!-- MANAGER -->
        <ng-container *ngIf="hasRole('ROLE_MANAGER')">
          <a mat-button routerLink="/ilots">
            <mat-icon>business</mat-icon>
            Îlots
          </a>
          <a mat-button routerLink="/programmes">
            <mat-icon>schedule</mat-icon>
            Programmes
          </a>
          <a mat-button routerLink="/metiers">
            <mat-icon>work</mat-icon>
            Métiers
          </a>
        </ng-container>

        <!-- CONTRÔLEUR -->
        <ng-container *ngIf="hasRole('ROLE_CONTROLEUR')">
          <a mat-button routerLink="/verifications">
            <mat-icon>check_circle</mat-icon>
            Vérifications
          </a>
        </ng-container>

        <!-- OPÉRATEUR -->
        <ng-container *ngIf="hasRole('ROLE_OPERATEUR')">
          <a mat-button routerLink="/mes-demandes">
            <mat-icon>assignment_ind</mat-icon>
            Mes Demandes
          </a>
        </ng-container>
      </div>

      <span class="spacer"></span>

      <!-- Menu utilisateur -->
      <ng-container *ngIf="authService.isAuthenticated()">
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </button>
          <button mat-menu-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Paramètres</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Déconnexion</span>
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .main-toolbar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 16px;
      background-color: white;
      color: black;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-image {
      height: 30px;
      margin-right: 10px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    a[mat-button] {
      text-transform: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: any = null;
  username: string = '';
  userRole: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.username = user?.sub || 'Utilisateur';
      this.userRole = user?.roles?.[0] || '';
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  logout() {
    this.authService.logout();
  }
}
