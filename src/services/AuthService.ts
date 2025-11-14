import jwt from 'jsonwebtoken'
import { supabase } from '../config/database'
import { IUser, IUserInput, hashPassword, comparePassword } from '../models/User'

export class AuthService {
  static generateToken(userId: string, role: string): string {
    const secret = (process.env.JWT_SECRET || 'secret') as string
    return jwt.sign({ userId, role }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    })
  }

  static async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        is_email_verified: false,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const token = this.generateToken(user.id, user.role)

    return { user, token }
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const token = this.generateToken(user.id, user.role)

    return { user, token }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return null
    }

    return user
  }

  static async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return null
    }

    return user
  }
}
