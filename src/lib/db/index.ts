// Database utilities for Firestore
// Provides typed access to Firestore collections

import { getFirebaseAdminFirestore } from '../firebaseAdmin';
import type {
  User,
  Payment,
  CourseProgress,
  Assignment,
  AssignmentSubmission,
  PitchSubmission,
  Internship,
  InternshipApplication,
  Certificate,
  Cohort,
  Notification,
  CourseModule,
  WebhookEvent,
} from './types';

const db = () => getFirebaseAdminFirestore();

// Collection references
export const collections = {
  users: () => db().collection('users'),
  payments: () => db().collection('payments'),
  courseProgress: () => db().collection('courseProgress'),
  assignments: () => db().collection('assignments'),
  assignmentSubmissions: () => db().collection('assignmentSubmissions'),
  pitchSubmissions: () => db().collection('pitchSubmissions'),
  internships: () => db().collection('internships'),
  internshipApplications: () => db().collection('internshipApplications'),
  certificates: () => db().collection('certificates'),
  cohorts: () => db().collection('cohorts'),
  notifications: () => db().collection('notifications'),
  courseModules: () => db().collection('courseModules'),
  webhookEvents: () => db().collection('webhookEvents'),
};

// Helper functions
export const dbHelpers = {
  timestamp: () => new Date().toISOString(),
  
  // Convert Firestore timestamp to ISO string
  toISO: (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    if (timestamp.toDate) return timestamp.toDate().toISOString();
    if (timestamp instanceof Date) return timestamp.toISOString();
    return timestamp;
  },
  
  // Create document with timestamps
  createDoc: (data: any) => ({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  
  // Update document with timestamp
  updateDoc: (data: any) => ({
    ...data,
    updatedAt: new Date().toISOString(),
  }),
};

export { db };

