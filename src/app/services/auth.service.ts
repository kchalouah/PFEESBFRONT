import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import  { Router } from "@angular/router"
import { BehaviorSubject, type Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { UserRole } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api/auth"
  private tokenKey = "auth_token"
  private currentUserSubject = new BehaviorSubject<any>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = localStorage.getItem(this.tokenKey)
    if (token) {
      this.setCurrentUserFromToken(token)
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token)
          this.setCurrentUserFromToken(response.token)
          this.router.navigate(["/dashboard"])
        }
      }),
    )
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/roles`)
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  private setCurrentUserFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      this.currentUserSubject.next(payload)
    } catch (error) {
      console.error("Error decoding token:", error)
    }
  }
}
