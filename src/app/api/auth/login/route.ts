import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const adminAuth = getFirebaseAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);

    // Create session cookie
    const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    return NextResponse.json({
      success: true,
      sessionCookie,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    
    let errorMessage = "Failed to sign in";
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Invalid password";
    } else if (error.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}

