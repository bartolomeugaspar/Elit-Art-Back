import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

export class AuthService {
  static generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    })
  }

  static async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const user = new User({
      name,
      email,
      password,
      role: 'user',
    })

    await user.save()

    const token = this.generateToken(user._id.toString(), user.role)

    return { user, token }
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password')
    }

    const token = this.generateToken(user._id.toString(), user.role)

    return { user, token }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId)
  }

  static async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updates, { new: true })
  }
}
