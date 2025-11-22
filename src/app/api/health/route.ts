import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api-utils';

/**
 * Health check endpoint
 * Used for monitoring and load balancer health checks
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };

  return successResponse(health);
}

