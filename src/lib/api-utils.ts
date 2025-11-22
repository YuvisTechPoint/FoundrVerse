/**
 * API utility functions for consistent error handling and responses
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: unknown;
}

export class ApiException extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Creates a standardized success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  error: string | ApiException | Error | unknown,
  statusCode?: number
): NextResponse {
  if (error instanceof ApiException) {
    logger.error('API Error', error, { code: error.code, details: error.details });
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && error.details
          ? { details: error.details }
          : {}),
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    const status = statusCode || 500;
    logger.error('API Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
      },
      { status }
    );
  }

  const status = statusCode || 500;
  const message = typeof error === 'string' ? error : 'An unexpected error occurred';
  logger.error('API Error', new Error(message));
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/**
 * Wraps an API route handler with error handling
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/**
 * Validates required fields in request body
 */
export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): { isValid: boolean; missing: string[] } {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Validates numeric input
 */
export function validateNumber(
  value: unknown,
  min?: number,
  max?: number
): { isValid: boolean; error?: string } {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return { isValid: false, error: 'Value must be a number' };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid number format' };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: unknown): { isValid: boolean; error?: string } {
  if (typeof email !== 'string') {
    return { isValid: false, error: 'Email must be a string' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Parses pagination parameters from URL
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

