// Task Scheduling & Dependencies Types
// Phase 2 - Task management with dependencies and scheduling

export type TaskId = string;
export type TaskStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'blocked' | 'cancelled' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// Task Definition
export interface Task {
 id: TaskId;
 name: string;
 description: string;
 status: TaskStatus;
 priority: TaskPriority;
 
 // Scheduling
 scheduledStart?: Date;
 scheduledEnd?: Date;
 actualStart?: Date;
 actualEnd?: Date;
 duration: number; // in minutes
 estimatedEffort: number; // in hours
 
 // Recurrence
 isRecurring: boolean;
 recurrence?: RecurrenceConfig;
 
 // Assignment
 assigneeId?: string;
 assigneeName?: string;
 assigneeAvatar?: string;
 
 // Organization
 projectId?: string;
 projectName?: string;
 tags: string[];
 category?: string;
 
 // Progress
 progress: number; // 0-100
 completedSubtasks: number;
 totalSubtasks: number;
 
 // Dependencies
 dependencies: TaskDependency[];
 dependents: TaskId[]; // Tasks that depend on this one
 
 // Metadata
 createdAt: Date;
 updatedAt: Date;
 createdBy: string;
 color?: string;
 icon?: string;
 
 // Custom data
 metadata: Record<string, unknown>;
}

export interface RecurrenceConfig {
 pattern: RecurrencePattern;
 interval: number; // e.g., every 2 weeks
 daysOfWeek?: number[]; // 0-6 for weekly
 dayOfMonth?: number; // 1-31 for monthly
 monthOfYear?: number; // 1-12 for yearly
 endDate?: Date;
 maxOccurrences?: number;
 occurrenceCount: number;
}

export interface TaskDependency {
 id: string;
 taskId: TaskId;
 dependsOnId: TaskId;
 dependsOnName?: string;
 type: DependencyType;
 lag: number; // in minutes, can be negative
 isStrong: boolean; // Strong dependencies block the task
}

// Scheduling Types
export interface TimeSlot {
 start: Date;
 end: Date;
 available: boolean;
 taskId?: TaskId;
}

export interface ScheduleConstraint {
 id: string;
 type: 'no_earlier_than' | 'no_later_than' | 'must_start_on' | 'must_end_on' | 'as_soon_as_possible' | 'as_late_as_possible';
 date?: Date;
 priority: number;
}

export interface ResourceAllocation {
 taskId: TaskId;
 resourceId: string;
 resourceName: string;
 resourceType: 'person' | 'equipment' | 'room' | 'other';
 allocation: number; // 0-100 percentage
 startTime: Date;
 endTime: Date;
}

// Critical Path Analysis
export interface CriticalPathResult {
 criticalPath: TaskId[];
 criticalTasks: Task[];
 totalDuration: number;
 projectEnd: Date;
 slack: Record<TaskId, number>; // Slack time in minutes
 earlyStart: Record<TaskId, Date>;
 earlyFinish: Record<TaskId, Date>;
 lateStart: Record<TaskId, Date>;
 lateFinish: Record<TaskId, Date>;
}

// Gantt Chart Types
export interface GanttTask {
 id: TaskId;
 name: string;
 start: Date;
 end: Date;
 progress: number;
 dependencies: string;
 color: string;
 milestone: boolean;
 parent?: TaskId;
 collapsed?: boolean;
}

export interface GanttMilestone {
 id: string;
 name: string;
 date: Date;
 color: string;
 taskId?: TaskId;
}

// Calendar Types
export interface CalendarEvent {
 id: string;
 taskId: TaskId;
 title: string;
 start: Date;
 end: Date;
 allDay: boolean;
 color: string;
 type: 'task' | 'deadline' | 'milestone' | 'reminder';
}

// Validation Types
export interface ScheduleValidationResult {
 isValid: boolean;
 errors: ScheduleError[];
 warnings: ScheduleWarning[];
 conflicts: ScheduleConflict[];
}

export interface ScheduleError {
 type: 'circular_dependency' | 'invalid_dates' | 'missing_dependency' | 'resource_conflict';
 message: string;
 taskIds: TaskId[];
}

export interface ScheduleWarning {
 type: 'overdue' | 'near_deadline' | 'resource_overallocation' | 'long_duration';
 message: string;
 taskIds: TaskId[];
}

export interface ScheduleConflict {
 type: 'overlap' | 'resource' | 'deadline';
 tasks: TaskId[];
 resourceId?: string;
 message: string;
 suggestedResolution?: string;
}

// Analytics Types
export interface ScheduleAnalytics {
 totalTasks: number;
 completedTasks: number;
 onTrackTasks: number;
 delayedTasks: number;
 blockedTasks: number;
 averageCompletionTime: number;
 onTimeDeliveryRate: number;
 tasksByStatus: Record<TaskStatus, number>;
 tasksByPriority: Record<TaskPriority, number>;
 upcomingDeadlines: Array<{ taskId: TaskId; deadline: Date; daysRemaining: number }>;
 overdueTasks: Task[];
 workloadByAssignee: Record<string, number>;
}

// Project Timeline
export interface ProjectTimeline {
 id: string;
 name: string;
 startDate: Date;
 endDate: Date;
 tasks: Task[];
 milestones: GanttMilestone[];
 criticalPath: CriticalPathResult;
 workingHoursPerDay: number;
 workingDays: number[]; // 0-6, Sunday = 0
 holidays: Date[];
}

// Template Types
export interface TaskTemplate {
 id: string;
 name: string;
 description: string;
 category: string;
 icon: string;
 defaultDuration: number;
 defaultPriority: TaskPriority;
 defaultTags: string[];
 subtasks?: string[];
 color: string;
}

export interface ProjectTemplate {
 id: string;
 name: string;
 description: string;
 category: string;
 icon: string;
 tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>[];
 milestones: Omit<GanttMilestone, 'id'>[];
}

// Notification Types
export interface TaskNotification {
 id: string;
 taskId: TaskId;
 type: 'deadline' | 'assignment' | 'status_change' | 'comment' | 'dependency_completed' | 'blocked' | 'overdue';
 title: string;
 message: string;
 createdAt: Date;
 readAt?: Date;
 userId: string;
 actionUrl?: string;
}
