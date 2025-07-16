import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Demande, DemandeDelegue, DemandeFinale, DemandeTe } from "../models/demande.model"

@Injectable({
  providedIn: "root",
})
export class DemandeService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) {}

  // Standard Demandes
  getAllDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/demandes`)
  }

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiUrl}/demandes/${id}`)
  }

  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.apiUrl}/demandes`, demande)
  }

  updateDemande(id: number, demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/demandes/${id}`, demande)
  }

  deleteDemande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demandes/${id}`)
  }

  exportDemandesToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demandes/excel`, { responseType: 'blob' })
  }

  createBatchDemandes(demandes: Demande[]): Observable<Demande[]> {
    return this.http.post<Demande[]>(`${this.apiUrl}/demandes/batch`, demandes)
  }

  // Demandes Delegue
  getAllDemandesDelegue(): Observable<DemandeDelegue[]> {
    return this.http.get<DemandeDelegue[]>(`${this.apiUrl}/demandes_delegue`)
  }

  getDemandeDelegueById(id: number): Observable<DemandeDelegue> {
    return this.http.get<DemandeDelegue>(`${this.apiUrl}/demandes_delegue/${id}`)
  }

  createDemandeDelegue(demande: DemandeDelegue): Observable<DemandeDelegue> {
    return this.http.post<DemandeDelegue>(`${this.apiUrl}/demandes_delegue`, demande)
  }

  updateDemandeDelegue(id: number, demande: DemandeDelegue): Observable<DemandeDelegue> {
    return this.http.put<DemandeDelegue>(`${this.apiUrl}/demandes_delegue/${id}`, demande)
  }

  deleteDemandeDelegue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demandes_delegue/${id}`)
  }

  exportDemandesDelegueToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demandes_delegue/excel`, { responseType: 'blob' })
  }

  createBatchDemandesDelegue(demandes: DemandeDelegue[]): Observable<DemandeDelegue[]> {
    return this.http.post<DemandeDelegue[]>(`${this.apiUrl}/demandes_delegue/batch`, demandes)
  }

  // Demandes Finale
  getAllDemandesFinale(): Observable<DemandeFinale[]> {
    return this.http.get<DemandeFinale[]>(`${this.apiUrl}/demandes_finale`)
  }

  getDemandeFinaleById(id: number): Observable<DemandeFinale> {
    return this.http.get<DemandeFinale>(`${this.apiUrl}/demandes_finale/${id}`)
  }

  createDemandeFinale(demande: DemandeFinale): Observable<DemandeFinale> {
    return this.http.post<DemandeFinale>(`${this.apiUrl}/demandes_finale`, demande)
  }

  updateDemandeFinale(id: number, demande: DemandeFinale): Observable<DemandeFinale> {
    return this.http.put<DemandeFinale>(`${this.apiUrl}/demandes_finale/${id}`, demande)
  }

  deleteDemandeFinale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demandes_finale/${id}`)
  }

  exportDemandesFinaleToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demandes_finale/excel`, { responseType: 'blob' })
  }

  createBatchDemandesFinale(demandes: DemandeFinale[]): Observable<DemandeFinale[]> {
    return this.http.post<DemandeFinale[]>(`${this.apiUrl}/demandes_finale/batch`, demandes)
  }
  setFinalDecision(id: number, decision: string, managerId?: number): Observable<DemandeFinale> {
    const params = new URLSearchParams();
    params.set('decision', decision);
    if (managerId !== undefined) {
      params.set('managerId', managerId.toString());
    }

    return this.http.put<DemandeFinale>(
      `${this.apiUrl}/demandes_finale/${id}/decision?${params.toString()}`,
      {}
    );
  }


  approveDemande(id: number, managerId?: number): Observable<DemandeFinale> {
    return this.setFinalDecision(id, 'APPROVED', managerId);
  }

  rejectDemande(id: number, managerId?: number): Observable<DemandeFinale> {
    return this.setFinalDecision(id, 'REJECTED', managerId);
  }


  // Demandes Te
  getAllDemandesTe(): Observable<DemandeTe[]> {
    return this.http.get<DemandeTe[]>(`${this.apiUrl}/demandes_te`)
  }

  getDemandeTeById(id: number): Observable<DemandeTe> {
    return this.http.get<DemandeTe>(`${this.apiUrl}/demandes_te/${id}`)
  }

  createDemandeTe(demande: DemandeTe): Observable<DemandeTe> {
    return this.http.post<DemandeTe>(`${this.apiUrl}/demandes_te`, demande)
  }

  updateDemandeTe(id: number, demande: DemandeTe): Observable<DemandeTe> {
    return this.http.put<DemandeTe>(`${this.apiUrl}/demandes_te/${id}`, demande)
  }

  deleteDemandeTe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demandes_te/${id}`)
  }

  exportDemandesToExcelTe(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demandes_te/excel`, { responseType: 'blob' })
  }

  createBatchDemandesTe(demandes: DemandeTe[]): Observable<DemandeTe[]> {
    return this.http.post<DemandeTe[]>(`${this.apiUrl}/demandes_te/batch`, demandes)
  }
}

