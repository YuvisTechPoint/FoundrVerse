/**
 * Authentication middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminAuth } from './firebaseAdmin';
import { errorResponse } from './api-utils';
import { logger } from './logger';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    isAdmin?: boolean;
  };
}

/**
 * Verifies Firebase session cookie and attaches user to request
 */
export async function verifyAuth(request: NextRequest): Promise<{
  user: { uid: string; email?: string; name?: string };
  error?: never;
} | {
  user?: never;
  error: NextResponse;
}> {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return {
        error: errorResponse('Authentication required', 401),
      };
    }

    const adminAuth = getFirebaseAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
    };
  } catch (error) {
    logger.warn('Authentication failed', { error });
    return {
      error: errorResponse('Invalid or expired session', 401),
    };
  }
}

/**
 * Verifies admin access (requires authentication + admin claim + organization)
 */
export async function verifyAdmin(request: NextRequest): Promise<{
  user: { uid: string; email?: string; name?: string; isAdmin: true; organizationId?: string; organizationName?: string };
  error?: never;
} | {
  user?: never;
  error: NextResponse;
}> {
  const authResult = await verifyAuth(request);
  if (authResult.error) {
    return authResult;
  }

  try {
    const adminAuth = getFirebaseAdminAuth();
    const user = await adminAuth.getUser(authResult.user.uid);
    const isAdmin = user.customClaims?.admin === true || user.customClaims?.role === 'admin';

    if (!isAdmin) {
      return {
        error: errorResponse('Admin access required', 403),
      };
    }

    // Verify organization exists and is active
    const organizationId = user.customClaims?.organizationId as string | undefined;
    if (organizationId) {
      try {
        const { getOrganizationById } = await import('@/lib/organizations');
        const organization = await getOrganizationById(organizationId);
        
        if (!organization) {
          logger.warn('Admin organization not found', { uid: authResult.user.uid, organizationId });
          return {
            error: errorResponse('Organization not found', 403),
          };
        }

        if (organization.status !== 'active') {
          logger.warn('Admin organization not active', { uid: authResult.user.uid, organizationId, status: organization.status });
          return {
            error: errorResponse('Organization is not active', 403),
          };
        }

        return {
          user: {
            ...authResult.user,
            isAdmin: true,
            organizationId: organization.id,
            organizationName: organization.name,
          },
        };
      } catch (orgError) {
        logger.error('Failed to verify organization', orgError);
        // Continue without organization verification if Firestore fails
      }
    }

    return {
      user: {
        ...authResult.user,
        isAdmin: true,
        organizationId: user.customClaims?.organizationId as string | undefined,
        organizationName: user.customClaims?.organizationName as string | undefined,
      },
    };
  } catch (error) {
    logger.error('Failed to verify admin status', error);
    return {
      error: errorResponse('Failed to verify admin access', 500),
    };
  }
}

/**
 * Wraps an API route handler with authentication
 */
export function withAuth<T extends [AuthenticatedRequest, ...unknown[]]>(
  handler: (request: AuthenticatedRequest, ...args: T extends [AuthenticatedRequest, ...infer Rest] ? Rest : never[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;

    return handler(authenticatedRequest, ...args as T extends [AuthenticatedRequest, ...infer Rest] ? Rest : never[]);
  };
}

/**
 * Wraps an API route handler with admin authentication
 */
export function withAdminAuth<T extends [AuthenticatedRequest, ...unknown[]]>(
  handler: (request: AuthenticatedRequest, ...args: T extends [AuthenticatedRequest, ...infer Rest] ? Rest : never[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;

    return handler(authenticatedRequest, ...args as T extends [AuthenticatedRequest, ...infer Rest] ? Rest : never[]);
  };
}

