"use client";

import { useState, useRef } from "react";
import { Upload, X, File, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  folder?: string;
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = [".pdf", ".doc", ".docx", ".txt", ".zip"],
  folder = "assignments",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes and types
    const validFiles = files.filter(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSizeMB) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSizeMB}MB limit.`,
          variant: "destructive",
        });
        return false;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const newUploadedFiles = await Promise.all(uploadPromises);
      
      const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("fileName", file.name);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    const data = await response.json();
    return {
      id: data.id || Date.now().toString(),
      fileName: file.name,
      fileUrl: data.url,
      fileSize: file.size,
      mimeType: file.type,
    };
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          uploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-gray-700 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {acceptedTypes.join(", ")} (Max {maxSizeMB}MB per file, {maxFiles} files max)
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <File className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

