import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content>
          <div class="not-found-content">
            <mat-icon class="not-found-icon">error_outline</mat-icon>
            <h1>404</h1>
            <h2>Page non trouvée</h2>
            <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
            <div class="actions">
              <button mat-raised-button color="primary" routerLink="/dashboard">
                <mat-icon>home</mat-icon>
                Retour à l'accueil
              </button>
              <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Retour
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #fafafa;
      padding: 20px;
    }
    .not-found-card {
      max-width: 500px;
      width: 100%;
    }
    .not-found-content {
      text-align: center;
      padding: 40px 20px;
    }
    .not-found-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #666;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 72px;
      margin: 0;
      color: #1976d2;
      font-weight: bold;
    }
    h2 {
      margin: 10px 0;
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 30px;
    }
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  `,
  ],
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back()
  }
}
