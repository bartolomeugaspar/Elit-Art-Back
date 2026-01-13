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
    console.log('🔐 Middleware authenticate - Verificando autenticação...');
    console.log('📡 Request URL:', req.method, req.originalUrl);
    
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      console.log('❌ Token não fornecido');
      res.status(401).json({ message: 'No token provided' })
      return
    }

    console.log('🔑 Token recebido:', token.substring(0, 50) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    
    console.log('✅ Token decodificado:', decoded);
    
    // Handle both old format (userId) and new format (id)
    const userId = decoded.id || decoded.userId;
    const role = decoded.role;
    
    console.log('👤 User ID:', userId);
    console.log('🎭 Role:', role);
    
    if (!userId || !role) {
      console.log('❌ Token inválido - faltando userId ou role');
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
    
    console.log('✅ Autenticação bem-sucedida, user:', req.user);
    next()
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
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
