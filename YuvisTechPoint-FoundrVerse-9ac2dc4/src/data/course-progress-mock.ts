// Mock course progress data store
// TODO: Replace with Prisma/database when backend is ready

export interface CourseModule {
  id: string;
  title: string;
  type: "video" | "reading" | "assignment";
  completed: boolean;
  duration?: string;
  week: number;
}

export interface CourseProgress {
  userId: string;
  progress: number; // 0-100
  modules: CourseModule[];
  totalModules: number;
  completedModules: number;
  startedAt?: string;
  completedAt?: string;
}

// Course modules structure
const allModules: CourseModule[] = [
  // Week 1
  { id: "w1-1", title: "Introduction to Startups", type: "video", completed: false, duration: "45 min", week: 1 },
  { id: "w1-2", title: "Idea Validation Fundamentals", type: "video", completed: false, duration: "60 min", week: 1 },
  { id: "w1-3", title: "Market Research & Analysis", type: "reading", completed: false, duration: "30 min", week: 1 },
  { id: "w1-4", title: "Week 1 Assignment: Validate Your Idea", type: "assignment", completed: false, week: 1 },
  
  // Week 2
  { id: "w2-1", title: "MVP Development Basics", type: "video", completed: false, duration: "50 min", week: 2 },
  { id: "w2-2", title: "No-Code Build Workshop", type: "video", completed: false, duration: "60 min", week: 2 },
  { id: "w2-3", title: "Prototyping Tools", type: "reading", completed: false, duration: "25 min", week: 2 },
  { id: "w2-4", title: "Week 2 Assignment: Build Your MVP", type: "assignment", completed: false, week: 2 },
  
  // Week 3
  { id: "w3-1", title: "Marketing Fundamentals", type: "video", completed: false, duration: "55 min", week: 3 },
  { id: "w3-2", title: "Social Media Masterclass", type: "video", completed: false, duration: "50 min", week: 3 },
  { id: "w3-3", title: "Branding Essentials", type: "reading", completed: false, duration: "35 min", week: 3 },
  { id: "w3-4", title: "Week 3 Assignment: Create Marketing Plan", type: "assignment", completed: false, week: 3 },
  
  // Week 4
  { id: "w4-1", title: "Pitching to Investors", type: "video", completed: false, duration: "60 min", week: 4 },
  { id: "w4-2", title: "Financial Planning", type: "video", completed: false, duration: "45 min", week: 4 },
  { id: "w4-3", title: "Legal Basics for Startups", type: "reading", completed: false, duration: "40 min", week: 4 },
  { id: "w4-4", title: "Final Project: Pitch Deck", type: "assignment", completed: false, week: 4 },
];

// In-memory store for course progress
const progressStore = new Map<string, CourseProgress>();

// Initialize progress for a user (if not exists)
export function initializeProgress(userId: string): CourseProgress {
  if (progressStore.has(userId)) {
    return progressStore.get(userId)!;
  }

  const progress: CourseProgress = {
    userId,
    progress: 0,
    modules: allModules.map(m => ({ ...m, completed: false })),
    totalModules: allModules.length,
    completedModules: 0,
    startedAt: new Date().toISOString(),
  };

  progressStore.set(userId, progress);
  return progress;
}

// Get progress for a user
export function getCourseProgress(userId: string): CourseProgress {
  return initializeProgress(userId);
}

// Update module completion
export function completeModule(userId: string, moduleId: string): CourseProgress {
  const progress = getCourseProgress(userId);
  const module = progress.modules.find(m => m.id === moduleId);
  
  if (module && !module.completed) {
    module.completed = true;
    progress.completedModules = progress.modules.filter(m => m.completed).length;
    progress.progress = Math.round((progress.completedModules / progress.totalModules) * 100);
    
    if (progress.progress === 100 && !progress.completedAt) {
      progress.completedAt = new Date().toISOString();
    }
    
    progressStore.set(userId, progress);
  }
  
  return progress;
}

// Set progress for a user (for testing/admin purposes)
export function setCourseProgress(userId: string, progressPercentage: number): CourseProgress {
  const progress = getCourseProgress(userId);
  const targetCompleted = Math.round((progressPercentage / 100) * progress.totalModules);
  
  // Mark modules as completed up to target
  progress.modules.forEach((module, index) => {
    module.completed = index < targetCompleted;
  });
  
  progress.completedModules = progress.modules.filter(m => m.completed).length;
  progress.progress = Math.round((progress.completedModules / progress.totalModules) * 100);
  
  if (progress.progress === 100 && !progress.completedAt) {
    progress.completedAt = new Date().toISOString();
  }
  
  progressStore.set(userId, progress);
  return progress;
}

// Check if course is completed
export function isCourseCompleted(userId: string): boolean {
  const progress = getCourseProgress(userId);
  return progress.progress >= 100;
}

