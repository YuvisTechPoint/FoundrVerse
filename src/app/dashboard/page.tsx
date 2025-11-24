import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { CheckCircle, BookOpen, Users, Award, LogOut, Code, Briefcase, Users2, Megaphone, Calendar, Clock, ShoppingCart, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { verifySessionCookie } from "@/lib/verifySession";
import { getMockUser } from "@/data/users-mock";
import { getPaymentsByUserId, getAllPayments, getPaymentsByEmail, updatePayment, backfillPaymentsEmailByUserId } from "@/data/payments-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import LiveCoursesSection from "@/components/dashboard/LiveCoursesSection";
import RecordedCoursesSection from "@/components/dashboard/RecordedCoursesSection";
import CertificateSection from "@/components/dashboard/CertificateSection";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import CourseFeatureCard from "@/components/dashboard/CourseFeatureCard";
import CourseFeaturesDetail from "@/components/dashboard/CourseFeaturesDetail";
import PitchCompetitionSection from "@/components/dashboard/PitchCompetitionSection";
import PurchaseHandler from "@/components/dashboard/PurchaseHandler";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const sessionSignature = cookieStore.get(SESSION_SIGNATURE_COOKIE_NAME)?.value ?? null;

  const decoded = await verifySessionCookie(sessionCookie, sessionSignature);

  if (!decoded) {
    redirect("/login");
  }

  // Get user from mock store or create from decoded token
  // Priority: decoded token (from auth) > mock user store
  const mockUser = getMockUser(decoded.uid);
  const user = {
    uid: decoded.uid,
    email: decoded.email ?? mockUser?.email,
    displayName: decoded.name ?? mockUser?.displayName ?? decoded.email ?? "Founder",
    // Fetch picture directly from auth token (decoded.picture)
    photoURL: decoded.picture ?? mockUser?.photoURL ?? undefined,
  };

  // Check if user has purchased the course
  // Use authenticated userId directly (same as used in payment creation/verification)
  const authenticatedUserId = decoded.uid;
  const authenticatedUserEmail = decoded.email || user.email;
  
  // CRITICAL: Backfill email for existing payments that don't have it
  if (authenticatedUserEmail) {
    backfillPaymentsEmailByUserId(authenticatedUserId, authenticatedUserEmail);
  }
  
  // First, try to find payments by userId
  let userPayments = getPaymentsByUserId(authenticatedUserId);
  
  // CRITICAL: Also check by email to auto-sync payments from different accounts
  // This handles cases where user paid with different account but same email
  if (authenticatedUserEmail) {
    const emailPayments = getPaymentsByEmail(authenticatedUserEmail);
    
    // Auto-sync: Update payments found by email to current userId if they don't have userId or have different userId
    for (const payment of emailPayments) {
      if (payment.userEmail === authenticatedUserEmail && 
          (!payment.userId || payment.userId !== authenticatedUserId)) {
        // Auto-link payment to current authenticated account
        updatePayment(payment.id, {
          userId: authenticatedUserId,
          userEmail: authenticatedUserEmail,
        });
        console.log('[Dashboard] Auto-synced payment to account:', {
          paymentId: payment.id,
          oldUserId: payment.userId,
          newUserId: authenticatedUserId,
          email: authenticatedUserEmail,
        });
      }
    }
    
    // Merge email payments with userId payments (avoid duplicates)
    const emailPaymentIds = new Set(userPayments.map((p: { id: string }) => p.id));
    const newEmailPayments = emailPayments.filter((p: { id: string }) => !emailPaymentIds.has(p.id));
    userPayments = [...userPayments, ...newEmailPayments];
  }
  
  let hasPurchased = userPayments.some(
    (payment: { status: string }) => payment.status === "paid" || payment.status === "captured" || payment.status === "authorized"
  );
  
  // Final check: If still no purchase found, check all payments by email one more time
  if (!hasPurchased && authenticatedUserEmail) {
    const allEmailPayments = getPaymentsByEmail(authenticatedUserEmail);
    const paidEmailPayments = allEmailPayments.filter(
      (p: { status: string }) => p.status === "paid" || p.status === "captured" || p.status === "authorized"
    );
    if (paidEmailPayments.length > 0) {
      // Auto-sync these payments
      for (const payment of paidEmailPayments) {
        if (!payment.userId || payment.userId !== authenticatedUserId) {
          updatePayment(payment.id, {
            userId: authenticatedUserId,
            userEmail: authenticatedUserEmail,
          });
        }
      }
      userPayments = [...userPayments, ...paidEmailPayments];
      hasPurchased = true;
    }
  }
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Dashboard] Purchase Status Check:', {
      authenticatedUserId,
      authenticatedUserEmail,
      totalPayments: userPayments.length,
      paidPayments: userPayments.filter((p: { status: string }) => p.status === "paid" || p.status === "captured" || p.status === "authorized").length,
      hasPurchased,
      allPaymentStatuses: userPayments.map((p: { id: string; status: string; userId?: string; userEmail?: string }) => ({ 
        id: p.id, 
        status: p.status, 
        userId: p.userId,
        userEmail: p.userEmail 
      }))
    });
  }
  
  const latestPayment = userPayments
    .filter((p: { status: string; createdAt: string }) => p.status === "paid" || p.status === "captured" || p.status === "authorized")
    .sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  // Get course progress
  const courseProgress = getCourseProgress(decoded.uid);
  const isCourseCompleted = courseProgress.progress >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Handle purchase redirect */}
      <Suspense fallback={null}>
        <PurchaseHandler />
      </Suspense>
      
      {/* Premium background effects - Enhanced for light mode */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.5)_100%)] dark:bg-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user.displayName || "Student"}</span>
          </p>
        </div>

        {/* Purchase Confirmation Banner */}
        {hasPurchased && latestPayment && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800/50 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">
                  Course Purchase Confirmed! 🎉
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-2">
                  You have successfully enrolled in the <strong>30-Day Startup Blueprint</strong> course. All premium features are now unlocked!
                </p>
                {latestPayment.paidAt && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Purchased on {new Date(latestPayment.paidAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Account Information Card - Premium */}
        <div className="relative group mb-8">
          {/* Glow effect - Subtle in light mode */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 dark:from-slate-500 dark:via-slate-600 dark:to-slate-700 rounded-2xl blur-lg opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500" />
          
          {/* Card - Enhanced contrast for light mode */}
          <div className="relative bg-white dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-lg dark:shadow-xl p-8 hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <div className="relative w-20 h-20 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 shadow-lg">
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? "User avatar"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 shadow-xl">
                  {(user.displayName ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.displayName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{user.email}</p>
              </div>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Sign Out
              </button>
            </form>
          </div>

          {/* Course Enrollment Status */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700/50 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {hasPurchased ? (
                  <>
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">Course Access Active</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        You have full access to all course materials
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-lg shadow-orange-500/30">
                      <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">Enrollment Required</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Complete enrollment to access course materials
                      </p>
                    </div>
                  </>
                )}
              </div>
              {hasPurchased ? (
                <Link
                  href="/course"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>View Course</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/payment"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Course Progress Section */}
        {hasPurchased && (
          <div id="course-progress">
            <CourseProgress
              progress={courseProgress.progress}
              modules={courseProgress.modules}
              totalModules={courseProgress.totalModules}
              completedModules={courseProgress.completedModules}
            />
          </div>
        )}

        {/* Course Overview - Premium */}
        <div className="relative group mb-8">
          {/* Glow effect - Subtle in light mode */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 dark:from-slate-500 dark:via-slate-600 dark:to-slate-700 rounded-3xl blur-lg opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500" />
          
          {/* Card - Enhanced contrast for light mode */}
          <div className="relative bg-white dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700/50 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-10 hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    30-Day Startup Blueprint
                  </h2>
                  {hasPurchased ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enrolled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Enrolled
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Comprehensive startup development program</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>4 Weeks</span>
              </div>
            </div>

            {/* Course Weeks */}
            <div className="grid md:grid-cols-2 gap-4 mb-8" data-section="course-weeks">
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

            {/* Course Features */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700/50 pt-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Features</h3>
              <div className="grid md:grid-cols-3 gap-4">
              {[
                { 
                  iconName: "BookOpen", 
                  title: "30-Day Course", 
                  desc: "Comprehensive 4-week startup blueprint covering idea validation, MVP development, marketing, and funding strategies", 
                  variant: "luxury" as const 
                },
                { 
                  iconName: "Code", 
                  title: "Practical Tasks", 
                  desc: "Hands-on assignments and real-world projects to build your startup from scratch with actionable execution", 
                  variant: "diamond" as const 
                },
                { 
                  iconName: "Briefcase", 
                  title: "Internship", 
                  desc: "Exclusive internship opportunities across 4 active startups for top-performing students", 
                  variant: "platinum" as const 
                },
                { 
                  iconName: "Users2", 
                  title: "Live Sessions", 
                  desc: "Interactive live sessions with founders and industry experts for direct mentorship and Q&A", 
                  variant: "luxury" as const 
                },
                { 
                  iconName: "Megaphone", 
                  title: "Pitch Competition", 
                  desc: "Final pitch competition where you present your startup to real investors and get feedback", 
                  variant: "diamond" as const 
                },
                { 
                  iconName: "Award", 
                  title: "Certificate", 
                  desc: "Industry-recognized certificate of completion with verification and sharing capabilities", 
                  variant: "luxury" as const 
                },
              ].map(({ iconName, title, desc, variant }) => (
                <CourseFeatureCard
                  key={title}
                  iconName={iconName}
                  title={title}
                  desc={desc}
                  variant={variant}
                />
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Course Features Section */}
        {hasPurchased && (
          <CourseFeaturesDetail />
        )}

        {/* Live Courses Section - Premium */}
        {hasPurchased && (
          <div id="sessions">
            <LiveCoursesSection />
          </div>
        )}

        {/* Recorded Courses Section - Premium */}
        {hasPurchased && (
          <div id="recorded-sessions">
            <RecordedCoursesSection />
          </div>
        )}

        {/* Pitch Competition Section */}
        {hasPurchased && (
          <div id="pitch">
            <PitchCompetitionSection />
          </div>
        )}

        {/* Certificate Section - Premium - Always show after purchase with locked template */}
        {hasPurchased && (
          <div id="certificate">
            <CertificateSection 
              userName={user.displayName ?? "Student"}
              userEmail={user.email ?? ""}
              hasPurchased={hasPurchased}
              isCourseCompleted={isCourseCompleted}
            />
          </div>
        )}

        {/* Quick Actions */}
        {hasPurchased && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <QuickActionCard 
              iconName="BookOpen"
              title="Continue Learning"
              description="Access course materials and continue your progress"
              variant="luxury"
            />
            <QuickActionCard 
              iconName="Users"
              title="Community Access"
              description="Connect with fellow students and founders"
              variant="diamond"
            />
            <QuickActionCard 
              iconName="Award"
              title="Earn Certificate"
              description="Complete the program to receive certification"
              variant="luxury"
            />
          </div>
        )}

        {/* Community & Collaboration Section - Premium */}
        {hasPurchased && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Office Meeting Image */}
            <div className="relative group h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/istockphoto-1077565558-612x612.jpg"
                alt="Team Collaboration"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Join Our Community</h3>
                  <p className="text-white/90 text-base font-medium">Collaborate with fellow founders and build together</p>
                </div>
              </div>
            </div>

            {/* Next Steps - Premium */}
            <div className="relative group">
              {/* Glow effect - Subtle in light mode */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 dark:from-slate-500 dark:via-slate-600 dark:to-slate-700 rounded-3xl blur-lg opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500" />
              
              {/* Card - Enhanced contrast for light mode */}
              <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950/40 dark:via-gray-950/40 dark:to-slate-950/40 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800/50 rounded-3xl p-8 shadow-lg dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommended Actions</h3>
                <ul className="space-y-4">
                  {[
                    "Review course curriculum and structure",
                    "Access learning materials and resources",
                    "Participate in community discussions",
                    "Begin working on practical assignments",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                          <CheckCircle className="h-4 w-4 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <span className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

