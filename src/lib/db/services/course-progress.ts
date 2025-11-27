// Course progress database service
// Replaces course-progress-mock.ts

import { collections, dbHelpers } from '../index';
import type { CourseProgress, CourseModule } from '../types';
import { logger } from '@/lib/logger';

export async function initializeProgress(userId: string): Promise<CourseProgress> {
  try {
    const existing = await getCourseProgress(userId);
    if (existing) return existing;
    
    // Get all course modules
    const modulesSnapshot = await collections.courseModules()
      .orderBy('week', 'asc')
      .orderBy('order', 'asc')
      .get();
    
    const allModules = modulesSnapshot.docs.map(doc => doc.data() as CourseModule);
    
    const progress: CourseProgress = {
      userId,
      progress: 0,
      modules: allModules.map(m => ({
        moduleId: m.id,
        completed: false,
      })),
      totalModules: allModules.length,
      completedModules: 0,
      startedAt: dbHelpers.timestamp(),
      updatedAt: dbHelpers.timestamp(),
    };
    
    await collections.courseProgress().doc(userId).set(progress);
    
    logger.info('Course progress initialized', {
      userId,
      totalModules: progress.totalModules,
    });
    
    return progress;
  } catch (error: any) {
    logger.error('Failed to initialize progress', error);
    throw error;
  }
}

export async function getCourseProgress(userId: string): Promise<CourseProgress | null> {
  try {
    const doc = await collections.courseProgress().doc(userId).get();
    if (!doc.exists) return null;
    
    return {
      ...doc.data(),
      userId: doc.id,
    } as CourseProgress;
  } catch (error: any) {
    logger.error('Failed to get course progress', error);
    throw error;
  }
}

export async function completeModule(
  userId: string,
  moduleId: string
): Promise<CourseProgress> {
  try {
    let progress = await getCourseProgress(userId);
    
    if (!progress) {
      progress = await initializeProgress(userId);
    }
    
    const moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
    if (moduleProgress && !moduleProgress.completed) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = dbHelpers.timestamp();
      if (!moduleProgress.startedAt) {
        moduleProgress.startedAt = dbHelpers.timestamp();
      }
      
      progress.completedModules = progress.modules.filter(m => m.completed).length;
      progress.progress = Math.round((progress.completedModules / progress.totalModules) * 100);
      
      if (progress.progress === 100 && !progress.completedAt) {
        progress.completedAt = dbHelpers.timestamp();
      }
      
      progress.updatedAt = dbHelpers.timestamp();
      
      await collections.courseProgress().doc(userId).set(progress);
      
      logger.info('Module completed', {
        userId,
        moduleId,
        progress: progress.progress,
      });
    }
    
    return progress;
  } catch (error: any) {
    logger.error('Failed to complete module', error);
    throw error;
  }
}

export async function isCourseCompleted(userId: string): Promise<boolean> {
  try {
    const progress = await getCourseProgress(userId);
    return progress ? progress.progress >= 100 : false;
  } catch (error: any) {
    logger.error('Failed to check course completion', error);
    return false;
  }
}

// Course Module CRUD
export async function createCourseModule(
  module: Omit<CourseModule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CourseModule> {
  try {
    const docData = dbHelpers.createDoc(module);
    const docRef = await collections.courseModules().add(docData);
    
    return {
      id: docRef.id,
      ...docData,
    } as CourseModule;
  } catch (error: any) {
    logger.error('Failed to create course module', error);
    throw error;
  }
}

export async function getCourseModuleById(id: string): Promise<CourseModule | null> {
  try {
    const doc = await collections.courseModules().doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data(),
    } as CourseModule;
  } catch (error: any) {
    logger.error('Failed to get course module', error);
    throw error;
  }
}

export async function getAllCourseModules(): Promise<CourseModule[]> {
  try {
    const snapshot = await collections.courseModules()
      .orderBy('week', 'asc')
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as CourseModule));
  } catch (error: any) {
    logger.error('Failed to get all course modules', error);
    throw error;
  }
}

export async function getModulesByWeek(week: number): Promise<CourseModule[]> {
  try {
    const snapshot = await collections.courseModules()
      .where('week', '==', week)
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as CourseModule));
  } catch (error: any) {
    logger.error('Failed to get modules by week', error);
    throw error;
  }
}

