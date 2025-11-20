import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
  statusCode?: number
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
  // Default status code
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400
  } else if (err.name === 'ConflictError') {
    statusCode = 409
  } else if (err.name === 'NotFoundError') {
    statusCode = 404
  }

  console.error(`[${new Date().toISOString()}] Error:`, err)

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
