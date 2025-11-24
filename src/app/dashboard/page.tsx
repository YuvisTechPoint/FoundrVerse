import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, BookOpen, Users, Award, LogOut, Code, Briefcase, Users2, Megaphone, Calendar, Clock, ShoppingCart, XCircle, CheckCircle2 } from "lucide-react";
import { verifySessionCookie } from "@/lib/verifySession";
import { getMockUser } from "@/data/users-mock";
import { getPaymentsByUserId } from "@/data/payments-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import SessionsSection from "@/components/dashboard/SessionsSection";
import CertificateSection from "@/components/dashboard/CertificateSection";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import CourseFeatureCard from "@/components/dashboard/CourseFeatureCard";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

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
  const userPayments = getPaymentsByUserId(decoded.uid);
  const hasPurchased = userPayments.some(
    (payment) => payment.status === "paid" || payment.status === "captured" || payment.status === "authorized"
  );
  const latestPayment = userPayments
    .filter((p) => p.status === "paid" || p.status === "captured" || p.status === "authorized")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  // Get course progress
  const courseProgress = getCourseProgress(decoded.uid);
  const isCourseCompleted = courseProgress.progress >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 pt-28 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.displayName || "Student"}
          </p>
        </div>

        {/* Account Information Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <div className="relative w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? "User avatar"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-semibold text-white flex-shrink-0">
                  {(user.displayName ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.displayName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>

          {/* Course Enrollment Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {hasPurchased ? (
                  <>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Course Enrolled</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {latestPayment?.paidAt
                          ? `Enrolled on ${new Date(latestPayment.paidAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}`
                          : "Full course access granted"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Enrollment Required</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete enrollment to access course materials
                      </p>
                    </div>
                  </>
                )}
              </div>
              {!hasPurchased && (
                <Link
                  href="/payment"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
                >
                  Enroll Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Course Progress Section */}
        {hasPurchased && (
          <CourseProgress
            progress={courseProgress.progress}
            modules={courseProgress.modules}
            totalModules={courseProgress.totalModules}
            completedModules={courseProgress.completedModules}
          />
        )}

        {/* Course Overview */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">30-Day Startup Blueprint</h2>
                {hasPurchased ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enrolled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    Not Enrolled
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive startup development program</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>4 Weeks</span>
            </div>
          </div>

          {/* Course Weeks */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { week: "Week 1", topic: "Idea, Research, Validation" },
              { week: "Week 2", topic: "Product, MVP, No-Code Build" },
              { week: "Week 3", topic: "Marketing, Social Media, Branding" },
              { week: "Week 4", topic: "Sales, Funding, Pitching, Investor Psychology" },
            ].map((item, index) => (
              <div
                key={item.week}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {item.week}
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{item.topic}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Course Features */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Course Features</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { iconName: "BookOpen", title: "30-Day Course", desc: "Complete startup blueprint", variant: "luxury" as const },
                { iconName: "Code", title: "Practical Tasks", desc: "Hands-on execution", variant: "diamond" as const },
                { iconName: "Briefcase", title: "Internship", desc: "Top students get internships", variant: "platinum" as const },
                { iconName: "Users2", title: "Live Sessions", desc: "Direct founder mentorship", variant: "luxury" as const },
                { iconName: "Megaphone", title: "Pitch Competition", desc: "Pitch to investors", variant: "diamond" as const },
                { iconName: "Award", title: "Certificate", desc: "Industry-grade certification", variant: "luxury" as const },
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

        {/* Certificate Section */}
        <CertificateSection 
          userName={user.displayName ?? "Student"}
          userEmail={user.email ?? ""}
          hasPurchased={hasPurchased}
          isCourseCompleted={isCourseCompleted}
        />

        {/* Live & Recorded Sessions */}
        <SessionsSection />

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

        {/* Community & Collaboration Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Office Meeting Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/istockphoto-1077565558-612x612.jpg"
              alt="Team Collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
                <p className="text-white/90 text-sm">Collaborate with fellow founders and build together</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommended Actions</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Review course curriculum and structure</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Access learning materials and resources</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Participate in community discussions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Begin working on practical assignments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

