import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatGridListModule } from "@angular/material/grid-list"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <div class="container">
      <h1>Tableau de bord</h1>

      <mat-grid-list cols="4" rowHeight="200px" gutterSize="20px">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon">people</mat-icon>
                <div class="card-info">
                  <h3>Utilisateurs</h3>
                  <p class="card-number">{{ stats.users }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon">business</mat-icon>
                <div class="card-info">
                  <h3>Îlots</h3>
                  <p class="card-number">{{ stats.ilots }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon">precision_manufacturing</mat-icon>
                <div class="card-info">
                  <h3>Machines</h3>
                  <p class="card-number">{{ stats.machines }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon">assignment</mat-icon>
                <div class="card-info">
                  <h3>Demandes</h3>
                  <p class="card-number">{{ stats.demandes }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [
    `
    .dashboard-card {
      width: 100%;
      height: 100%;
    }
    .card-content {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 20px;
    }
    .card-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-right: 20px;
      color: #1976d2;
    }
    .card-info h3 {
      margin: 0;
      color: #666;
    }
    .card-number {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0 0 0;
      color: #1976d2;
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  stats = {
    users: 25,
    ilots: 8,
    machines: 45,
    demandes: 12,
  }

  ngOnInit() {
    // Load actual stats from API
  }
}
