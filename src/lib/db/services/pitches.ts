// Pitch submission database service

import { collections, dbHelpers } from '../index';
import type { PitchSubmission } from '../types';
import { logger } from '@/lib/logger';

export async function createPitchSubmission(
  submission: Omit<PitchSubmission, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PitchSubmission> {
  try {
    const docData = dbHelpers.createDoc({
      ...submission,
      submittedAt: submission.status === 'submitted' ? dbHelpers.timestamp() : undefined,
    });
    const docRef = await collections.pitchSubmissions().add(docData);
    
    logger.info('Pitch submission created', {
      submissionId: docRef.id,
      userId: submission.userId,
      startupName: submission.startupName,
    });
    
    return {
      id: docRef.id,
      ...docData,
    } as PitchSubmission;
  } catch (error: any) {
    logger.error('Failed to create pitch submission', error);
    throw error;
  }
}

export async function getPitchSubmissionById(id: string): Promise<PitchSubmission | null> {
  try {
    const doc = await collections.pitchSubmissions().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as PitchSubmission;
  } catch (error: any) {
    logger.error('Failed to get pitch submission', error);
    throw error;
  }
}

export async function getPitchSubmissionByUser(userId: string): Promise<PitchSubmission | null> {
  try {
    const snapshot = await collections.pitchSubmissions()
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0]!;
    return {
      id: doc.id,
      ...doc.data(),
    } as PitchSubmission;
  } catch (error: any) {
    logger.error('Failed to get pitch submission by user', error);
    throw error;
  }
}

export async function getAllPitchSubmissions(): Promise<PitchSubmission[]> {
  try {
    const snapshot = await collections.pitchSubmissions()
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as PitchSubmission));
  } catch (error: any) {
    logger.error('Failed to get all pitch submissions', error);
    throw error;
  }
}

export async function getPitchSubmissionsByStatus(
  status: PitchSubmission['status']
): Promise<PitchSubmission[]> {
  try {
    const snapshot = await collections.pitchSubmissions()
      .where('status', '==', status)
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as PitchSubmission));
  } catch (error: any) {
    logger.error('Failed to get pitch submissions by status', error);
    throw error;
  }
}

export async function updatePitchSubmission(
  id: string,
  updates: Partial<PitchSubmission>
): Promise<PitchSubmission | null> {
  try {
    const docRef = collections.pitchSubmissions().doc(id);
    
    // If status changed to scheduled, set scheduledDate
    if (updates.status === 'scheduled' && updates.scheduledDate && !updates.scheduledDate) {
      updates.scheduledDate = dbHelpers.timestamp();
    }
    
    // If status changed to reviewed, set reviewDate
    if ((updates.status === 'reviewed' || updates.status === 'funded' || updates.status === 'rejected') && !updates.reviewDate) {
      updates.reviewDate = dbHelpers.timestamp();
    }
    
    const updateData = dbHelpers.updateDoc(updates);
    await docRef.update(updateData);
    
    logger.info('Pitch submission updated', {
      submissionId: id,
      updates: Object.keys(updates),
    });
    
    return getPitchSubmissionById(id);
  } catch (error: any) {
    logger.error('Failed to update pitch submission', error);
    throw error;
  }
}

