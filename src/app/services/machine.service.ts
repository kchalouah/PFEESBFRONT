import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Machine } from "../models/ilot.model"

@Injectable({
  providedIn: "root",
})
export class MachineService {
  private apiUrl = "http://localhost:8080/api/machines"

  constructor(private http: HttpClient) {}

  getAllMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl)
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
