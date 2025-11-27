"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, FileText, Clock, ChevronDown, ChevronUp } from "lucide-react";
import AssignmentSubmission from "./AssignmentSubmission";

interface Assignment {
  id: string;
  title: string;
  week: number;
  description: string;
  dueDate?: string;
  type: "assignment" | "project";
  maxScore?: number;
  instructions?: string;
}

interface AssignmentSubmission {
  id: string;
  status: "draft" | "submitted" | "graded" | "revision_required";
  score?: number;
  maxScore?: number;
  feedback?: string;
  submittedAt?: string;
  files?: any[];
}

interface AssignmentsListProps {
  hasPurchased: boolean;
}

export default function AssignmentsList({ hasPurchased }: AssignmentsListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, AssignmentSubmission>>({});

  useEffect(() => {
    if (hasPurchased) {
      fetchAssignments();
    } else {
      setLoading(false);
    }
  }, [hasPurchased]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments");
      if (!response.ok) throw new Error("Failed to fetch assignments");
      
      const data = await response.json();
      setAssignments(data.assignments || []);
      
      // Fetch submissions for each assignment
      if (data.assignments) {
        await Promise.all(
          data.assignments.map(async (assignment: Assignment) => {
            const subResponse = await fetch(`/api/assignments/${assignment.id}/submission`);
            if (subResponse.ok) {
              const subData = await subResponse.json();
              if (subData.submission) {
                setSubmissions(prev => ({
                  ...prev,
                  [assignment.id]: subData.submission,
                }));
              }
            }
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionSuccess = (assignmentId: string) => {
    // Refresh submission for this assignment
    fetch(`/api/assignments/${assignmentId}/submission`)
      .then(res => res.json())
      .then(data => {
        if (data.submission) {
          setSubmissions(prev => ({
            ...prev,
            [assignmentId]: data.submission,
          }));
        }
      });
    
    // Refresh assignments list
    fetchAssignments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please enroll in the course to access assignments.
        </p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No assignments available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => {
        const submission = submissions[assignment.id];
        const isSubmitted = submission?.status === "submitted" || submission?.status === "graded";
        const isGraded = submission?.status === "graded";
        const isExpanded = expandedAssignment === assignment.id;

        return (
          <div
            key={assignment.id}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {isSubmitted ? (
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
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assignment.type === "project"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {assignment.type === "project" ? "Project" : "Assignment"}
                    </span>
                    {isGraded && submission?.score !== undefined && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Score: {submission.score}/{submission.maxScore || assignment.maxScore || 100}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {assignment.description}
                  </p>
                  {assignment.instructions && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Instructions:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {assignment.instructions}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    {assignment.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {submission?.submittedAt && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Submitted:{" "}
                        {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedAssignment(isExpanded ? null : assignment.id)
                  }
                  className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50">
                <AssignmentSubmission
                  assignmentId={assignment.id}
                  existingSubmission={submission}
                  onSuccess={() => handleSubmissionSuccess(assignment.id)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

