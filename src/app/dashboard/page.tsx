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
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800">
      {/* Welcome Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Welcome Header with Image */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          {/* Left: Welcome Text */}
          <div className="text-center md:text-left">
          {user.photoURL ? (
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-green-500 dark:border-green-400 overflow-hidden shadow-lg">
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? "User avatar"}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          )}
          <div className="mb-4 flex items-center gap-4 justify-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
              <Image
                src="/images/mewayz.jpeg"
                alt="Mewayz FoundrVerse Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Mewayz</span>
              <span className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome, {user.displayName?.split(" ")[0] || "Founder"}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            You're now part of India's first practical startup school for students.
          </p>
          </div>
          
          {/* Right: Businessman Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/businessman-7504296_640.jpg"
              alt="Entrepreneur Success"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
            {user.photoURL ? (
                <div className="relative w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                src={user.photoURL}
                alt={user.displayName ?? "User avatar"}
                    fill
                    className="object-cover"
                    sizes="80px"
                    priority
              />
                </div>
            ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                {(user.displayName ?? "F").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Logged in as
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>

          {/* Course Purchase Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasPurchased ? (
                  <>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Course Purchased</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {latestPayment?.paidAt
                          ? `Purchased on ${new Date(latestPayment.paidAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}`
                          : "You have access to the course"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Course Not Purchased</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete payment to access the course
                      </p>
                    </div>
                  </>
                )}
              </div>
              {!hasPurchased && (
                <Link
                  href="/payment"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition text-sm"
                >
                  Buy Course
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

        {/* Course Summary */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">30-Day Startup Blueprint</h2>
                {hasPurchased ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Purchased
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    Not Purchased
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">From idea to investors in 30 days</p>
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

          {/* What You Get */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What You'll Get</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, title: "30-Day Course", desc: "Complete startup blueprint" },
                { icon: Code, title: "Practical Tasks", desc: "Hands-on execution" },
                { icon: Briefcase, title: "Internship", desc: "Top students get internships" },
                { icon: Users2, title: "Live Sessions", desc: "Direct founder mentorship" },
                { icon: Megaphone, title: "Pitch Competition", desc: "Pitch to investors" },
                { icon: Award, title: "Certificate", desc: "Industry-grade certification" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
                  </div>
                </div>
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Learning</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Access your courses and begin your startup journey
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Join Community</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Connect with fellow founders and students
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Get Certified</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Complete the program and earn your certificate
            </p>
          </div>
        </div>

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
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What's Next?</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Complete your profile setup</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Explore the course curriculum</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Join the student community</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Start building your first startup project</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

