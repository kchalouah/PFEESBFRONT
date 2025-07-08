import { Injectable } from "@angular/core"
import { HttpErrorResponse } from "@angular/common/http"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = "Une erreur est survenue"

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`
    } else {
      switch (error.status) {
        case 400:
          errorMessage = "Données invalides"
          break
        case 401:
          errorMessage = "Non autorisé - Veuillez vous reconnecter"
          break
        case 403:
          errorMessage = "Accès interdit"
          break
        case 404:
          errorMessage = "Ressource non trouvée"
          break
        case 409:
          errorMessage = "Conflit - La ressource existe déjà"
          break
        case 500:
          errorMessage = "Erreur serveur interne"
          break
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`
      }
    }

    this.snackBar.open(errorMessage, "Fermer", {
      duration: 5000,
      panelClass: ["error-snackbar"],
    })
  }
}
