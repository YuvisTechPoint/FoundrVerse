import { NextRequest, NextResponse } from 'next/server';
import { getAllPayments } from '@/data/payments-mock';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
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
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = payments.slice(start, end);

    return NextResponse.json({
      payments: paginated,
      total: payments.length,
      page,
      limit,
      totalPages: Math.ceil(payments.length / limit),
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

