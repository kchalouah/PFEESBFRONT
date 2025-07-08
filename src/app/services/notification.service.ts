import { Injectable } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration = 3000): void {
    this.snackBar.open(message, "Fermer", {
      duration,
      panelClass: ["success-snackbar"],
    })
  }

  showError(message: string, duration = 5000): void {
    this.snackBar.open(message, "Fermer", {
      duration,
      panelClass: ["error-snackbar"],
    })
  }

  showWarning(message: string, duration = 4000): void {
    this.snackBar.open(message, "Fermer", {
      duration,
      panelClass: ["warning-snackbar"],
    })
  }

  showInfo(message: string, duration = 3000): void {
    this.snackBar.open(message, "Fermer", {
      duration,
      panelClass: ["info-snackbar"],
    })
  }
}
