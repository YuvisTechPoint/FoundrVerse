"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Download, CheckCircle, Lock, Eye, Share2, Shield, Copy, CheckCircle2, Trophy, Star, Badge } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface CertificateSectionProps {
  userName: string;
  userEmail: string;
  hasPurchased: boolean;
  isCourseCompleted: boolean;
}

export default function CertificateSection({ userName, userEmail, hasPurchased, isCourseCompleted }: CertificateSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateId, setCertificateId] = useState<string>("");
  const { toast } = useToast();

  // Generate certificate ID
  const generateCertificateId = () => {
    if (!certificateId) {
      const id = `${userEmail.split('@')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      setCertificateId(id);
      return id;
    }
    return certificateId;
  };

  // Copy certificate verification link
  const handleCopyVerificationLink = () => {
    const id = generateCertificateId();
    const verificationLink = `${window.location.origin}/verify-certificate/${id}`;
    navigator.clipboard.writeText(verificationLink);
    toast({
      title: "Verification link copied!",
      description: "Share this link to verify your certificate",
    });
  };

  // Share certificate
  const handleShareCertificate = async () => {
    if (!isCourseCompleted) {
      toast({
        title: "Certificate not available",
        description: "Complete the course to share your certificate",
        variant: "destructive",
      });
      return;
    }

    const id = generateCertificateId();
    const verificationLink = `${window.location.origin}/verify-certificate/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Startup Certificate - FoundrVerse",
          text: `I've completed the 30-Day Startup Blueprint course! Verify my certificate: ${verificationLink}`,
          url: verificationLink,
        });
      } catch (error) {
        // User cancelled or error occurred
        handleCopyVerificationLink();
      }
    } else {
      handleCopyVerificationLink();
    }
  };

  const handleDownloadCertificate = async () => {
    if (!hasPurchased) {
      alert("Please complete the course purchase to download your certificate.");
      return;
    }

    if (!isCourseCompleted) {
      alert("Please complete all course modules (100% progress) to download your certificate.");
      return;
    }

    setIsGenerating(true);
    try {
      // Create certificate HTML
      const certificateHTML = generateCertificateHTML(userName, userEmail);
      
      // Create a new window with the certificate
      const printWindow = window.open("", "_blank", "width=1200,height=800");
      if (!printWindow) {
        throw new Error("Failed to open print window. Please allow popups.");
      }
      
      printWindow.document.open();
      printWindow.document.write(certificateHTML);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setIsGenerating(false);
        }, 500);
      };
      
      // Fallback in case onload doesn't fire
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.focus();
          printWindow.print();
          setIsGenerating(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to generate certificate. Please try again.");
      setIsGenerating(false);
    }
  };

  const generateCertificateHTML = (name: string, email: string): string => {
    const id = generateCertificateId();
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .certificate {
      width: 11.69in;
      height: 8.27in;
      background: white;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 60px;
    }
    .border {
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 8px solid #f59e0b;
      border-radius: 10px;
    }
    .inner-border {
      position: absolute;
      top: 50px;
      left: 50px;
      right: 50px;
      bottom: 50px;
      border: 2px solid #d97706;
      border-radius: 5px;
    }
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header {
      margin-top: 40px;
    }
    .logo {
      font-size: 48px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    .subtitle {
      font-size: 18px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 60px;
    }
    .title {
      font-size: 42px;
      font-weight: bold;
      color: #1f2937;
      margin: 40px 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .certificate-text {
      font-size: 24px;
      color: #374151;
      margin: 30px 0;
      line-height: 1.8;
    }
    .name {
      font-size: 48px;
      font-weight: bold;
      color: #1f2937;
      margin: 30px 0;
      text-decoration: underline;
      text-decoration-color: #f59e0b;
      text-decoration-thickness: 3px;
      text-underline-offset: 10px;
    }
    .description {
      font-size: 20px;
      color: #6b7280;
      margin: 30px 0;
      line-height: 1.6;
    }
    .footer {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature {
      text-align: center;
      width: 200px;
    }
    .signature-line {
      border-top: 2px solid #1f2937;
      margin: 60px auto 10px;
      width: 150px;
    }
    .signature-name {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    .signature-title {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    .date {
      text-align: center;
      width: 200px;
    }
    .date-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 5px;
    }
    .date-value {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    .certificate-id {
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-size: 12px;
      color: #9ca3af;
    }
    .seal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border: 4px solid #f59e0b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 158, 11, 0.1);
      opacity: 0.3;
      font-size: 80px;
      color: #f59e0b;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .certificate {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border"></div>
    <div class="inner-border"></div>
    <div class="seal">✓</div>
    <div class="content">
      <div class="header">
        <div class="logo">Mewayz</div>
        <div class="subtitle">FoundrVerse</div>
        <div class="title">Certificate of Completion</div>
      </div>
      
      <div class="certificate-text">
        This is to certify that
      </div>
      
      <div class="name">${name}</div>
      
      <div class="description">
        has successfully completed the comprehensive course on<br>
        <strong>Practical Startup School for Students</strong><br>
        demonstrating proficiency in startup fundamentals, idea validation, MVP development,<br>
        marketing, branding, and entrepreneurship.
      </div>
      
      <div class="footer">
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-name">Founder & CEO</div>
          <div class="signature-title">Mewayz - FoundrVerse</div>
        </div>
        <div class="date">
          <div class="date-label">Date of Completion</div>
          <div class="date-value">${date}</div>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-name">Program Director</div>
          <div class="signature-title">Mewayz - FoundrVerse</div>
        </div>
      </div>
      
      <div class="certificate-id">
        Certificate ID: ${id}
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/40 to-yellow-50/30 dark:from-gray-900 dark:via-amber-950/20 dark:to-yellow-950/10 border-2 border-amber-200 dark:border-amber-800/60 rounded-2xl shadow-lg dark:shadow-xl p-8 mb-8 hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Course Completion Certificate</h2>
            <p className="text-gray-600 dark:text-gray-400">Download your official certificate of completion</p>
          </div>
        </div>
      </div>

      {/* Certificate Features */}
      {hasPurchased && isCourseCompleted && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Verification Feature */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Verification</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Verify your certificate authenticity</p>
            <button
              onClick={handleCopyVerificationLink}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </button>
          </motion.div>

          {/* Share Feature */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800/50 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Share</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Share your achievement</p>
            <button
              onClick={handleShareCertificate}
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Now
            </button>
          </motion.div>

          {/* Achievements Feature */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Achievements</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">View your course achievements</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Course Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Certificate Earned</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {hasPurchased ? (
        <div className="space-y-4">
          {isCourseCompleted ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border-2 border-green-300 dark:border-green-800 rounded-xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Course Completed</p>
                <p className="text-sm text-green-700 dark:text-green-300">You're eligible to download your certificate</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-xl shadow-sm">
              <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">Complete Course to Unlock Certificate</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Finish all course modules to download your certificate</p>
              </div>
            </div>
          )}

          {/* Certificate Preview */}
          <div className="relative max-w-2xl mx-auto">
            <div className={`relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 shadow-lg ${
              isCourseCompleted 
                ? "border-amber-400 dark:border-amber-700 shadow-amber-500/20" 
                : "border-gray-300 dark:border-gray-700"
            }`}>
              {/* Blurred Certificate Preview */}
              <div className={`relative ${!isCourseCompleted ? "blur-sm" : ""}`}>
                <div className="aspect-[11.69/8.27] bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 sm:p-6">
                  {/* Certificate Border */}
                  <div className="absolute inset-2 border-3 border-amber-400 dark:border-amber-600 rounded-lg"></div>
                  <div className="absolute inset-3 border-2 border-amber-500 dark:border-amber-500 rounded"></div>
                  
                  {/* Certificate Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src="/images/mewayz.jpeg"
                          alt="Mewayz Logo"
                          fill
                          className="object-contain rounded-lg"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">Mewayz</h3>
                        <p className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">FoundrVerse</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                      Certificate of Completion
                    </h2>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      This is to certify that
                    </p>
                    
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-2">
                        {userName}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xl px-2">
                      has successfully completed the comprehensive course on<br />
                      <strong className="text-gray-900 dark:text-white">Practical Startup School for Students</strong>
                    </p>
                    
                    <div className="mt-4 flex items-center gap-4 text-[10px]">
                      <div className="text-center">
                        <div className="w-20 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
                        <p className="text-[9px] font-semibold text-gray-900 dark:text-white">Founder & CEO</p>
                        <p className="text-[8px] text-gray-600 dark:text-gray-400">Mewayz - FoundrVerse</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">Date</p>
                        <p className="text-[9px] font-bold text-gray-900 dark:text-white">
                          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
                        <p className="text-[9px] font-semibold text-gray-900 dark:text-white">Program Director</p>
                        <p className="text-[8px] text-gray-600 dark:text-gray-400">Mewayz - FoundrVerse</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lock Overlay */}
              {!isCourseCompleted && (
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-20 rounded-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-amber-500/90 dark:bg-amber-600/90 rounded-full flex items-center justify-center shadow-2xl">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-base mb-1">Certificate Locked</p>
                    <p className="text-white/90 text-xs">Complete all course modules to unlock</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Preview Badge */}
            {!isCourseCompleted && (
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preview</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: isCourseCompleted ? 1.02 : 1 }}
            whileTap={{ scale: isCourseCompleted ? 0.98 : 1 }}
            onClick={handleDownloadCertificate}
            disabled={isGenerating || !isCourseCompleted}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
              isCourseCompleted
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white hover:shadow-xl"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Certificate...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                <span>Download Certificate (PDF)</span>
              </>
            )}
          </motion.button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Your certificate will include your name, completion date, and a unique certificate ID
          </p>

          {/* Certificate Achievements Badge */}
          {isCourseCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-50 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-800/60 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Certificate Achievements</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    You've unlocked all certificate features and achievements!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: CheckCircle2, label: "Course Completed", color: "text-green-600 dark:text-green-400" },
                      { icon: Award, label: "Certificate Earned", color: "text-amber-600 dark:text-amber-400" },
                      { icon: Shield, label: "Verification Ready", color: "text-blue-600 dark:text-blue-400" },
                      { icon: Share2, label: "Shareable", color: "text-purple-600 dark:text-purple-400" },
                    ].map((achievement, idx) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-amber-200 dark:border-amber-800/50">
                          <Icon className={`w-4 h-4 ${achievement.color}`} />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{achievement.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-xl shadow-sm">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Certificate Available After Purchase</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Complete the course purchase to unlock your certificate download
              </p>
            </div>
          </div>

          {/* Certificate Preview - Locked (Not Purchased) */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-lg">
              {/* Blurred Certificate Preview */}
              <div className="relative blur-md">
                <div className="aspect-[11.69/8.27] bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 sm:p-6">
                  {/* Certificate Border */}
                  <div className="absolute inset-2 border-3 border-amber-400 dark:border-amber-600 rounded-lg"></div>
                  <div className="absolute inset-3 border-2 border-amber-500 dark:border-amber-500 rounded"></div>
                  
                  {/* Certificate Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src="/images/mewayz.jpeg"
                          alt="Mewayz Logo"
                          fill
                          className="object-contain rounded-lg"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">Mewayz</h3>
                        <p className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">FoundrVerse</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                      Certificate of Completion
                    </h2>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      This is to certify that
                    </p>
                    
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-2">
                        {userName}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xl px-2">
                      has successfully completed the comprehensive course on<br />
                      <strong className="text-gray-900 dark:text-white">Practical Startup School for Students</strong>
                    </p>
                    
                    <div className="mt-4 flex items-center gap-4 text-[10px]">
                      <div className="text-center">
                        <div className="w-20 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
                        <p className="text-[9px] font-semibold text-gray-900 dark:text-white">Founder & CEO</p>
                        <p className="text-[8px] text-gray-600 dark:text-gray-400">Mewayz - FoundrVerse</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">Date</p>
                        <p className="text-[9px] font-bold text-gray-900 dark:text-white">
                          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1"></div>
                        <p className="text-[9px] font-semibold text-gray-900 dark:text-white">Program Director</p>
                        <p className="text-[8px] text-gray-600 dark:text-gray-400">Mewayz - FoundrVerse</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lock Overlay - Stronger for not purchased */}
              <div className="absolute inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-20 rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-amber-500/95 dark:bg-amber-600/95 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-bold text-base mb-1">Certificate Locked</p>
                  <p className="text-white/90 text-sm">Purchase the course to unlock</p>
                </div>
              </div>
            </div>
            
            {/* Preview Badge */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preview</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

