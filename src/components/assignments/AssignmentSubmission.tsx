"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import FileUpload, { type UploadedFile } from "./FileUpload";
import { Loader2, Send, Save } from "lucide-react";

const submissionSchema = z.object({
  description: z.string().optional(),
});

type SubmissionForm = z.infer<typeof submissionSchema>;

interface AssignmentSubmissionProps {
  assignmentId: string;
  existingSubmission?: any;
  onSuccess?: () => void;
}

export default function AssignmentSubmission({
  assignmentId,
  existingSubmission,
  onSuccess,
}: AssignmentSubmissionProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      description: existingSubmission?.description || "",
    },
  });

  useEffect(() => {
    if (existingSubmission?.files) {
      setFiles(existingSubmission.files);
    }
  }, [existingSubmission]);

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };

  const onSubmit = async (data: SubmissionForm, status: "draft" | "submitted") => {
    if (files.length === 0 && status === "submitted") {
      toast({
        title: "Files required",
        description: "Please upload at least one file before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (status === "submitted") {
      setSubmitting(true);
    } else {
      setSaving(true);
    }

    try {
      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId,
          files,
          description: data.description || "",
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit assignment");
      }

      toast({
        title: status === "submitted" ? "Assignment submitted!" : "Draft saved",
        description:
          status === "submitted"
            ? "Your assignment has been submitted successfully."
            : "Your draft has been saved.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setSaving(false);
    }
  };

  const isSubmitted = existingSubmission?.status === "submitted" || existingSubmission?.status === "graded";
  const isGraded = existingSubmission?.status === "graded";

  if (isSubmitted && !existingSubmission) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading submission...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isGraded && existingSubmission && (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            Assignment Graded
          </h3>
          <div className="space-y-2">
            {existingSubmission.score !== undefined && existingSubmission.maxScore && (
              <p className="text-sm text-green-800 dark:text-green-200">
                <span className="font-semibold">Score:</span> {existingSubmission.score} / {existingSubmission.maxScore}
              </p>
            )}
            {existingSubmission.feedback && (
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                  Feedback:
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                  {existingSubmission.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Status:</span> {existingSubmission?.status === "graded" ? "Graded" : "Submitted - Awaiting Review"}
          </p>
          {existingSubmission?.submittedAt && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit((data) => onSubmit(data, "submitted"))} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Add any additional notes or comments about your submission..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Upload Files <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onFilesChange={handleFilesChange}
              maxFiles={5}
              maxSizeMB={10}
              acceptedTypes={[".pdf", ".doc", ".docx", ".txt", ".zip", ".jpg", ".jpeg", ".png"]}
              folder="assignments"
            />
            {files.length === 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                At least one file is required for submission.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || files.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Assignment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "draft"))}
              disabled={saving || files.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {existingSubmission && existingSubmission.files && existingSubmission.files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Submitted Files
          </h3>
          <div className="space-y-2">
            {existingSubmission.files.map((file: any, index: number) => (
              <a
                key={index}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
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
    </div>
  );
}

