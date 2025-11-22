"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CohortData {
  cohort: string;
  registrations: number;
  active: number;
  completed: number;
}

export default function RegistrationsChart() {
  const [data, setData] = useState<CohortData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/admin/cohorts")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch(() => {
          // Fallback mock data
          setData([
            { cohort: "2024-01", registrations: 120, active: 95, completed: 25 },
            { cohort: "2024-02", registrations: 150, active: 130, completed: 20 },
            { cohort: "2024-03", registrations: 180, active: 175, completed: 5 },
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
      <h2 className="text-xl font-bold text-charcoal mb-6">Registrations by Cohort</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="cohort" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
          <Bar dataKey="registrations" fill="#102158" radius={[8, 8, 0, 0]} />
          <Bar dataKey="active" fill="#f6b336" radius={[8, 8, 0, 0]} />
          <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
        <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#102158] rounded"></div>
          <span className="text-sm text-gray-600">Registrations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gold rounded"></div>
          <span className="text-sm text-gray-600">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
      </div>
    </div>
  );
}

