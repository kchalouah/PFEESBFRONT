import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import  { Ilot } from "../models/ilot.model"

@Injectable({
  providedIn: "root",
})
export class IlotService {
  private apiUrl = "http://localhost:8080/api/ilots"

  constructor(private http: HttpClient) {}

  getAllIlots(): Observable<Ilot[]> {
    return this.http.get<Ilot[]>(this.apiUrl)
  }

  getIlotById(id: number): Observable<Ilot> {
    return this.http.get<Ilot>(`${this.apiUrl}/${id}`)
  }

  createIlot(ilot: Ilot): Observable<Ilot> {
    return this.http.post<Ilot>(this.apiUrl, ilot)
  }

  updateIlot(id: number, ilot: Ilot): Observable<Ilot> {
    return this.http.put<Ilot>(`${this.apiUrl}/${id}`, ilot)
  }

  deleteIlot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
