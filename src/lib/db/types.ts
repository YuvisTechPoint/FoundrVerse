// Database types for Firestore
// These types define the structure of documents stored in Firestore

export interface User {
  uid: string; // Firebase Auth UID (document ID)
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  college?: string;
  year?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  provider?: string; // 'google' | 'email'
}

export interface Payment {
  id: string; // Document ID
  orderId: string; // Razorpay order ID
  paymentId?: string; // Razorpay payment ID
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  userId?: string;
  userEmail?: string;
  courseId?: string;
  cohort?: string;
  receiptId?: string;
  idempotencyKey?: string;
  method?: string;
  notes?: Record<string, any>;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  refunds?: Refund[];
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  refundId: string; // Razorpay refund ID
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  reason?: string;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'reading' | 'assignment';
  week: number;
  order: number; // Order within week
  duration?: string;
  videoUrl?: string;
  youtubeId?: string;
  readingContent?: string;
  readingUrl?: string;
  assignmentId?: string; // Link to assignment if type is 'assignment'
  prerequisites?: string[]; // Array of module IDs
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  userId: string; // Document ID
  progress: number; // 0-100
  modules: {
    moduleId: string;
    completed: boolean;
    completedAt?: string;
    startedAt?: string;
  }[];
  totalModules: number;
  completedModules: number;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface Assignment {
  id: string; // Document ID
  title: string;
  description: string;
  week: number;
  type: 'assignment' | 'project';
  dueDate?: string;
  maxScore?: number;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string; // Document ID
  assignmentId: string;
  userId: string;
  userEmail: string;
  userName: string;
  files: FileSubmission[];
  description?: string;
  status: 'draft' | 'submitted' | 'graded' | 'revision_required';
  score?: number;
  maxScore?: number;
  feedback?: string;
  gradedBy?: string; // Admin UID
  gradedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileSubmission {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PitchSubmission {
  id: string; // Document ID
  userId: string;
  userEmail: string;
  userName: string;
  startupName: string;
  description: string;
  market?: string;
  problem?: string;
  solution?: string;
  deckFiles: FileSubmission[];
  status: 'draft' | 'submitted' | 'scheduled' | 'reviewed' | 'funded' | 'rejected';
  scheduledDate?: string;
  reviewDate?: string;
  investorFeedback?: string;
  fundingAmount?: number;
  reviewedBy?: string; // Admin UID
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Internship {
  id: string; // Document ID
  company: string;
  role: string;
  description: string;
  location: string;
  duration: string;
  requirements: string[];
  available: boolean;
  maxPositions?: number;
  filledPositions?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InternshipApplication {
  id: string; // Document ID
  internshipId: string;
  userId: string;
  userEmail: string;
  userName: string;
  coverLetter?: string;
  resume?: FileSubmission;
  portfolio?: FileSubmission[];
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  reviewedBy?: string; // Admin UID
  reviewedAt?: string;
  feedback?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string; // Document ID
  userId: string;
  userEmail: string;
  userName: string;
  certificateUrl: string;
  certificateNumber: string;
  issuedAt: string;
  issuedBy: string; // Admin UID
  verified: boolean;
  createdAt: string;
}

export interface Cohort {
  id: string; // Document ID (e.g., 'Batch-2024-01')
  name: string;
  startDate: string;
  endDate?: string;
  maxStudents?: number;
  currentStudents: number;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string; // Document ID
  userId: string;
  type: 'assignment_graded' | 'assignment_reminder' | 'pitch_reviewed' | 'internship_approved' | 'certificate_issued' | 'payment_confirmed' | 'general';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface CourseContent {
  id: string; // Document ID
  moduleId: string;
  type: 'video' | 'reading' | 'file';
  title: string;
  content: string; // URL or content
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Webhook event tracking for idempotency
export interface WebhookEvent {
  id: string; // Event ID (document ID)
  processed: boolean;
  processedAt?: string;
  createdAt: string;
}

