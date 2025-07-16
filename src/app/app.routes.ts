import type { Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () => import("./components/auth/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./components/auth/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    loadComponent: () => import("./components/users/user-list.component").then((m) => m.UserListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "ilots",
    loadComponent: () => import("./components/ilots/ilot-list.component").then((m) => m.IlotListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "machines",
    loadComponent: () => import("./components/machines/machine-list.component").then((m) => m.MachineListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "programmes",
    loadComponent: () => import("./components/programmes/programme-list.component").then((m) => m.ProgrammeListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "demandes",
    loadComponent: () => import("./components/demandes/demande-list.component").then((m) => m.DemandeListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "metiers",
    loadComponent: () => import("./components/metiers/metier-list.component").then((m) => m.MetierListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "profile", // ✅ NOUVELLE ROUTE AJOUTÉE
    loadComponent: () => import("./components/profile/user-profile.component").then((m) => m.UserProfileComponent),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/login" },
];
