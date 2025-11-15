import { Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';
import { AuthRequest } from './auth';

export const auditMiddleware = (entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Skip logging for GET requests or specific paths
    if (req.method === 'GET' || req.path.includes('audit-logs')) {
      return next();
    }

    // Get the original response methods
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Create a buffer to store the response data
    let responseBody: any;
    
    // Override response methods to capture the response
    res.send = function(body: any): any {
      responseBody = body;
      return originalSend.call(this, body);
    };
    
    res.json = function(body: any): any {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Log the request when the response is finished
    res.on('finish', async () => {
      try {
        const entityId = req.params.id || responseBody?.id;
        
        if (!entityId) {
          return;
        }

        let action = '';
        let oldValues = undefined;
        let newValues = undefined;
        const userId = req.user?.id;
        
        // Determine action type based on HTTP method
        switch (req.method) {
          case 'POST':
            action = 'CREATE';
            newValues = req.body;
            break;
          case 'PUT':
          case 'PATCH':
            action = 'UPDATE';
            // In a real app, you might want to fetch the old values from the database
            // For now, we'll just log the new values
            newValues = req.body;
            break;
          case 'DELETE':
            action = 'DELETE';
            // In a real app, you might want to log the deleted entity
            break;
          default:
            return;
        }

        // Log the action
        if (userId) {
          await AuditService.logUserAction(
            userId,
            `${entityType.toUpperCase()}_${action}`,
            entityType,
            entityId,
            req,
            oldValues,
            newValues
          );
        }
      } catch (error) {
        console.error('Error logging audit:', error);
      }
    });

    next();
  };
};
