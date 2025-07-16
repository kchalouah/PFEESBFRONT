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
  machine?: Machine
  createdAt?: Date
  updatedAt?: Date
}

// Utility function to ensure no blank fields in frontend
export function fillProgrammeDefaults(programme: Programme): Programme {
  return {
    ...programme,
    description: programme.description ?? '-',
    duration: programme.duration ?? 0,
    machine: programme.machine ?? { name: '-', id: 0 },
    createdAt: programme.createdAt ?? new Date(),
    updatedAt: programme.updatedAt ?? new Date(),
    name: programme.name ?? '-',
    id: programme.id ?? 0,
  }
}
