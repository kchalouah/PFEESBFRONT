import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class HomeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // If user is already authenticated, redirect to dashboard
      this.router.navigate(["/dashboard"]);
      return false;
    } else {
      // If not authenticated, allow access to home page
      return true;
    }
  }
}
