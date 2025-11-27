"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Download, Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const gradingSchema = z.object({
  score: z.number().min(0).max(1000),
  maxScore: z.number().min(1).max(1000),
  feedback: z.string().optional(),
  status: z.enum(["graded", "revision_required"]),
});

type GradingForm = z.infer<typeof gradingSchema>;

interface AssignmentReviewModalProps {
  submission: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignmentReviewModal({
  submission,
  onClose,
  onSuccess,
}: AssignmentReviewModalProps) {
  const [grading, setGrading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GradingForm>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      score: submission.score || 0,
      maxScore: submission.maxScore || submission.assignment?.maxScore || 100,
      feedback: submission.feedback || "",
      status: submission.status === "revision_required" ? "revision_required" : "graded",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: GradingForm) => {
    setGrading(true);
    try {
      const response = await fetch(`/api/admin/assignments/${submission.id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to grade assignment");
      }

      toast({
        title: "Assignment graded",
        description: "The assignment has been graded successfully.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grade assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Assignment
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {submission.assignment?.title || "Assignment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Student Information</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {submission.userName}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span> {submission.userEmail}
            </p>
            {submission.submittedAt && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Description */}
          {submission.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                {submission.description}
              </p>
            </div>
          )}

          {/* Files */}
          {submission.files && submission.files.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Files</h3>
              <div className="space-y-2">
                {submission.files.map((file: any, index: number) => (
                  <a
                    key={index}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Grading Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Score <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    {...register("score", { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                    min="0"
                  />
                  {errors.score && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.score.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">/</div>
                <div className="flex-1">
                  <input
                    type="number"
                    {...register("maxScore", { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                    min="1"
                  />
                  {errors.maxScore && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.maxScore.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setValue("status", "graded")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    status === "graded"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Graded
                </button>
                <button
                  type="button"
                  onClick={() => setValue("status", "revision_required")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    status === "revision_required"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Revision Required
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Feedback (Optional)
              </label>
              <textarea
                {...register("feedback")}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Provide feedback to the student..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={grading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {grading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Grading...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Grade
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

