// Task Scheduler Configuration
// Phase 2 - Templates and configuration for task scheduling

import type { TaskTemplate, ProjectTemplate, TaskPriority } from './types';
import { generateId } from './engine';

// ============================================================================
// Task Templates
// ============================================================================

export const taskTemplates: TaskTemplate[] = [
 {
 id: 'task-meeting',
 name: 'Meeting',
 description: 'Schedule a meeting',
 category: 'Communication',
 icon: 'solar:users-group-rounded-bold',
 defaultDuration: 60,
 defaultPriority: 'medium',
 defaultTags: ['meeting'],
 color: '#3b82f6',
 },
 {
 id: 'task-review',
 name: 'Code Review',
 description: 'Review code changes',
 category: 'Development',
 icon: 'solar:code-scan-bold',
 defaultDuration: 60,
 defaultPriority: 'high',
 defaultTags: ['code-review', 'development'],
 color: '#8b5cf6',
 },
 {
 id: 'task-bug-fix',
 name: 'Bug Fix',
 description: 'Fix a bug or issue',
 category: 'Development',
 icon: 'solar:bug-bold',
 defaultDuration: 120,
 defaultPriority: 'high',
 defaultTags: ['bug', 'development'],
 color: '#ef4444',
 },
 {
 id: 'task-feature',
 name: 'Feature Development',
 description: 'Develop a new feature',
 category: 'Development',
 icon: 'solar:programming-bold',
 defaultDuration: 480,
 defaultPriority: 'medium',
 defaultTags: ['feature', 'development'],
 color: '#10b981',
 },
 {
 id: 'task-documentation',
 name: 'Documentation',
 description: 'Write or update documentation',
 category: 'Documentation',
 icon: 'solar:document-text-bold',
 defaultDuration: 120,
 defaultPriority: 'low',
 defaultTags: ['documentation'],
 color: '#f59e0b',
 },
 {
 id: 'task-testing',
 name: 'Testing',
 description: 'Write or run tests',
 category: 'Quality',
 icon: 'solar:test-tube-bold',
 defaultDuration: 180,
 defaultPriority: 'medium',
 defaultTags: ['testing', 'quality'],
 color: '#06b6d4',
 },
 {
 id: 'task-deployment',
 name: 'Deployment',
 description: 'Deploy application',
 category: 'Operations',
 icon: 'solar:upload-bold',
 defaultDuration: 60,
 defaultPriority: 'urgent',
 defaultTags: ['deployment', 'operations'],
 color: '#ec4899',
 },
 {
 id: 'task-design',
 name: 'Design Review',
 description: 'Review design mockups',
 category: 'Design',
 icon: 'solar:palette-bold',
 defaultDuration: 90,
 defaultPriority: 'medium',
 defaultTags: ['design', 'review'],
 color: '#f97316',
 },
 {
 id: 'task-research',
 name: 'Research',
 description: 'Research and investigation',
 category: 'Planning',
 icon: 'solar:magnifer-bold',
 defaultDuration: 240,
 defaultPriority: 'medium',
 defaultTags: ['research'],
 color: '#84cc16',
 },
 {
 id: 'task-planning',
 name: 'Sprint Planning',
 description: 'Plan upcoming sprint',
 category: 'Planning',
 icon: 'solar:calendar-bold',
 defaultDuration: 120,
 defaultPriority: 'high',
 defaultTags: ['planning', 'sprint'],
 color: '#6366f1',
 },
];

// ============================================================================
// Project Templates
// ============================================================================

