import { NextRequest, NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';
import { getAllPayments } from '@/data/payments-mock';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const payments = getAllPayments();

    // Prepare CSV data
    const csvData = payments.map((payment) => ({
      'Order ID': payment.orderId,
      'Payment ID': payment.paymentId || '',
      'Amount': payment.amount,
      'Currency': payment.currency,
      'Status': payment.status,
      'User Email': payment.userEmail || '',
      'User ID': payment.userId || '',
      'Course ID': payment.courseId || '',
      'Cohort': payment.cohort || '',
      'Payment Method': payment.method || '',
      'Paid At': payment.paidAt || '',
      'Created At': payment.createdAt,
      'Updated At': payment.updatedAt,
    }));

    // Generate CSV
    const csv = stringify(csvData, {
      header: true,
      columns: Object.keys(csvData[0] || {}),
    });

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting payments:', error);
    return NextResponse.json(
      { error: 'Failed to export payments' },
      { status: 500 }
    );
  }
}

