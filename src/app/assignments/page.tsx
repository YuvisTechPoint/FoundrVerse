import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import { getCourseProgress } from "@/data/course-progress-mock";
import Link from "next/link";
import { ArrowLeft, Code, CheckCircle2, Circle, FileText, Clock, ShoppingCart, ArrowRight, Lock } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

interface Assignment {
  id: string;
  title: string;
  week: number;
  description: string;
  dueDate?: string;
  completed: boolean;
  type: "assignment" | "project";
}

const assignments: Assignment[] = [
  {
    id: "w1-assignment",
    title: "Week 1: Validate Your Idea",
    week: 1,
    description: "Research and validate your startup idea. Create a validation report with market analysis, competitor research, and customer interviews.",
    dueDate: "2024-12-15",
    completed: false,
    type: "assignment",
  },
  {
    id: "w2-assignment",
    title: "Week 2: Build Your MVP",
    week: 2,
    description: "Create a minimum viable product using no-code tools. Document your build process and create a demo.",
    dueDate: "2024-12-22",
    completed: false,
    type: "project",
  },
  {
    id: "w3-assignment",
    title: "Week 3: Create Marketing Plan",
    week: 3,
    description: "Develop a comprehensive marketing strategy including social media plan, branding guidelines, and content calendar.",
    dueDate: "2024-12-29",
    completed: false,
    type: "assignment",
  },
  {
    id: "w4-assignment",
    title: "Week 4: Final Pitch Deck",
    week: 4,
    description: "Create a complete pitch deck for investors. Include problem, solution, market size, business model, and financial projections.",
    dueDate: "2025-01-05",
    completed: false,
    type: "project",
  },
];

export default async function AssignmentsPage() {
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
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Practical Tasks & Assignments
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Hands-on assignments to build your startup
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
                  <p className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">Assignments Locked</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Enroll now to access all assignments and submit your work
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

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {assignment.completed ? (
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <Circle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assignment.type === "project" 
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    }`}>
                      {assignment.type === "project" ? "Project" : "Assignment"}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{assignment.description}</p>
                  {assignment.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                  )}
                </div>
                <div>
                  <button 
                    disabled={!hasPurchased}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      hasPurchased
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {!hasPurchased ? "Locked" : assignment.completed ? "Review" : "Start Assignment"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

