// Internship database service

import { collections, dbHelpers } from '../index';
import type { Internship, InternshipApplication } from '../types';
import { logger } from '@/lib/logger';

// Internship CRUD
export async function createInternship(
  internship: Omit<Internship, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Internship> {
  try {
    const docData = dbHelpers.createDoc({
      ...internship,
      filledPositions: internship.filledPositions || 0,
    });
    const docRef = await collections.internships().add(docData);
    
    return {
      id: docRef.id,
      ...docData,
    } as Internship;
  } catch (error: any) {
    logger.error('Failed to create internship', error);
    throw error;
  }
}

export async function getInternshipById(id: string): Promise<Internship | null> {
  try {
    const doc = await collections.internships().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as Internship;
  } catch (error: any) {
    logger.error('Failed to get internship', error);
    throw error;
  }
}

export async function getAllInternships(): Promise<Internship[]> {
  try {
    const snapshot = await collections.internships()
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Internship));
  } catch (error: any) {
    logger.error('Failed to get all internships', error);
    throw error;
  }
}

export async function getAvailableInternships(): Promise<Internship[]> {
  try {
    const snapshot = await collections.internships()
      .where('available', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Internship));
  } catch (error: any) {
    logger.error('Failed to get available internships', error);
    throw error;
  }
}

// Internship Application CRUD
export async function createInternshipApplication(
  application: Omit<InternshipApplication, 'id' | 'createdAt' | 'updatedAt'>
): Promise<InternshipApplication> {
  try {
    const docData = dbHelpers.createDoc({
      ...application,
      appliedAt: dbHelpers.timestamp(),
    });
    const docRef = await collections.internshipApplications().add(docData);
    
    logger.info('Internship application created', {
      applicationId: docRef.id,
      internshipId: application.internshipId,
      userId: application.userId,
    });
    
    return {
      id: docRef.id,
      ...docData,
    } as InternshipApplication;
  } catch (error: any) {
    logger.error('Failed to create internship application', error);
    throw error;
  }
}

export async function getInternshipApplicationById(
  id: string
): Promise<InternshipApplication | null> {
  try {
    const doc = await collections.internshipApplications().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as InternshipApplication;
  } catch (error: any) {
    logger.error('Failed to get internship application', error);
    throw error;
  }
}

export async function getApplicationsByInternship(
  internshipId: string
): Promise<InternshipApplication[]> {
  try {
    const snapshot = await collections.internshipApplications()
      .where('internshipId', '==', internshipId)
      .orderBy('appliedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as InternshipApplication));
  } catch (error: any) {
    logger.error('Failed to get applications by internship', error);
    throw error;
  }
}

export async function getApplicationsByUser(
  userId: string
): Promise<InternshipApplication[]> {
  try {
    const snapshot = await collections.internshipApplications()
      .where('userId', '==', userId)
      .orderBy('appliedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as InternshipApplication));
  } catch (error: any) {
    logger.error('Failed to get applications by user', error);
    throw error;
  }
}

export async function getUserApplicationForInternship(
  userId: string,
  internshipId: string
): Promise<InternshipApplication | null> {
  try {
    const snapshot = await collections.internshipApplications()
      .where('userId', '==', userId)
      .where('internshipId', '==', internshipId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0]!;
    return {
      id: doc.id,
      ...doc.data(),
    } as InternshipApplication;
  } catch (error: any) {
    logger.error('Failed to get user application for internship', error);
    throw error;
  }
}

export async function updateInternshipApplication(
  id: string,
  updates: Partial<InternshipApplication>
): Promise<InternshipApplication | null> {
  try {
    const docRef = collections.internshipApplications().doc(id);
    
    // If status changed to reviewing, set reviewedAt
    if ((updates.status === 'accepted' || updates.status === 'rejected') && !updates.reviewedAt) {
      updates.reviewedAt = dbHelpers.timestamp();
    }
    
    const updateData = dbHelpers.updateDoc(updates);
    await docRef.update(updateData);
    
    logger.info('Internship application updated', {
      applicationId: id,
      updates: Object.keys(updates),
    });
    
    return getInternshipApplicationById(id);
  } catch (error: any) {
    logger.error('Failed to update internship application', error);
    throw error;
  }
}

