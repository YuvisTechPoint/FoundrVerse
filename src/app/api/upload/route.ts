import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/verifySession";
import { uploadFile } from "@/lib/storage";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const cookieStore = await request.cookies;
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";
    const fileName = (formData.get("fileName") as string) || file.name;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Firebase Storage
    const uploadedFile = await uploadFile({
      file: buffer,
      fileName: fileName || file.name,
      mimeType: file.type,
      folder,
      userId: decoded.uid,
    });

    logger.info("File uploaded successfully", {
      userId: decoded.uid,
      fileName: uploadedFile.fileName,
      folder,
    });

    return successResponse({
      id: uploadedFile.path,
      url: uploadedFile.url,
      fileName: uploadedFile.fileName,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
    });
  } catch (error: any) {
    logger.error("File upload failed", error);
    return errorResponse(error.message || "File upload failed", 500);
  }
});

