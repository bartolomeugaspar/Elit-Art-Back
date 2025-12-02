import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface IAuthUser {
  id: string;
  email: string;
  role: 'admin' | 'artista' | 'user';
  isActive: boolean;
}

export interface AuthRequest extends Request {
  user?: IAuthUser;
  userId?: string;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    
    // Handle both old format (userId) and new format (id)
    const userId = decoded.id || decoded.userId;
    const role = decoded.role;
    
    if (!userId || !role) {
      res.status(401).json({ message: 'Invalid token format' })
      return
    }
    
    req.user = {
      id: userId,
      email: decoded.email || '',
      role: role,
      isActive: decoded.isActive !== false
    };
    req.userId = userId;
    req.userRole = role;
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
}
