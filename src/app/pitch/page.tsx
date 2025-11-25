import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/verifySession";
import { getPaymentsByUserId } from "@/data/payments-mock";
import PitchCompetitionSection from "@/components/dashboard/PitchCompetitionSection";
import Link from "next/link";
import { ArrowLeft, Megaphone, ShoppingCart, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Enhanced Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 mb-6 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-900 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative p-5 bg-gray-900 rounded-3xl shadow-2xl">
                <Megaphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
                  Pitch Competition
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Present your startup to investors and get real funding opportunities. 
                Your journey from idea to funded startup starts here.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Purchase Banner - Show if not purchased */}
        {!hasPurchased && (
          <div className="mb-10 relative">
            <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5 flex-1">
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-900 text-white shadow-xl">
                    <Lock className="w-9 h-9" strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-extrabold text-2xl text-gray-900 dark:text-white">
                        Competition Locked
                      </p>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-700">
                        Premium Access Required
                      </span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-4">
                      Enroll in the FoundrVerse program to participate in the pitch competition and unlock:
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Access to investors",
                        "Expert mentorship",
                        "Funding opportunities",
                        "Incubation spots"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/payment"
                  className="w-full lg:w-auto inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl justify-center"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-lg">Enroll Now</span>
                  <ArrowRight className="w-5 h-5" />
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

