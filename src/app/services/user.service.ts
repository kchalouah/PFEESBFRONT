import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { AppUser, UserRole } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/auth`)
  }

  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/auth/${id}`)
  }

  createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/auth/register`, user)
  }

  updateUser(id: number, user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/auth/${id}`, user)
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/auth/${id}`)
  }

  getAllRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/auth/roles`)
  }
}
