import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import LiveCoursesSection from "@/components/dashboard/LiveCoursesSection";
import RecordedCoursesSection from "@/components/dashboard/RecordedCoursesSection";
import Link from "next/link";
import { ArrowLeft, Users2, ShoppingCart, ArrowRight, Lock } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export default async function SessionsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    redirect("/login");
  }

  // Check if user has purchased the course
  const userPayments = getPaymentsByUserId(decoded.uid);
  const hasPurchased = userPayments.some(
    (payment) => payment.status === "paid" || payment.status === "captured" || payment.status === "authorized"
  );

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
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <Users2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Live & Recorded Sessions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Interactive sessions with founders and industry experts
              </p>
            </div>
          </div>
        </div>

        {/* Purchase Banner - Show if not purchased */}
        {!hasPurchased && (
          <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-lg shadow-orange-500/30">
                  <Lock className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">Sessions Locked</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Enroll now to access live and recorded sessions
                  </p>
                </div>
              </div>
              <Link
                href="/payment"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* Live Sessions */}
        {hasPurchased && (
          <div id="sessions" className="mb-8">
            <LiveCoursesSection />
          </div>
        )}

        {/* Recorded Sessions */}
        {hasPurchased && (
          <div id="recorded-sessions">
            <RecordedCoursesSection />
          </div>
        )}
        
        {/* Preview Message for Non-Purchased */}
        {!hasPurchased && (
          <div className="text-center py-16">
            <Users2 className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Unlock Live & Recorded Sessions</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Get access to interactive live sessions and a library of recorded content from industry experts
            </p>
            <Link
              href="/payment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

