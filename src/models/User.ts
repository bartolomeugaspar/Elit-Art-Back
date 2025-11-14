import bcryptjs from 'bcryptjs'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  phone?: string
  profileImage?: string
  bio?: string
  role: 'user' | 'artist' | 'admin'
  isEmailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IUserInput {
  name: string
  email: string
  password: string
  phone?: string
  profileImage?: string
  bio?: string
  role?: 'user' | 'artist' | 'admin'
}

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

// Compare password utility
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}
