import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule,MatDialog } from "@angular/material/dialog"
import { UserService } from "../../services/user.service"
import { AppUser } from "../../models/user.model"
import { UserFormComponent } from "./user-form.component"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Utilisateurs</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" (click)="openUserForm()">
            <mat-icon>add</mat-icon>
            Nouvel Utilisateur
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="users" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let user">{{ user.id }}</td>
            </ng-container>

            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef>Nom d'utilisateur</th>
              <td mat-cell *matCellDef="let user">{{ user.username }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="firstName">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let user">{{ user.firstName }}</td>
            </ng-container>

            <ng-container matColumnDef="lastName">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let user">{{ user.lastName }}</td>
            </ng-container>

            <ng-container matColumnDef="roles">
              <th mat-header-cell *matHeaderCellDef>Rôles</th>
              <td mat-cell *matCellDef="let user">
                {{ getRoleNames(user) }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button (click)="editUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user.id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    mat-card-header {
      display: flex;
      align-items: center;
    }
    table {
      width: 100%;
    }
  `,
  ],
})
export class UserListComponent implements OnInit {
  users: AppUser[] = [
    {
      id: 1,
      username: "mohamed.aziz",
      email: "mohamed.aziz@gmail.com",
      firstName: "Mohamed Aziz",
      lastName: "el Kateb",
      roles: [{ roleName: "ADMIN" }],
      createdAt: new Date("2023-01-01T09:00:00"),
      updatedAt: new Date("2023-01-10T10:00:00")
    },
    {
      id: 2,
      username: "ben.marouane",
      email: "ben.marouane@gmail.com",
      firstName: "Mohamed",
      lastName: "Ben Marouane",
      roles: [{ roleName: "MANAGER" }],
      createdAt: new Date("2023-02-01T09:00:00"),
      updatedAt: new Date("2023-02-10T10:00:00")
    },
    {
      id: 3,
      username: "ilyes.abidi",
      email: "ilyes.abidi@gmail.com",
      firstName: "Ilyes",
      lastName: "Abidi",
      roles: [{ roleName: "CONTROLEUR" }],
      createdAt: new Date("2023-03-01T09:00:00"),
      updatedAt: new Date("2023-03-10T10:00:00")
    },
    {
      id: 4,
      username: "amine.benali",
      email: "amine.benali@gmail.com",
      firstName: "Amine",
      lastName: "Ben Ali",
      roles: [{ roleName: "OPERATEUR" }],
      createdAt: new Date("2023-04-01T09:00:00"),
      updatedAt: new Date("2023-04-10T10:00:00")
    }
  ]
  displayedColumns: string[] = [
    "id",
    "username",
    "email",
    "firstName",
    "lastName",
    "roles",
    "actions"
  ]

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    // Uncomment the next line to load from backend instead of mock data
    // this.loadUsers()
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (error) => {
        console.error("Error loading users:", error)
      },
    })
  }

  openUserForm(user?: AppUser) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: "600px",
      data: user || null,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers()
      }
    })
  }

  editUser(user: AppUser) {
    this.openUserForm(user)
  }

  deleteUser(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers()
        },
        error: (error) => {
          console.error("Error deleting user:", error)
        },
      })
    }
  }

  getRoleNames(user: AppUser): string {
    return user.roles?.map(role => role.roleName).join(', ') || '—'
  }
}
