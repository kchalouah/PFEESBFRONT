import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, RouterModule } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { MatMenuModule } from "@angular/material/menu"
import { MatBadgeModule } from "@angular/material/badge"
import { MatDividerModule } from "@angular/material/divider"
import { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  template: `
    <div class="app-container">
      <mat-sidenav-container class="sidenav-container" *ngIf="authService.isAuthenticated()">
        <mat-sidenav #drawer class="sidenav" fixedInViewport [mode]="'over'">
          <div class="sidenav-header">
            <div class="app-logo">
              <img src="assets/images/safran-logo.png" alt="Safran Logo" class="logo-image" />
              <span class="app-name">PFE Aziz</span>
            </div>
            <button mat-icon-button class="close-sidenav" (click)="drawer.close()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="sidenav-user">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-info">
              <div class="user-name">{{ username }}</div>
              <div class="user-role">{{ userRole }}</div>
            </div>
          </div>

          <mat-nav-list class="nav-list">
            <div class="nav-section">
              <div class="nav-section-title">Principal</div>
              <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>dashboard</mat-icon>
                <span>Tableau de bord</span>
              </a>
              <a mat-list-item routerLink="/demandes" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>assignment</mat-icon>
                <span>Demandes</span>
              </a>
            </div>

            <div class="nav-section" *ngIf="hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN')">
              <div class="nav-section-title">Gestion</div>
              <a mat-list-item routerLink="/users" routerLinkActive="active-link" (click)="drawer.close()" *ngIf="hasRole('ROLE_ADMIN')">
                <mat-icon>people</mat-icon>
                <span>Utilisateurs</span>
              </a>
              <a mat-list-item routerLink="/ilots" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>business</mat-icon>
                <span>Îlots</span>
              </a>
              <a mat-list-item routerLink="/machines" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>precision_manufacturing</mat-icon>
                <span>Machines</span>
              </a>
              <a mat-list-item routerLink="/programmes" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>schedule</mat-icon>
                <span>Programmes</span>
              </a>
              <a mat-list-item routerLink="/metiers" routerLinkActive="active-link" (click)="drawer.close()">
                <mat-icon>work</mat-icon>
                <span>Métiers</span>
              </a>
            </div>
          </mat-nav-list>

          <div class="sidenav-footer">
            <button mat-stroked-button color="warn" class="logout-button" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </div>
        </mat-sidenav>

        <mat-sidenav-content>
          <mat-toolbar>
            <div class="toolbar-container">
              <div class="toolbar-left">
                <button mat-icon-button class="menu-button" (click)="drawer.toggle()">
                  <mat-icon>menu</mat-icon>
                </button>
                <div class="toolbar-logo">
                  <img src="assets/images/safran-logo.png" alt="Safran Logo" class="toolbar-logo-image" />
                  <span class="app-title">PFE Aziz - Gestion</span>
                </div>
              </div>

              <div class="toolbar-right">
                <button mat-icon-button class="toolbar-icon" [matMenuTriggerFor]="userMenu" aria-label="Menu utilisateur">
                  <mat-icon>account_circle</mat-icon>
                </button>

                <mat-menu #userMenu="matMenu" class="user-menu">
                  <div class="menu-header">
                    <div class="menu-user-info">
                      <mat-icon class="menu-user-avatar">account_circle</mat-icon>
                      <div class="menu-user-details">
                        <div class="menu-user-name">{{ username }}</div>
                        <div class="menu-user-email">{{ userRole }}</div>
                      </div>
                    </div>
                  </div>
                  <mat-divider></mat-divider>
                  <button mat-menu-item routerLink="/profile">
                    <mat-icon>person</mat-icon>
                    <span>Mon profil</span>
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
              </div>
            </div>
          </mat-toolbar>

          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Show router outlet directly for auth pages -->
      <router-outlet *ngIf="!authService.isAuthenticated()"></router-outlet>
    </div>
  `,
  styles: [
    `
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      height: 100%;
    }

    /* Sidenav Styling */
    .sidenav {
      width: 280px;
      border-right: none;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      background-color: white;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      padding: var(--space-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .logo-image {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .toolbar-logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .toolbar-logo-image {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }

    .app-name {
      font-weight: 500;
      font-size: 1.25rem;
      color: var(--primary-color);
    }

    .close-sidenav {
      color: var(--text-light);
    }

    .sidenav-user {
      padding: var(--space-md);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      border-bottom: 1px solid var(--border-color);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-circle);
      background-color: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      color: var(--text-color);
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-light);
    }

    .nav-list {
      flex: 1;
      padding: var(--space-sm) 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: var(--space-md);
    }

    .nav-section-title {
      padding: var(--space-sm) var(--space-lg);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .mat-nav-list a {
      margin: var(--space-xs) var(--space-sm);
      border-radius: 8px;
      transition: all 0.2s ease;
      height: 48px;
      color: #333;
      font-weight: 400;
    }

    .mat-nav-list a:hover {
      background-color: #f5f5f5;
      transform: translateX(3px);
    }

    .mat-nav-list a.active-link {
      background-color: #f0f7ff;
      color: #1976d2;
      font-weight: 500;
      border-left: 3px solid #1976d2;
    }

    .mat-nav-list a.active-link mat-icon {
      color: #1976d2;
    }

    .mat-nav-list a mat-icon {
      margin-right: var(--space-md);
      color: #666;
    }

    .sidenav-footer {
      padding: var(--space-md);
      border-top: 1px solid var(--border-color);
    }

    .logout-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
    }

    /* Toolbar Styling */
    .mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      background-color: white;
      color: var(--text-color);
      height: 64px;
      padding: 0 var(--space-md);
      border-bottom: 1px solid #f0f0f0;
    }

    .toolbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
    }

    .menu-button {
      margin-right: var(--space-sm);
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .toolbar-icon {
      margin-left: var(--space-sm);
    }

    /* User Menu Styling */
    .menu-header {
      padding: var(--space-md);
    }

    .menu-user-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .menu-user-avatar {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      color: var(--primary-color);
    }

    .menu-user-details {
      display: flex;
      flex-direction: column;
    }

    .menu-user-name {
      font-weight: 500;
    }

    .menu-user-email {
      font-size: 0.75rem;
      color: var(--text-light);
    }

    /* Main Content */
    .main-content {
      padding: var(--space-lg);
      background-color: var(--background-light);
      min-height: calc(100vh - 64px);

      @media (max-width: 768px) {
        padding: var(--space-md);
      }
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  currentUser: any = null;
  username: string = '';
  userRole: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.username = user.sub || 'Utilisateur';

        // Get the highest priority role for display
        if (user.roles && user.roles.length > 0) {
          if (user.roles.includes('ROLE_ADMIN')) {
            this.userRole = 'Administrateur';
          } else if (user.roles.includes('ROLE_MANAGER')) {
            this.userRole = 'Manager';
          } else {
            this.userRole = 'Utilisateur';
          }
        }
      }
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  logout() {
    this.authService.logout()
  }
}
