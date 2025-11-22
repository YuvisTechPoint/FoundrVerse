import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { idToken, name, phone } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required. User must be created on client side first." },
        { status: 400 }
      );
    }

    // Verify the ID token from client-side signup
    const adminAuth = getFirebaseAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);

    // Update user profile with additional info
    await adminAuth.updateUser(decodedToken.uid, {
      displayName: name || decodedToken.name,
      phoneNumber: phone || undefined,
    });

    // Set custom claims for additional user data
    await adminAuth.setCustomUserClaims(decodedToken.uid, {
      name: name || decodedToken.name,
      phone: phone || null,
    });

    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    let errorMessage = "Failed to complete signup";
    if (error.code === "auth/invalid-id-token") {
      errorMessage = "Invalid authentication token";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

