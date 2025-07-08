export interface Ilot {
  id?: number
  name: string
  description?: string
  location?: string
  machines?: Machine[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Machine {
  id?: number
  name: string
  type?: string
  model?: string
  serialNumber?: string
  ilotId?: number
  ilot?: Ilot
  programmes?: Programme[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Programme {
  id?: number
  name: string
  description?: string
  duration?: number
  machineId?: number
  machine?: Machine
  createdAt?: Date
  updatedAt?: Date
}
