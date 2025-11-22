import { NextRequest } from 'next/server';
import { getAllPayments } from '@/data/payments-mock';
import { withAdminAuth } from '@/lib/auth-middleware';
import { successResponse, parsePagination, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let payments = getAllPayments();

    // Filter by status
    if (status) {
      payments = payments.filter((p) => p.status === status);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.orderId.toLowerCase().includes(searchLower) ||
          (p.paymentId && p.paymentId.toLowerCase().includes(searchLower)) ||
          (p.userEmail && p.userEmail.toLowerCase().includes(searchLower)) ||
          (p.userId && p.userId.toLowerCase().includes(searchLower))
      );
    }

    // Sort by createdAt (newest first)
    payments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const paginated = payments.slice(offset, offset + limit);

    return successResponse({
      payments: paginated,
      total: payments.length,
      page,
      limit,
      totalPages: Math.ceil(payments.length / limit),
    });
  })
);

