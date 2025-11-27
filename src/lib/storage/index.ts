// File storage utilities
// Uses Firebase Storage for file uploads

import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../firebaseAdmin';
import { logger } from '../logger';

function getStorageInstance() {
  return getStorage(getFirebaseAdminApp());
}

function getBucket() {
  return getStorageInstance().bucket();
}

export interface UploadFileOptions {
  file: Buffer | Uint8Array;
  fileName: string;
  mimeType: string;
  folder?: string;
  userId?: string;
}

export interface UploadedFile {
  url: string;
  path: string;
  fileName: string;
  size: number;
  mimeType: string;
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(options: UploadFileOptions): Promise<UploadedFile> {
  try {
    const { file, fileName, mimeType, folder, userId } = options;
    
    // Create file path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = folder
      ? `${folder}/${userId || 'anonymous'}/${timestamp}_${sanitizedFileName}`
      : `uploads/${userId || 'anonymous'}/${timestamp}_${sanitizedFileName}`;
    
    // Upload file
    const bucket = getBucket();
    const fileRef = bucket.file(filePath);
    
    await fileRef.save(file, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          userId: userId || 'anonymous',
        },
      },
    });
    
    // Make file publicly readable (or use signed URLs for private files)
    await fileRef.makePublic();
    
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    logger.info('File uploaded successfully', {
      fileName,
      filePath,
      size: file.length,
    });
    
    return {
      url: publicUrl,
      path: filePath,
      fileName: sanitizedFileName,
      size: file.length,
      mimeType,
    };
  } catch (error: any) {
    logger.error('Failed to upload file', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fileRef = getBucket().file(filePath);
    await fileRef.delete();
    logger.info('File deleted successfully', { filePath });
  } catch (error: any) {
    logger.error('Failed to delete file', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
}

/**
 * Generate a signed URL for private file access
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const fileRef = getBucket().file(filePath);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });
    return url;
  } catch (error: any) {
    logger.error('Failed to generate signed URL', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: UploadFileOptions[]
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

