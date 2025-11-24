/**
 * Organization management utilities using Firestore
 */

import { getFirebaseAdminFirestore } from "./firebaseAdmin";
import { logger } from "./logger";

export interface Organization {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  adminUid: string;
  adminEmail: string;
  status: "active" | "suspended" | "pending";
}

/**
 * Create a new organization in Firestore
 */
export async function createOrganization(data: {
  name: string;
  email: string;
  adminUid: string;
  adminEmail: string;
}): Promise<Organization> {
  const db = getFirebaseAdminFirestore();
  const now = new Date().toISOString();

  // Check if organization with same name or email already exists
  const existingByName = await db
    .collection("organizations")
    .where("name", "==", data.name)
    .limit(1)
    .get();

  if (!existingByName.empty) {
    throw new Error("An organization with this name already exists");
  }

  const existingByEmail = await db
    .collection("organizations")
    .where("email", "==", data.email.toLowerCase())
    .limit(1)
    .get();

  if (!existingByEmail.empty) {
    throw new Error("An organization with this email already exists");
  }

  // Check if admin already has an organization
  const existingByAdmin = await db
    .collection("organizations")
    .where("adminUid", "==", data.adminUid)
    .limit(1)
    .get();

  if (!existingByAdmin.empty) {
    throw new Error("This admin already has an organization");
  }

  const organizationData: Omit<Organization, "id"> = {
    name: data.name,
    email: data.email.toLowerCase(),
    adminUid: data.adminUid,
    adminEmail: data.adminEmail.toLowerCase(),
    createdAt: now,
    updatedAt: now,
    status: "active",
  };

  const docRef = await db.collection("organizations").add(organizationData);

  logger.info("Organization created", {
    organizationId: docRef.id,
    name: data.name,
    adminUid: data.adminUid,
  });

  return {
    id: docRef.id,
    ...organizationData,
  };
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  const db = getFirebaseAdminFirestore();
  const doc = await db.collection("organizations").doc(organizationId).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...(doc.data() as Omit<Organization, "id">),
  };
}

/**
 * Get organization by admin UID
 */
export async function getOrganizationByAdminUid(adminUid: string): Promise<Organization | null> {
  const db = getFirebaseAdminFirestore();
  const snapshot = await db
    .collection("organizations")
    .where("adminUid", "==", adminUid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Omit<Organization, "id">),
  };
}

/**
 * Get organization by name
 */
export async function getOrganizationByName(name: string): Promise<Organization | null> {
  const db = getFirebaseAdminFirestore();
  const snapshot = await db
    .collection("organizations")
    .where("name", "==", name)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Omit<Organization, "id">),
  };
}

/**
 * Verify admin belongs to organization
 */
export async function verifyAdminOrganization(
  adminUid: string,
  organizationName: string
): Promise<Organization | null> {
  const organization = await getOrganizationByName(organizationName);

  if (!organization) {
    return null;
  }

  if (organization.adminUid !== adminUid) {
    return null;
  }

  if (organization.status !== "active") {
    throw new Error("Organization is not active");
  }

  return organization;
}

/**
 * Update organization
 */
export async function updateOrganization(
  organizationId: string,
  updates: Partial<Omit<Organization, "id" | "createdAt">>
): Promise<Organization> {
  const db = getFirebaseAdminFirestore();
  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("organizations").doc(organizationId).update(updateData);

  const updated = await getOrganizationById(organizationId);
  if (!updated) {
    throw new Error("Organization not found after update");
  }

  return updated;
}

