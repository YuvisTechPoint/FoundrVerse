import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { createAssignment } from "@/lib/db/services/assignments";
import { createCourseModule } from "@/lib/db/services/course-progress";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const POST = withErrorHandling(
  withAdminAuth(async (request: NextRequest) => {
    try {
      // Create default assignments
      const assignments = [
        {
          title: "Week 1: Validate Your Idea",
          week: 1,
          description: "Research and validate your startup idea. Create a validation report with market analysis, competitor research, and customer interviews.",
          type: "assignment" as const,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
          maxScore: 100,
          instructions: "1. Identify your target market\n2. Research 5 competitors\n3. Interview at least 3 potential customers\n4. Create a validation report (PDF format)",
        },
        {
          title: "Week 2: Build Your MVP",
          week: 2,
          description: "Create a minimum viable product using no-code tools. Document your build process and create a demo.",
          type: "project" as const,
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 21 days from now
          maxScore: 100,
          instructions: "1. Choose a no-code platform (Bubble, Webflow, etc.)\n2. Build your MVP with core features\n3. Create a demo video (2-3 minutes)\n4. Document your build process",
        },
        {
          title: "Week 3: Create Marketing Plan",
          week: 3,
          description: "Develop a comprehensive marketing strategy including social media plan, branding guidelines, and content calendar.",
          type: "assignment" as const,
          dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 28 days from now
          maxScore: 100,
          instructions: "1. Define your brand identity\n2. Create social media accounts\n3. Develop a 30-day content calendar\n4. Write a marketing strategy document",
        },
        {
          title: "Week 4: Final Pitch Deck",
          week: 4,
          description: "Create a complete pitch deck for investors. Include problem, solution, market size, business model, and financial projections.",
          type: "project" as const,
          dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 35 days from now
          maxScore: 100,
          instructions: "1. Use a pitch deck template (Pitch.com, Canva, etc.)\n2. Include all required slides: Problem, Solution, Market, Business Model, Financials\n3. Create a 5-minute presentation video\n4. Export as PDF",
        },
      ];

      // Create default course modules
      const courseModules = [
        // Week 1
        { title: "Introduction to Startups", type: "video" as const, week: 1, order: 1, duration: "45 min", youtubeId: "BxV14h0kFs0" },
        { title: "Idea Validation Fundamentals", type: "video" as const, week: 1, order: 2, duration: "60 min", youtubeId: "U6Z8FkjpR8E" },
        { title: "Market Research & Analysis", type: "reading" as const, week: 1, order: 3, duration: "30 min" },
        { title: "Week 1 Assignment: Validate Your Idea", type: "assignment" as const, week: 1, order: 4 },
        
        // Week 2
        { title: "MVP Development Basics", type: "video" as const, week: 2, order: 1, duration: "50 min", youtubeId: "kXYiU_JCYtU" },
        { title: "No-Code Build Workshop", type: "video" as const, week: 2, order: 2, duration: "60 min", youtubeId: "BxV14h0kFs0" },
        { title: "Prototyping Tools", type: "reading" as const, week: 2, order: 3, duration: "25 min" },
        { title: "Week 2 Assignment: Build Your MVP", type: "assignment" as const, week: 2, order: 4 },
        
        // Week 3
        { title: "Marketing Fundamentals", type: "video" as const, week: 3, order: 1, duration: "55 min", youtubeId: "U6Z8FkjpR8E" },
        { title: "Social Media Masterclass", type: "video" as const, week: 3, order: 2, duration: "50 min", youtubeId: "kXYiU_JCYtU" },
        { title: "Branding Essentials", type: "reading" as const, week: 3, order: 3, duration: "35 min" },
        { title: "Week 3 Assignment: Create Marketing Plan", type: "assignment" as const, week: 3, order: 4 },
        
        // Week 4
        { title: "Pitching to Investors", type: "video" as const, week: 4, order: 1, duration: "60 min", youtubeId: "BxV14h0kFs0" },
        { title: "Financial Planning", type: "video" as const, week: 4, order: 2, duration: "45 min", youtubeId: "U6Z8FkjpR8E" },
        { title: "Legal Basics for Startups", type: "reading" as const, week: 4, order: 3, duration: "40 min" },
        { title: "Final Project: Pitch Deck", type: "assignment" as const, week: 4, order: 4 },
      ];

      // Create assignments
      const createdAssignments = [];
      for (const assignment of assignments) {
        const created = await createAssignment(assignment);
        createdAssignments.push(created);
      }

      // Create course modules
      const createdModules = [];
      for (const module of courseModules) {
        const created = await createCourseModule(module);
        createdModules.push(created);
      }

      logger.info("Database seeded successfully", {
        assignments: createdAssignments.length,
        modules: createdModules.length,
      });

      return successResponse({
        message: "Database seeded successfully",
        assignments: createdAssignments.length,
        modules: createdModules.length,
      });
    } catch (error: any) {
      logger.error("Failed to seed database", error);
      return errorResponse(error.message || "Failed to seed database", 500);
    }
  })
);

