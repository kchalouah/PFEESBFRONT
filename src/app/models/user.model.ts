export interface AppUser {
  id?: number
  username: string
  email: string
  password?: string
  firstName: string
  lastName: string
  roles?: UserRole[]
  createdAt?: Date
  updatedAt?: Date
}

export interface UserRole {
  id?: number
  name: string
  description?: string
}
