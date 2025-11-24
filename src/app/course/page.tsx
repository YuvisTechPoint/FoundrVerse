import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import CourseProgress from "@/components/dashboard/CourseProgress";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShoppingCart, ArrowRight, Lock } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export default async function CoursePage() {
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

  // Get course progress
  const courseProgress = getCourseProgress(decoded.uid);

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
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                30-Day Startup Blueprint
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Complete course curriculum and learning materials
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
                  <p className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">Full Access Locked</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Enroll now to unlock all course materials, assignments, and certificates
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

        {/* Course Progress */}
        {hasPurchased && (
          <div id="course-progress" className="mb-8">
            <CourseProgress
              progress={courseProgress.progress}
              modules={courseProgress.modules}
              totalModules={courseProgress.totalModules}
              completedModules={courseProgress.completedModules}
            />
          </div>
        )}

        {/* Course Weeks */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
          <div className="grid md:grid-cols-2 gap-6" data-section="course-weeks">
            {[
              { week: "Week 1", topic: "Idea, Research, Validation" },
              { week: "Week 2", topic: "Product, MVP, No-Code Build" },
              { week: "Week 3", topic: "Marketing, Social Media, Branding" },
              { week: "Week 4", topic: "Sales, Funding, Pitching, Investor Psychology" },
            ].map((item, index) => (
              <div
                key={item.week}
                className="group relative flex items-start gap-5 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 border border-slate-600/30 dark:border-slate-500/30">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {item.week}
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-white leading-snug">{item.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

