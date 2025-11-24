"use client";

import { Users, UserCheck, DollarSign, TrendingUp, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

interface OverviewData {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  conversionRate: number;
  openInternships: number;
}

export default function OverviewCards() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/admin/overview")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch(() => {
          // Fallback to mock data
          setData({
            totalStudents: 450,
            activeStudents: 400,
            totalRevenue: 674550,
            conversionRate: 68.5,
            openInternships: 12,
          });
        });
    };

    fetchData();

    // Real-time updates every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    // Listen for manual refresh events
    window.addEventListener("refresh-data", fetchData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-data", fetchData);
    };
  }, []);

  if (!data) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">Loading...</div>;
  }

  const cards = [
    {
      title: "Total Students",
      value: data.totalStudents.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Active Students",
      value: data.activeStudents.toLocaleString(),
      icon: UserCheck,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Total Revenue",
      value: `₹${(data.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "bg-gold",
      change: "+24%",
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+3.2%",
    },
    {
      title: "Open Internships",
      value: data.openInternships.toString(),
      icon: Briefcase,
      color: "bg-indigo-500",
      change: "3 new",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600">{card.change}</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-charcoal">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

