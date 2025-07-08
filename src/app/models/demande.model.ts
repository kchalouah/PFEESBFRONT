export interface Demande {
  id?: number
  title: string
  description: string
  status: string
  priority: string
  userId?: number
  user?: any
  machineId?: number
  machine?: any
  createdAt?: Date
  updatedAt?: Date
}

export interface DemandeDelegue extends Demande {
  delegatedTo?: number
  delegatedUser?: any
  delegationDate?: Date
}

export interface DemandeFinale extends Demande {
  finalDecision?: string
  finalDate?: Date
  approvedBy?: number
}

export interface DemandeTe extends Demande {
  teSpecificField?: string
  teStatus?: string
}