export const projectTemplates: ProjectTemplate[] = [
 {
 id: 'project-software',
 name: 'Software Development',
 description: 'Standard software development project with all phases',
 category: 'Development',
 icon: 'solar:programming-bold',
 tasks: [
 {
 name: 'Requirements Gathering',
 description: 'Collect and document requirements',
 priority: 'high',
 duration: 480,
 estimatedEffort: 8,
 isRecurring: false,
 tags: ['requirements', 'planning'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#3b82f6',
 icon: 'solar:clipboard-list-bold',
 metadata: { phase: 'planning' },
 },
 {
 name: 'Technical Design',
 description: 'Create technical design documents',
 priority: 'high',
 duration: 480,
 estimatedEffort: 8,
 isRecurring: false,
 tags: ['design', 'architecture'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#8b5cf6',
 icon: 'solar:document-text-bold',
 metadata: { phase: 'design' },
 },
 {
 name: 'Development Sprint 1',
 description: 'First development sprint',
 priority: 'high',
 duration: 2400,
 estimatedEffort: 40,
 isRecurring: false,
 tags: ['development', 'sprint'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#10b981',
 icon: 'solar:code-bold',
 metadata: { phase: 'development' },
 },
 {
 name: 'Code Review',
 description: 'Review all code changes',
 priority: 'high',
 duration: 240,
 estimatedEffort: 4,
 isRecurring: false,
 tags: ['review', 'quality'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#6366f1',
 icon: 'solar:code-scan-bold',
 metadata: { phase: 'review' },
 },
 {
 name: 'Testing',
 description: 'QA testing and bug fixes',
 priority: 'high',
 duration: 960,
 estimatedEffort: 16,
 isRecurring: false,
 tags: ['testing', 'qa'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#06b6d4',
 icon: 'solar:test-tube-bold',
 metadata: { phase: 'testing' },
 },
 {
 name: 'Deployment',
 description: 'Deploy to production',
 priority: 'critical',
 duration: 120,
 estimatedEffort: 2,
 isRecurring: false,
 tags: ['deployment', 'release'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#ef4444',
 icon: 'solar:upload-bold',
 metadata: { phase: 'deployment' },
 },
 ],
 milestones: [
 { name: 'Design Complete', date: new Date(), color: '#8b5cf6' },
 { name: 'Development Complete', date: new Date(), color: '#10b981' },
 { name: 'Release', date: new Date(), color: '#ef4444' },
 ],
 },
 {
 id: 'project-marketing',
 name: 'Marketing Campaign',
 description: 'Marketing campaign planning and execution',
 category: 'Marketing',
 icon: 'solar:chart-bold',
 tasks: [
 {
 name: 'Campaign Strategy',
 description: 'Define campaign goals and strategy',
 priority: 'high',
 duration: 240,
 estimatedEffort: 4,
 isRecurring: false,
 tags: ['strategy', 'planning'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#6366f1',
 icon: 'solar:target-bold',
 metadata: { phase: 'planning' },
 },
 {
 name: 'Content Creation',
 description: 'Create marketing content',
 priority: 'high',
 duration: 960,
 estimatedEffort: 16,
 isRecurring: false,
 tags: ['content', 'creative'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#f59e0b',
 icon: 'solar:document-add-bold',
 metadata: { phase: 'creation' },
 },
 {
 name: 'Campaign Launch',
 description: 'Launch the marketing campaign',
 priority: 'critical',
 duration: 60,
 estimatedEffort: 1,
 isRecurring: false,
 tags: ['launch', 'execution'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#10b981',
 icon: 'solar:rocket-bold',
 metadata: { phase: 'launch' },
 },
 {
 name: 'Analytics Review',
 description: 'Review campaign performance',
 priority: 'medium',
 duration: 120,
 estimatedEffort: 2,
 isRecurring: true,
 recurrence: {
 pattern: 'weekly',
 interval: 1,
 occurrenceCount: 0,
 },
 tags: ['analytics', 'reporting'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#3b82f6',
 icon: 'solar:chart-2-bold',
 metadata: { phase: 'monitoring' },
 },
 ],
 milestones: [
 { name: 'Strategy Approved', date: new Date(), color: '#6366f1' },
 { name: 'Content Ready', date: new Date(), color: '#f59e0b' },
 { name: 'Campaign Live', date: new Date(), color: '#10b981' },
 ],
 },
 {
 id: 'project-event',
 name: 'Event Planning',
 description: 'Plan and organize an event',
 category: 'Events',
 icon: 'solar:calendar-bold',
 tasks: [
 {
 name: 'Venue Selection',
 description: 'Research and book venue',
 priority: 'high',
 duration: 480,
 estimatedEffort: 8,
 isRecurring: false,
 tags: ['venue', 'logistics'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#8b5cf6',
 icon: 'solar:buildings-bold',
 metadata: { phase: 'planning' },
 },
 {
 name: 'Guest List Management',
 description: 'Compile and manage guest list',
 priority: 'medium',
 duration: 240,
 estimatedEffort: 4,
 isRecurring: false,
 tags: ['guests', 'invitations'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#3b82f6',
 icon: 'solar:users-group-rounded-bold',
 metadata: { phase: 'preparation' },
 },
 {
 name: 'Catering Setup',
 description: 'Arrange catering services',
 priority: 'high',
 duration: 180,
 estimatedEffort: 3,
 isRecurring: false,
 tags: ['catering', 'food'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#f59e0b',
 icon: 'solar:chef-hat-bold',
 metadata: { phase: 'preparation' },
 },
 {
 name: 'Event Execution',
 description: 'Run the event',
 priority: 'critical',
 duration: 480,
 estimatedEffort: 8,
 isRecurring: false,
 tags: ['event', 'execution'],
 progress: 0,
 completedSubtasks: 0,
 totalSubtasks: 0,
 dependencies: [],
 dependents: [],
 createdBy: 'system',
 color: '#10b981',
 icon: 'solar:confetti-bold',
 metadata: { phase: 'execution' },
 },
 ],
 milestones: [
 { name: 'Venue Booked', date: new Date(), color: '#8b5cf6' },
 { name: 'Invitations Sent', date: new Date(), color: '#3b82f6' },
 { name: 'Event Day', date: new Date(), color: '#10b981' },
 ],
 },
];

// ============================================================================
// Priority Configuration
// ============================================================================

export const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: string; weight: number }> = {
 low: {
 label: 'Low',
 color: '#94a3b8',
 icon: 'solar:arrow-down-bold',
 weight: 1,
 },
 medium: {
 label: 'Medium',
 color: '#3b82f6',
 icon: 'solar:minus-bold',
 weight: 2,
 },
 high: {
 label: 'High',
 color: '#f59e0b',
 icon: 'solar:arrow-up-bold',
 weight: 3,
 },
 urgent: {
 label: 'Urgent',
 color: '#ef4444',
 icon: 'solar:danger-triangle-bold',
 weight: 4,
 },
 critical: {
 label: 'Critical',
 color: '#dc2626',
 icon: 'solar:fire-bold',
 weight: 5,
 },
};

// ============================================================================
// Status Configuration
// ============================================================================

export const statusConfig = {
 pending: {
 label: 'Pending',
 color: '#94a3b8',
 icon: 'solar:clock-circle-bold',
 description: 'Task not yet started',
 },
 scheduled: {
 label: 'Scheduled',
 color: '#3b82f6',
 icon: 'solar:calendar-bold',
 description: 'Task is scheduled',
 },
 in_progress: {
 label: 'In Progress',
 color: '#f59e0b',
 icon: 'solar:play-circle-bold',
 description: 'Task is being worked on',
 },
 completed: {
 label: 'Completed',
 color: '#10b981',
 icon: 'solar:check-circle-bold',
 description: 'Task is complete',
 },
 blocked: {
 label: 'Blocked',
 color: '#ef4444',
 icon: 'solar:danger-triangle-bold',
 description: 'Task is blocked by dependencies',
 },
 cancelled: {
 label: 'Cancelled',
 color: '#6b7280',
 icon: 'solar:close-circle-bold',
 description: 'Task was cancelled',
 },
 failed: {
 label: 'Failed',
 color: '#dc2626',
 icon: 'solar:close-square-bold',
 description: 'Task failed',
 },
};

// ============================================================================
// Dependency Type Configuration
// ============================================================================

export const dependencyTypeConfig = {
 finish_to_start: {
 label: 'Finish to Start',
 description: 'Task B starts when Task A finishes',
 abbreviation: 'FS',
 },
 start_to_start: {
 label: 'Start to Start',
 description: 'Task B starts when Task A starts',
 abbreviation: 'SS',
 },
 finish_to_finish: {
 label: 'Finish to Finish',
 description: 'Task B finishes when Task A finishes',
 abbreviation: 'FF',
 },
 start_to_finish: {
 label: 'Start to Finish',
 description: 'Task B finishes when Task A starts',
 abbreviation: 'SF',
 },
};

// ============================================================================
// Recurrence Configuration
// ============================================================================

export const recurrencePatterns = [
 { id: 'daily', label: 'Daily', icon: 'solar:calendar-bold' },
 { id: 'weekly', label: 'Weekly', icon: 'solar:calendar-bold' },
 { id: 'monthly', label: 'Monthly', icon: 'solar:calendar-bold' },
 { id: 'yearly', label: 'Yearly', icon: 'solar:calendar-bold' },
 { id: 'custom', label: 'Custom', icon: 'solar:settings-bold' },
];

// ============================================================================
// Sample Data Generator
// ============================================================================

import { createTask, createDependency } from './engine';
import type { Task } from './types';

export function generateSampleTasks(): Task[] {
 const now = new Date();
 
 const task1 = createTask('Project Kickoff Meeting', {
 description: 'Initial project kickoff with all stakeholders',
 priority: 'high',
 duration: 120,
 scheduledStart: new Date(now.getTime() + 24 * 60 * 60 * 1000),
 tags: ['meeting', 'kickoff'],
 color: '#3b82f6',
 });
 
 const task2Id = generateId();
 const task2 = createTask('Requirements Documentation', {
 description: 'Document all project requirements',
 priority: 'high',
 duration: 480,
 tags: ['documentation', 'requirements'],
 color: '#8b5cf6',
 dependencies: [createDependency(task2Id, task1.id, 'finish_to_start')],
 });
 
 const task3Id = generateId();
 const task3 = createTask('Technical Design', {
 description: 'Create technical design documents',
 priority: 'medium',
 duration: 960,
 tags: ['design', 'architecture'],
 color: '#10b981',
 dependencies: [createDependency(task3Id, task2.id, 'finish_to_start')],
 });
 
 const task4Id = generateId();
 const task4 = createTask('Development Phase 1', {
 description: 'First phase of development',
 priority: 'high',
 duration: 2400,
 tags: ['development', 'phase1'],
 color: '#f59e0b',
 dependencies: [createDependency(task4Id, task3.id, 'finish_to_start')],
 });
 
 const task5Id = generateId();
 const task5 = createTask('Code Review', {
 description: 'Review all code changes',
 priority: 'high',
 duration: 240,
 tags: ['review', 'quality'],
 color: '#6366f1',
 dependencies: [createDependency(task5Id, task4.id, 'finish_to_start')],
 });
 
 return [task1, task2, task3, task4, task5];
}
