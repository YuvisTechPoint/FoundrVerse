/**
 * Unit tests for Firebase session helper.
 * Run with: npm test tests/auth/verify.test.ts
 */

import { verifySessionCookie } from "@/lib/verifySession";

jest.mock("@/lib/firebaseAdmin", () => {
  return {
    getFirebaseAdminAuth: jest.fn(() => ({
      verifySessionCookie: jest.fn(async (cookie: string) => {
        if (cookie === "valid-session") {
          return { uid: "test-user", email: "test@example.com" };
        }
        throw new Error("invalid");
      }),
    })),
  };
});

describe("verifySessionCookie", () => {
  beforeAll(() => {
    process.env.SESSION_COOKIE_SECRET = "abcdefghijklmnopqrstuvwxyz123456";
  });

  it("returns claims for a valid cookie and signature", async () => {
    const crypto = require("crypto");
    const sig = crypto
      .createHmac("sha256", process.env.SESSION_COOKIE_SECRET!)
      .update("valid-session")
      .digest("base64url");

    const claims = await verifySessionCookie("valid-session", sig);
    expect(claims).toEqual({ uid: "test-user", email: "test@example.com" });
  });

  it("returns null for invalid signature", async () => {
    const claims = await verifySessionCookie("valid-session", "tampered");
    expect(claims).toBeNull();
  });

  it("returns null for invalid cookie value", async () => {
    const crypto = require("crypto");
    const sig = crypto
      .createHmac("sha256", process.env.SESSION_COOKIE_SECRET!)
      .update("invalid-session")
      .digest("base64url");

    const claims = await verifySessionCookie("invalid-session", sig);
    expect(claims).toBeNull();
  });
});

