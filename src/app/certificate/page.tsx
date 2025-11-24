import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import { getMockUser } from "@/data/users-mock";
import CertificateSection from "@/components/dashboard/CertificateSection";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export default async function CertificatePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    redirect("/login");
  }

  // Get user from mock store or create from decoded token
  const mockUser = getMockUser(decoded.uid);
  const user = {
    uid: decoded.uid,
    email: decoded.email ?? mockUser?.email,
    displayName: decoded.name ?? mockUser?.displayName ?? decoded.email ?? "Founder",
    photoURL: decoded.picture ?? mockUser?.photoURL ?? undefined,
  };

  // Check if user has purchased the course
  const userPayments = getPaymentsByUserId(decoded.uid);
  const hasPurchased = userPayments.some(
    (payment) => payment.status === "paid" || payment.status === "captured" || payment.status === "authorized"
  );

  // Get course progress
  const courseProgress = getCourseProgress(decoded.uid);
  const isCourseCompleted = courseProgress.progress >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Course Completion Certificate
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Download your official certificate of completion
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        <div id="certificate">
          <CertificateSection 
            userName={user.displayName ?? "Student"}
            userEmail={user.email ?? ""}
            hasPurchased={hasPurchased}
            isCourseCompleted={isCourseCompleted}
          />
        </div>
      </div>
    </div>
  );
}

