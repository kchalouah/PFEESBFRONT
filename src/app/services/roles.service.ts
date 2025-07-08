import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { UserRole } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class RolesService {
  private apiUrl = "http://localhost:8080/api/roles"

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.apiUrl)
  }

  getRoleById(id: number): Observable<UserRole> {
    return this.http.get<UserRole>(`${this.apiUrl}/${id}`)
  }

  createRole(role: UserRole): Observable<UserRole> {
    return this.http.post<UserRole>(this.apiUrl, role)
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
