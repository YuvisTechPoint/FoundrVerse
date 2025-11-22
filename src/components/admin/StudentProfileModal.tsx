"use client";

import { X, Award, Briefcase, FileText, Mail, Phone, Calendar } from "lucide-react";
import type { Student } from "@/data/admin-mock";

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentProfileModal({ student, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-charcoal">Student Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Name</h3>
              <p className="text-lg font-semibold text-charcoal">{student.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Email</h3>
              <p className="text-lg text-charcoal flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {student.email}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">College</h3>
              <p className="text-lg text-charcoal">{student.college}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Year</h3>
              <p className="text-lg text-charcoal">Year {student.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Cohort</h3>
              <p className="text-lg text-charcoal">{student.cohort}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Enrollment Date</h3>
              <p className="text-lg text-charcoal flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-500">Course Progress</h3>
              <span className="text-sm font-semibold text-charcoal">{student.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-gold to-[#f9c866] h-3 rounded-full transition-all"
                style={{ width: `${student.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, index) => (
                <div
                  key={week}
                  className={`p-3 rounded-lg text-center ${
                    student.progress >= (index + 1) * 25
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <p className="text-xs font-semibold">{week}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Enrollment Status</h4>
              <p className="text-lg font-semibold text-charcoal capitalize">
                {student.enrollmentStatus.replace("_", " ")}
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Payment Status</h4>
              <p className="text-lg font-semibold text-charcoal capitalize">{student.paymentStatus}</p>
              <p className="text-sm text-gray-600 mt-1">₹{student.amount}</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Certificate</h4>
              <p className="text-lg font-semibold text-charcoal">
                {student.certificateIssued ? "Issued" : "Not Issued"}
              </p>
            </div>
          </div>

          {/* Internship */}
          {student.internshipStatus !== "none" && (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-semibold text-gray-500">Internship</h4>
              </div>
              <p className="text-lg font-semibold text-charcoal capitalize">
                {student.internshipStatus}
              </p>
              {student.internshipCompany && (
                <p className="text-sm text-gray-600 mt-1">Company: {student.internshipCompany}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {!student.certificateIssued && (
              <button className="px-4 py-2 bg-gold text-charcoal rounded-lg font-semibold hover:bg-[#f9c866] transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Issue Certificate
              </button>
            )}
            {student.internshipStatus === "eligible" && (
              <button className="px-4 py-2 bg-[#102158] text-white rounded-lg font-semibold hover:bg-[#0f1a4a] transition-colors flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Assign Internship
              </button>
            )}
            {!student.topPerformer && (
              <button className="px-4 py-2 bg-charcoal text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Award className="w-4 h-4" />
                Mark Top Performer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

