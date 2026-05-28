import { Response } from 'express';
import type { ApiResponse } from '@ai-fitness-coach/shared';

/**
 * Send a standardized success JSON response.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(statusCode).json(body);
}

/**
 * Send a standardized error JSON response.
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, string[]>
): void {
  const body: ApiResponse = {
    success: false,
    error: { code, message, details },
  };
  res.status(statusCode).json(body);
}
