// Mock data for admin dashboard
// TODO: Replace with Prisma queries when backend is ready

export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  year: number;
  enrollmentStatus: 'pending_payment' | 'active' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  cohort: string;
  certificateIssued: boolean;
  internshipStatus: 'none' | 'eligible' | 'assigned' | 'completed';
  internshipCompany?: string;
  topPerformer: boolean;
  createdAt: string;
  lastActivity: string;
  progress: number; // 0-100
}

export interface RevenueData {
  month: string;
  revenue: number;
  students: number;
}

export interface CohortData {
  cohort: string;
  registrations: number;
  active: number;
  completed: number;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    college: 'IIT Delhi',
    year: 3,
    enrollmentStatus: 'active',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-01',
    certificateIssued: false,
    internshipStatus: 'eligible',
    topPerformer: true,
    createdAt: '2024-01-15',
    lastActivity: '2024-11-20',
    progress: 75,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    college: 'BITS Pilani',
    year: 2,
    enrollmentStatus: 'completed',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-01',
    certificateIssued: true,
    internshipStatus: 'assigned',
    internshipCompany: 'Mewayz',
    topPerformer: true,
    createdAt: '2024-01-10',
    lastActivity: '2024-11-21',
    progress: 100,
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    college: 'NIT Surat',
    year: 4,
    enrollmentStatus: 'active',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-02',
    certificateIssued: false,
    internshipStatus: 'none',
    topPerformer: false,
    createdAt: '2024-02-01',
    lastActivity: '2024-11-19',
    progress: 45,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    college: 'IIM Bangalore',
    year: 1,
    enrollmentStatus: 'pending_payment',
    paymentStatus: 'pending',
    amount: 1499,
    cohort: 'Batch 2024-02',
    certificateIssued: false,
    internshipStatus: 'none',
    topPerformer: false,
    createdAt: '2024-02-05',
    lastActivity: '2024-11-18',
    progress: 0,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    college: 'DTU',
    year: 3,
    enrollmentStatus: 'active',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-01',
    certificateIssued: false,
    internshipStatus: 'eligible',
    topPerformer: false,
    createdAt: '2024-01-20',
    lastActivity: '2024-11-21',
    progress: 60,
  },
  {
    id: '6',
    name: 'Anjali Mehta',
    email: 'anjali@example.com',
    college: 'IIT Bombay',
    year: 2,
    enrollmentStatus: 'completed',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-01',
    certificateIssued: true,
    internshipStatus: 'completed',
    internshipCompany: 'PhantomX',
    topPerformer: true,
    createdAt: '2024-01-12',
    lastActivity: '2024-11-20',
    progress: 100,
  },
  {
    id: '7',
    name: 'Rohit Verma',
    email: 'rohit@example.com',
    college: 'NIT Trichy',
    year: 4,
    enrollmentStatus: 'active',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-02',
    certificateIssued: false,
    internshipStatus: 'none',
    topPerformer: false,
    createdAt: '2024-02-10',
    lastActivity: '2024-11-19',
    progress: 30,
  },
  {
    id: '8',
    name: 'Kavya Nair',
    email: 'kavya@example.com',
    college: 'IIM Ahmedabad',
    year: 1,
    enrollmentStatus: 'active',
    paymentStatus: 'paid',
    amount: 1499,
    cohort: 'Batch 2024-03',
    certificateIssued: false,
    internshipStatus: 'none',
    topPerformer: false,
    createdAt: '2024-03-01',
    lastActivity: '2024-11-21',
    progress: 15,
  },
];

export const mockRevenueData: RevenueData[] = [
  { month: 'Dec 2023', revenue: 44970, students: 30 },
  { month: 'Jan 2024', revenue: 74950, students: 50 },
  { month: 'Feb 2024', revenue: 59960, students: 40 },
  { month: 'Mar 2024', revenue: 89940, students: 60 },
  { month: 'Apr 2024', revenue: 104930, students: 70 },
  { month: 'May 2024', revenue: 119920, students: 80 },
  { month: 'Jun 2024', revenue: 134910, students: 90 },
  { month: 'Jul 2024', revenue: 149900, students: 100 },
  { month: 'Aug 2024', revenue: 164890, students: 110 },
  { month: 'Sep 2024', revenue: 179880, students: 120 },
  { month: 'Oct 2024', revenue: 194870, students: 130 },
  { month: 'Nov 2024', revenue: 209860, students: 140 },
];

export const mockCohortData: CohortData[] = [
  { cohort: 'Batch 2024-01', registrations: 120, active: 95, completed: 25 },
  { cohort: 'Batch 2024-02', registrations: 150, active: 130, completed: 20 },
  { cohort: 'Batch 2024-03', registrations: 180, active: 175, completed: 5 },
];

export const mockOverview = {
  totalStudents: 450,
  activeStudents: 400,
  totalRevenue: 674550,
  conversionRate: 68.5,
  openInternships: 12,
};

