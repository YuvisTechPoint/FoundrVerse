"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";
import { Megaphone, DollarSign, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface Pitch {
  id: string;
  studentName: string;
  studentEmail: string;
  startupName: string;
  status: "submitted" | "scheduled" | "reviewed" | "funded" | "rejected";
  submittedDate: string;
  reviewDate?: string;
  fundingAmount?: number;
  investorFeedback?: string;
}

export default function PitchesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    funded: 0,
    totalFunding: 0,
  });

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = localStorage.getItem("isAdmin") === "true";
      if (!adminStatus) {
        router.push("/admin/login");
        return;
      }
      setIsAdmin(true);
    };
    checkAdmin();

    const fetchData = () => {
      fetch("/api/admin/pitches")
        .then((res) => res.json())
        .then((data) => {
          setPitches(data.pitches || []);
          setStats(data.stats || { total: 0, scheduled: 0, funded: 0, totalFunding: 0 });
        })
        .catch(() => {
          // Mock data
          const mockPitches: Pitch[] = [
            {
              id: "1",
              studentName: "Rajesh Kumar",
              studentEmail: "rajesh@example.com",
              startupName: "EduTech Solutions",
              status: "funded",
              submittedDate: "2024-10-15",
              reviewDate: "2024-11-01",
              fundingAmount: 50000,
              investorFeedback: "Strong team and clear market opportunity",
            },
            {
              id: "2",
              studentName: "Priya Sharma",
              studentEmail: "priya@example.com",
              startupName: "HealthApp",
              status: "scheduled",
              submittedDate: "2024-11-10",
              reviewDate: "2024-11-25",
            },
            {
              id: "3",
              studentName: "Amit Patel",
              studentEmail: "amit@example.com",
              startupName: "FinTech Platform",
              status: "submitted",
              submittedDate: "2024-11-18",
            },
          ];
          setPitches(mockPitches);
          setStats({
            total: mockPitches.length,
            scheduled: 1,
            funded: 1,
            totalFunding: 50000,
          });
        });
    };

    fetchData();

    // Real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      submitted: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
      reviewed: "bg-purple-100 text-purple-800",
      funded: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <AdminHeader />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 lg:p-8"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-charcoal">Pitch Competition</h1>
              <p className="text-gray-600 mt-1">Manage student pitches and investor reviews</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Total Pitches</h3>
                <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-500 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Scheduled</h3>
                <p className="text-2xl font-bold text-charcoal">{stats.scheduled}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Funded</h3>
                <p className="text-2xl font-bold text-charcoal">{stats.funded}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gold p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-charcoal" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">Total Funding</h3>
                <p className="text-2xl font-bold text-charcoal">₹{(stats.totalFunding / 1000).toFixed(0)}K</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-charcoal">All Pitches</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Startup</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Review Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Funding</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pitches.map((pitch) => (
                      <tr key={pitch.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-charcoal">{pitch.studentName}</p>
                            <p className="text-sm text-gray-500">{pitch.studentEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-charcoal">{pitch.startupName}</span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(pitch.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(pitch.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pitch.reviewDate ? new Date(pitch.reviewDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {pitch.fundingAmount ? (
                            <span className="font-semibold text-green-600">₹{pitch.fundingAmount.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

