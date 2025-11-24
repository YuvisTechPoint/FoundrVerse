import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import Link from "next/link";
import { ArrowLeft, Briefcase, Building2, Users, Award, MapPin, ShoppingCart, ArrowRight, Lock } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

interface Internship {
  id: string;
  company: string;
  role: string;
  description: string;
  location: string;
  duration: string;
  requirements: string[];
  available: boolean;
}

const internships: Internship[] = [
  {
    id: "intern-1",
    company: "Mewayz",
    role: "Startup Development Intern",
    description: "Work on real startup projects, learn from experienced founders, and contribute to active product development.",
    location: "Remote / Hybrid",
    duration: "3-6 months",
    requirements: ["Top 10% course performance", "Completed all assignments", "Active participation"],
    available: true,
  },
  {
    id: "intern-2",
    company: "MyAiNation",
    role: "AI Product Intern",
    description: "Assist in AI product development, work with machine learning models, and contribute to product strategy.",
    location: "Remote",
    duration: "3-6 months",
    requirements: ["Top 10% course performance", "Interest in AI/ML", "Strong technical skills"],
    available: true,
  },
  {
    id: "intern-3",
    company: "PhantomX",
    role: "Tech Startup Intern",
    description: "Experience the full startup lifecycle from development to launch in a fast-paced tech environment.",
    location: "Hybrid",
    duration: "3-6 months",
    requirements: ["Top 10% course performance", "Completed all assignments", "Portfolio submission"],
    available: true,
  },
  {
    id: "intern-4",
    company: "careflow HMS",
    role: "Healthcare Tech Intern",
    description: "Work on healthcare technology solutions, understand healthcare industry needs, and develop innovative solutions.",
    location: "Remote / On-site",
    duration: "3-6 months",
    requirements: ["Top 10% course performance", "Interest in healthcare tech", "Strong problem-solving skills"],
    available: true,
  },
];

export default async function InternshipsPage() {
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
            <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Internship Opportunities
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Exclusive internships for top-performing students
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
                  <p className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">Internships Locked</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Enroll now to become eligible for internship opportunities
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

        {/* Info Banner */}
        {hasPurchased && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">Eligibility Requirements</h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Internships are available for top-performing students who complete all course assignments and demonstrate exceptional performance. 
                Focus on excelling in your assignments and active participation to increase your chances!
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Internships Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{internship.company}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{internship.role}</p>
                  </div>
                </div>
                {internship.available ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                    Filled
                  </span>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{internship.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{internship.duration}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {internship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={!internship.available || !hasPurchased}
                className={`w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  internship.available && hasPurchased
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                {!hasPurchased ? "Enroll Required" : internship.available ? "Apply Now" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

