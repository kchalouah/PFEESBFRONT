import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Metier } from "../models/metier.model"

@Injectable({
  providedIn: "root",
})
export class MetierService {
  private apiUrl = "http://localhost:8080/api/metiers"

  constructor(private http: HttpClient) {}

  getAllMetiers(): Observable<Metier[]> {
    return this.http.get<Metier[]>(this.apiUrl)
  }

  getMetierById(id: number): Observable<Metier> {
    return this.http.get<Metier>(`${this.apiUrl}/${id}`)
  }

  createMetier(metier: Metier): Observable<Metier> {
    return this.http.post<Metier>(this.apiUrl, metier)
  }

  updateMetier(id: number, metier: Metier): Observable<Metier> {
    return this.http.put<Metier>(`${this.apiUrl}/${id}`, metier)
  }

  deleteMetier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
