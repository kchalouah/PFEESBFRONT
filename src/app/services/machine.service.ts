import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Machine, Ilot } from "../models/ilot.model" // <-- add Ilot import

@Injectable({
  providedIn: "root",
})
export class MachineService {
  private apiUrl = "http://localhost:8080/api/machines"
  private ilotApiUrl = "http://localhost:8080/api/ilots" // <-- add ilot endpoint

  constructor(private http: HttpClient) {}

  getAllMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl)
  }

  // Add this method to fetch ilots
  getAllIlots(): Observable<Ilot[]> {
    return this.http.get<Ilot[]>(this.ilotApiUrl)
  }

  getMachineById(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`)
  }

  createMachine(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine)
  }

  updateMachine(id: number, machine: Machine): Observable<Machine> {
    return this.http.put<Machine>(`${this.apiUrl}/${id}`, machine)
  }

  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
