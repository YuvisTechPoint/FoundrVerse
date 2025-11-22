"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, Award, Briefcase } from "lucide-react";
import StudentProfileModal from "./StudentProfileModal";
import type { Student } from "@/data/admin-mock";

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/admin/students")
        .then((res) => res.json())
        .then((data) => {
          setStudents(data.students || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
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

  const handleExport = async () => {
    const ids = selectedIds.length > 0 ? selectedIds : students.map((s) => s.id);
    const response = await fetch(`/api/admin/export?ids=${ids.join(",")}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-export-${new Date().toISOString()}.csv`;
    a.click();
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.college.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      pending_payment: "bg-yellow-100 text-yellow-800",
      refunded: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal">Students</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent w-full sm:w-64"
              />
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-600">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-8 text-center text-gray-600">No students found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredStudents.map((s) => s.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">College</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cohort</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Internship</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, student.id]);
                        } else {
                          setSelectedIds(selectedIds.filter((id) => id !== student.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal">{student.name}</span>
                      {student.topPerformer && (
                        <Award className="w-4 h-4 text-gold" title="Top Performer" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.college}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.cohort}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gold to-[#f9c866] h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-10">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(student.enrollmentStatus)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      student.paymentStatus === "paid" ? "text-green-600" : 
                      student.paymentStatus === "pending" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.internshipStatus !== "none" ? (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-[#102158]" />
                        <span className="text-sm text-gray-600">{student.internshipCompany || student.internshipStatus}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-[#102158] hover:text-indigo-800 flex items-center gap-1 font-semibold text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

