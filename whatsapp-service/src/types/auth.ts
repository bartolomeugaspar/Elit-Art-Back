import { Request } from 'express'

export interface IAuthUser {
  id: string
  email: string
  role: 'admin' | 'artista' | 'user'
  isActive: boolean
}

export interface AuthRequest extends Request {
  user?: IAuthUser
  userId?: string
  userRole?: string
}
