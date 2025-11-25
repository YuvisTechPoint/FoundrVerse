import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import PitchCompetitionSection from "@/components/dashboard/PitchCompetitionSection";
import Link from "next/link";
import { ArrowLeft, Megaphone, ShoppingCart, ArrowRight, Lock } from "lucide-react";

const SESSION_COOKIE_NAME = "session";
const SESSION_SIGNATURE_COOKIE_NAME = "session_sig";

export default async function PitchPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Enhanced Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 mb-6 transition-all shadow-sm hover:shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative p-5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
                <Megaphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Pitch Competition
                </h1>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                Present your startup to investors and get real funding opportunities. 
                Your journey from idea to funded startup starts here.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Purchase Banner - Show if not purchased */}
        {!hasPurchased && (
          <div className="mb-10 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-10 animate-pulse"></div>
            
            <div className="relative p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40 border-2 border-orange-300 dark:border-orange-700 rounded-3xl shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5 flex-1">
                  {/* Animated lock icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 shadow-2xl shadow-orange-500/40">
                      <Lock className="w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-extrabold text-2xl text-orange-900 dark:text-orange-100">
                        Competition Locked
                      </p>
                      <span className="px-3 py-1 bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs font-bold rounded-full border border-orange-300 dark:border-orange-700">
                        Premium Access Required
                      </span>
                    </div>
                    <p className="text-base text-orange-800 dark:text-orange-200 font-medium mb-4">
                      Enroll in the FoundrVerse program to participate in the pitch competition and unlock:
                    </p>
                    
                    {/* Benefits list */}
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Access to investors",
                        "Expert mentorship",
                        "Funding opportunities",
                        "Incubation spots"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <Link
                  href="/payment"
                  className="group relative w-full lg:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 w-full lg:w-auto justify-center">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-lg">Enroll Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Pitch Competition Section */}
        <div id="pitch">
          <PitchCompetitionSection />
        </div>
      </div>
    </div>
  );
}

