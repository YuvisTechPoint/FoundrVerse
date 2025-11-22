"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
  students: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/admin/revenue")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch(() => {
          // Fallback mock data
          setData([
            { month: "Jan", revenue: 74950, students: 50 },
            { month: "Feb", revenue: 59960, students: 40 },
            { month: "Mar", revenue: 89940, students: 60 },
            { month: "Apr", revenue: 104930, students: 70 },
            { month: "May", revenue: 119920, students: 80 },
            { month: "Jun", revenue: 134910, students: 90 },
            { month: "Jul", revenue: 149900, students: 100 },
            { month: "Aug", revenue: 164890, students: 110 },
            { month: "Sep", revenue: 179880, students: 120 },
            { month: "Oct", revenue: 194870, students: 130 },
            { month: "Nov", revenue: 209860, students: 140 },
          ]);
        });
    };

    fetchData();

    // Real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    window.addEventListener("refresh-data", fetchData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-data", fetchData);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-charcoal mb-6">Revenue Trend (Last 12 Months)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f6b336" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f6b336" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#f6b336"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

