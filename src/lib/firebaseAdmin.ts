import { readFileSync } from "fs";
import { isAbsolute, resolve } from "path";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let firebaseAdminApp: App | null = null;

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: string;
};

function parseServiceAccount(): ServiceAccount {
  const inlineKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (inlineKey) {
    const parsed = JSON.parse(inlineKey);
    if (typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  if (filePath) {
    const resolvedPath = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
    const fileContents = readFileSync(resolvedPath, "utf-8");
    const parsed = JSON.parse(fileContents);
    if (typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  throw new Error("Firebase admin credentials missing. Provide FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH.");
}

export function getFirebaseAdminApp() {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  if (!getApps().length) {
    const serviceAccount = parseServiceAccount();
    firebaseAdminApp = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id,
    });
  } else {
    firebaseAdminApp = getApps()[0]!;
  }

  return firebaseAdminApp;
}

export function getFirebaseAdminAuth() {
  const app = getFirebaseAdminApp();
  return getAuth(app);
}

export function getFirebaseAdminFirestore() {
  const app = getFirebaseAdminApp();
  return getFirestore(app);
}
