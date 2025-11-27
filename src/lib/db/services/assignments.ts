// Assignment database service

import { collections, dbHelpers } from '../index';
import type { Assignment, AssignmentSubmission } from '../types';
import { logger } from '@/lib/logger';

// Assignment CRUD
export async function createAssignment(
  assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Assignment> {
  try {
    const docData = dbHelpers.createDoc(assignment);
    const docRef = await collections.assignments().add(docData);
    
    return {
      id: docRef.id,
      ...docData,
    } as Assignment;
  } catch (error: any) {
    logger.error('Failed to create assignment', error);
    throw error;
  }
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  try {
    const doc = await collections.assignments().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as Assignment;
  } catch (error: any) {
    logger.error('Failed to get assignment', error);
    throw error;
  }
}

export async function getAllAssignments(): Promise<Assignment[]> {
  try {
    const snapshot = await collections.assignments()
      .orderBy('week', 'asc')
      .orderBy('createdAt', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Assignment));
  } catch (error: any) {
    logger.error('Failed to get all assignments', error);
    throw error;
  }
}

export async function getAssignmentsByWeek(week: number): Promise<Assignment[]> {
  try {
    const snapshot = await collections.assignments()
      .where('week', '==', week)
      .orderBy('createdAt', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Assignment));
  } catch (error: any) {
    logger.error('Failed to get assignments by week', error);
    throw error;
  }
}

// Assignment Submission CRUD
export async function createSubmission(
  submission: Omit<AssignmentSubmission, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AssignmentSubmission> {
  try {
    const docData = dbHelpers.createDoc({
      ...submission,
      submittedAt: submission.status === 'submitted' ? dbHelpers.timestamp() : undefined,
    });
    const docRef = await collections.assignmentSubmissions().add(docData);
    
    logger.info('Assignment submission created', {
      submissionId: docRef.id,
      assignmentId: submission.assignmentId,
      userId: submission.userId,
    });
    
    return {
      id: docRef.id,
      ...docData,
    } as AssignmentSubmission;
  } catch (error: any) {
    logger.error('Failed to create submission', error);
    throw error;
  }
}

export async function getSubmissionById(id: string): Promise<AssignmentSubmission | null> {
  try {
    const doc = await collections.assignmentSubmissions().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as AssignmentSubmission;
  } catch (error: any) {
    logger.error('Failed to get submission', error);
    throw error;
  }
}

export async function getSubmissionsByAssignment(
  assignmentId: string
): Promise<AssignmentSubmission[]> {
  try {
    const snapshot = await collections.assignmentSubmissions()
      .where('assignmentId', '==', assignmentId)
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AssignmentSubmission));
  } catch (error: any) {
    logger.error('Failed to get submissions by assignment', error);
    throw error;
  }
}

export async function getSubmissionsByUser(
  userId: string
): Promise<AssignmentSubmission[]> {
  try {
    const snapshot = await collections.assignmentSubmissions()
      .where('userId', '==', userId)
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AssignmentSubmission));
  } catch (error: any) {
    logger.error('Failed to get submissions by user', error);
    throw error;
  }
}

export async function getUserSubmissionForAssignment(
  userId: string,
  assignmentId: string
): Promise<AssignmentSubmission | null> {
  try {
    const snapshot = await collections.assignmentSubmissions()
      .where('userId', '==', userId)
      .where('assignmentId', '==', assignmentId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0]!;
    return {
      id: doc.id,
      ...doc.data(),
    } as AssignmentSubmission;
  } catch (error: any) {
    logger.error('Failed to get user submission for assignment', error);
    throw error;
  }
}

export async function updateSubmission(
  id: string,
  updates: Partial<AssignmentSubmission>
): Promise<AssignmentSubmission | null> {
  try {
    const docRef = collections.assignmentSubmissions().doc(id);
    
    // If status changed to submitted, set submittedAt
    if (updates.status === 'submitted' && !updates.submittedAt) {
      updates.submittedAt = dbHelpers.timestamp();
    }
    
    // If status changed to graded, set gradedAt
    if (updates.status === 'graded' && !updates.gradedAt) {
      updates.gradedAt = dbHelpers.timestamp();
    }
    
    const updateData = dbHelpers.updateDoc(updates);
    await docRef.update(updateData);
    
    logger.info('Submission updated', {
      submissionId: id,
      updates: Object.keys(updates),
    });
    
    return getSubmissionById(id);
  } catch (error: any) {
    logger.error('Failed to update submission', error);
    throw error;
  }
}

export async function gradeSubmission(
  id: string,
  gradeData: {
    score: number;
    maxScore: number;
    feedback?: string;
    gradedBy: string;
    status: 'graded' | 'revision_required';
  }
): Promise<AssignmentSubmission | null> {
  return updateSubmission(id, {
    ...gradeData,
    gradedAt: dbHelpers.timestamp(),
    status: gradeData.status,
  });
}

export async function getAllSubmissions(): Promise<AssignmentSubmission[]> {
  try {
    const snapshot = await collections.assignmentSubmissions()
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AssignmentSubmission));
  } catch (error: any) {
    logger.error('Failed to get all submissions', error);
    throw error;
  }
}

