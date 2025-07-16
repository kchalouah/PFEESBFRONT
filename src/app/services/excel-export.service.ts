import { Injectable } from '@angular/core'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Demande, DemandeDelegue, DemandeFinale, DemandeTe } from '../models/demande.model'
import { AppUser } from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {

  constructor() {}

  exportDemandesToExcel(demandes: Demande[] | DemandeDelegue[] | DemandeFinale[] | DemandeTe[], fileName: string): void {
    // Map demandes to flat objects suitable for Excel
    const data = demandes.map(d => this.mapDemandeForExport(d))

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Demandes': worksheet },
      SheetNames: ['Demandes'],
    }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.saveAsExcelFile(excelBuffer, fileName)
  }

  private mapDemandeForExport(d: any): any {
    return {
      ID: d.id ?? '',
      'OF Demande': d.of_demande ?? '',
      'Date Demande': this.formatDate(d.date_demande),
      Statut: d.status ?? '',
      'Durée (minutes)': d.duree_en_minutes ?? '',
      ETQ: d.etq ?? '',
      'Nombre Produit Contrôlé': d.nombre_produit_controle ?? '',
      'Started': d.started ? 'Oui' : 'Non',
      'Finished': d.finished ? 'Oui' : 'Non',
      Ilot: d.ilot?.name ?? '',
      Machine: d.machine?.name ?? '',
      Opérateur: this.formatUser(d.operateur),
      'Rôles Opérateur': this.formatRoles(d.operateur?.roles),
      Contrôleur: this.formatUser(d.controleur),
      'Rôles Contrôleur': this.formatRoles(d.controleur?.roles),
      // Extra fields for DemandeDelegue
      'Délégué à': this.formatUser(d.delegatedTo),
      'Date de Délégation': this.formatDate(d.delegationDate),
      // Extra fields for DemandeFinale
      'Décision Finale': d.finalDecision ?? '',
      'Date d\'Approbation': this.formatDate(d.approvedDate),
      Manager: this.formatUser(d.manager),
      'Rôles Manager': this.formatRoles(d.manager?.roles),
      // Extra fields for DemandeTe
      'Statut TE': d.teStatus ?? '',
      'Champ TE': d.teSpecificField ?? '',
    }
  }

  private formatUser(user?: AppUser): string {
    if (!user) return ''
    return `${user.firstName ?? '-'} ${user.lastName ?? '-'}`.trim()
  }

  private formatRoles(roles?: { roleName: string }[]): string {
    if (!roles || roles.length === 0) return ''
    return roles.map(r => r.roleName).join(', ')
  }

  private formatDate(date?: string | Date): string {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString('fr-FR') // French format, adjust locale as needed
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`)
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
