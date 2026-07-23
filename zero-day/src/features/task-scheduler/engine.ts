// Task Scheduling Engine
// Phase 2 - Core scheduling algorithms and task management

import type {
 Task,
 TaskId,
 TaskStatus,
 TaskPriority,
 TaskDependency,
 DependencyType,
 CriticalPathResult,
 ScheduleValidationResult,
 ScheduleError,
 ScheduleWarning,
 ScheduleConflict,
 ScheduleAnalytics,
 GanttTask,
 CalendarEvent,
} from './types';

// ============================================================================
// Utility Functions
// ============================================================================

export function generateId(): string {
 return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateShortId(): string {
 return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ============================================================================
// Task Creation
// ============================================================================

export function createTask(
 name: string,
 options: Partial<Task> = {}
): Task {
 const now = new Date();
 return {
 id: generateId(),
 name,
 description: options.description || '',
 status: options.status || 'pending',
 priority: options.priority || 'medium',
 scheduledStart: options.scheduledStart,
 scheduledEnd: options.scheduledEnd,
 duration: options.duration || 60, // 1 hour default
 estimatedEffort: options.estimatedEffort || 1,
 isRecurring: options.isRecurring || false,
 recurrence: options.recurrence,
 assigneeId: options.assigneeId,
 assigneeName: options.assigneeName,
 assigneeAvatar: options.assigneeAvatar,
 projectId: options.projectId,
 projectName: options.projectName,
 tags: options.tags || [],
 category: options.category,
 progress: options.progress || 0,
 completedSubtasks: options.completedSubtasks || 0,
 totalSubtasks: options.totalSubtasks || 0,
 dependencies: options.dependencies || [],
 dependents: options.dependents || [],
 createdAt: now,
 updatedAt: now,
 createdBy: options.createdBy || 'system',
 color: options.color || '#6366f1',
 icon: options.icon || 'solar:clipboard-list-bold',
 metadata: options.metadata || {},
 };
}

export function createDependency(
 taskId: TaskId,
 dependsOnId: TaskId,
 type: DependencyType = 'finish_to_start',
 lag: number = 0
): TaskDependency {
 return {
 id: generateId(),
 taskId,
 dependsOnId,
 type,
 lag,
 isStrong: true,
 };
}

// ============================================================================
// Dependency Analysis
// ============================================================================

export function getDependencyChain(
 taskId: TaskId,
 tasks: Task[]
): TaskId[] {
 const chain: TaskId[] = [];
 const visited = new Set<TaskId>();
 
 function traverse(id: TaskId) {
 if (visited.has(id)) return;
 visited.add(id);
 
 const task = tasks.find(t => t.id === id);
 if (!task) return;
 
 task.dependencies.forEach(dep => {
 traverse(dep.dependsOnId);
 });
 
 chain.push(id);
 }
 
 traverse(taskId);
 return chain;
}

export function getDependentTasks(
 taskId: TaskId,
 tasks: Task[]
): Task[] {
 return tasks.filter(task =>
 task.dependencies.some(dep => dep.dependsOnId === taskId)
 );
}

export function hasCircularDependency(
 taskId: TaskId,
 dependsOnId: TaskId,
 tasks: Task[]
): boolean {
 const visited = new Set<TaskId>();
 
 function checkCycle(currentId: TaskId): boolean {
 if (currentId === taskId) return true;
 if (visited.has(currentId)) return false;
 
 visited.add(currentId);
 
 const task = tasks.find(t => t.id === currentId);
 if (!task) return false;
 
 return task.dependencies.some(dep => checkCycle(dep.dependsOnId));
 }
 
 return checkCycle(dependsOnId);
}

// ============================================================================
// Topological Sort (for scheduling order)
// ============================================================================

export function topologicalSort(tasks: Task[]): TaskId[] {
 const inDegree = new Map<TaskId, number>();
 const adjacencyList = new Map<TaskId, TaskId[]>();
 
 // Initialize
 tasks.forEach(task => {
 inDegree.set(task.id, 0);
 adjacencyList.set(task.id, []);
 });
 
 // Build graph
 tasks.forEach(task => {
 task.dependencies.forEach(dep => {
 const dependsOn = tasks.find(t => t.id === dep.dependsOnId);
 if (dependsOn) {
 adjacencyList.get(dep.dependsOnId)?.push(task.id);
 inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
 }
 });
 });
 
 // Kahn's algorithm
 const queue: TaskId[] = [];
 const result: TaskId[] = [];
 
 inDegree.forEach((degree, taskId) => {
 if (degree === 0) queue.push(taskId);
 });
 
 while (queue.length > 0) {
 // Sort by priority within the queue
 queue.sort((a, b) => {
 const taskA = tasks.find(t => t.id === a);
 const taskB = tasks.find(t => t.id === b);
 const priorityOrder: TaskPriority[] = ['critical', 'urgent', 'high', 'medium', 'low'];
 return priorityOrder.indexOf(taskA?.priority || 'medium') - priorityOrder.indexOf(taskB?.priority || 'medium');
 });
 
 const current = queue.shift()!;
 result.push(current);
 
 adjacencyList.get(current)?.forEach(neighbor => {
 const newDegree = (inDegree.get(neighbor) || 0) - 1;
 inDegree.set(neighbor, newDegree);
 if (newDegree === 0) queue.push(neighbor);
 });
 }
 
 return result;
}

// ============================================================================
// Critical Path Analysis
// ============================================================================

export function calculateCriticalPath(
 tasks: Task[],
 projectStart: Date
): CriticalPathResult {
 const sortedIds = topologicalSort(tasks);
 const taskMap = new Map(tasks.map(t => [t.id, t]));
 
 const earlyStart = new Map<TaskId, Date>();
 const earlyFinish = new Map<TaskId, Date>();
 const lateStart = new Map<TaskId, Date>();
 const lateFinish = new Map<TaskId, Date>();
 const slack = new Map<TaskId, number>();
 
 // Forward pass - calculate early start and finish
 sortedIds.forEach(id => {
 const task = taskMap.get(id)!;
 let maxEarlyStart = projectStart;
 
 task.dependencies.forEach(dep => {
 const depFinish = earlyFinish.get(dep.dependsOnId);
 if (depFinish) {
 const adjustedStart = new Date(depFinish.getTime() + dep.lag * 60 * 1000);
 if (adjustedStart > maxEarlyStart) {
 maxEarlyStart = adjustedStart;
 }
 }
 });
 
 earlyStart.set(id, maxEarlyStart);
 earlyFinish.set(id, new Date(maxEarlyStart.getTime() + task.duration * 60 * 1000));
 });
 
 // Find project end
 let projectEnd = projectStart;
 sortedIds.forEach(id => {
 const finish = earlyFinish.get(id)!;
 if (finish > projectEnd) projectEnd = finish;
 });
 
 // Backward pass - calculate late start and finish
 const reversedIds = [...sortedIds].reverse();
 
 reversedIds.forEach(id => {
 const task = taskMap.get(id)!;
 const dependents = tasks.filter(t =>
 t.dependencies.some(d => d.dependsOnId === id)
 );
 
 let minLateFinish = projectEnd;
 
 if (dependents.length === 0) {
 minLateFinish = projectEnd;
 } else {
 dependents.forEach(dependent => {
 const depStart = lateStart.get(dependent.id);
 const dependency = dependent.dependencies.find(d => d.dependsOnId === id);
 if (depStart && dependency) {
 const adjustedFinish = new Date(depStart.getTime() - dependency.lag * 60 * 1000);
 if (adjustedFinish < minLateFinish) {
 minLateFinish = adjustedFinish;
 }
 }
 });
 }
 
 lateFinish.set(id, minLateFinish);
 lateStart.set(id, new Date(minLateFinish.getTime() - task.duration * 60 * 1000));
 
 // Calculate slack
 const es = earlyStart.get(id)!.getTime();
 const ls = lateStart.get(id)!.getTime();
 slack.set(id, Math.floor((ls - es) / (60 * 1000)));
 });
 
 // Find critical path (tasks with zero slack)
 const criticalPath: TaskId[] = [];
 const criticalTasks: Task[] = [];
 
 sortedIds.forEach(id => {
 if (slack.get(id) === 0) {
 criticalPath.push(id);
 const task = taskMap.get(id);
 if (task) criticalTasks.push(task);
 }
 });
 
 // Calculate total duration
 const totalDuration = Math.floor((projectEnd.getTime() - projectStart.getTime()) / (60 * 1000));
 
 return {
 criticalPath,
 criticalTasks,
 totalDuration,
 projectEnd,
 slack: Object.fromEntries(slack),
 earlyStart: Object.fromEntries(
 Array.from(earlyStart.entries()).map(([k, v]) => [k, v])
 ),
 earlyFinish: Object.fromEntries(
 Array.from(earlyFinish.entries()).map(([k, v]) => [k, v])
 ),
 lateStart: Object.fromEntries(
 Array.from(lateStart.entries()).map(([k, v]) => [k, v])
 ),
 lateFinish: Object.fromEntries(
 Array.from(lateFinish.entries()).map(([k, v]) => [k, v])
 ),
 };
}

// ============================================================================
// Schedule Validation
// ============================================================================

export function validateSchedule(tasks: Task[]): ScheduleValidationResult {
 const errors: ScheduleError[] = [];
 const warnings: ScheduleWarning[] = [];
 const conflicts: ScheduleConflict[] = [];
 
 // Check for circular dependencies
 const visited = new Set<TaskId>();
 const recursionStack = new Set<TaskId>();
 
 function detectCycle(taskId: TaskId, path: TaskId[] = []): boolean {
 if (recursionStack.has(taskId)) {
 errors.push({
 type: 'circular_dependency',
 message: `Circular dependency detected: ${[...path, taskId].join(' → ')}`,
 taskIds: [...path, taskId],
 });
 return true;
 }
 
 if (visited.has(taskId)) return false;
 
 visited.add(taskId);
 recursionStack.add(taskId);
 
 const task = tasks.find(t => t.id === taskId);
 if (task) {
 for (const dep of task.dependencies) {
 if (detectCycle(dep.dependsOnId, [...path, taskId])) {
 return true;
 }
 }
 }
 
 recursionStack.delete(taskId);
 return false;
 }
 
 tasks.forEach(task => detectCycle(task.id));
 
 // Check for missing dependencies
 tasks.forEach(task => {
 task.dependencies.forEach(dep => {
 const dependsOn = tasks.find(t => t.id === dep.dependsOnId);
 if (!dependsOn) {
 errors.push({
 type: 'missing_dependency',
 message: `Task "${task.name}" depends on non-existent task`,
 taskIds: [task.id],
 });
 }
 });
 });
 
 // Check for invalid dates
 tasks.forEach(task => {
 if (task.scheduledStart && task.scheduledEnd) {
 if (task.scheduledStart > task.scheduledEnd) {
 errors.push({
 type: 'invalid_dates',
 message: `Task "${task.name}" has start date after end date`,
 taskIds: [task.id],
 });
 }
 }
 });
 
 // Check for overdue tasks
 const now = new Date();
 tasks.forEach(task => {
 if (task.scheduledEnd && task.scheduledEnd < now && task.status !== 'completed') {
 warnings.push({
 type: 'overdue',
 message: `Task "${task.name}" is overdue`,
 taskIds: [task.id],
 });
 }
 });
 
 // Check for near deadlines (within 24 hours)
 const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
 tasks.forEach(task => {
 if (
 task.scheduledEnd &&
 task.scheduledEnd > now &&
 task.scheduledEnd < tomorrow &&
 task.status !== 'completed'
 ) {
 warnings.push({
 type: 'near_deadline',
 message: `Task "${task.name}" is due within 24 hours`,
 taskIds: [task.id],
 });
 }
 });
 
 // Check for long duration tasks
 tasks.forEach(task => {
 if (task.duration > 480) { // > 8 hours
 warnings.push({
 type: 'long_duration',
 message: `Task "${task.name}" has a long duration (${Math.round(task.duration / 60)} hours). Consider breaking it down.`,
 taskIds: [task.id],
 });
 }
 });
 
 // Check for overlapping tasks per assignee
 const tasksByAssignee = new Map<string, Task[]>();
 tasks.forEach(task => {
 if (task.assigneeId && task.scheduledStart && task.scheduledEnd) {
 const assigneeTasks = tasksByAssignee.get(task.assigneeId) || [];
 assigneeTasks.push(task);
 tasksByAssignee.set(task.assigneeId, assigneeTasks);
 }
 });
 
 tasksByAssignee.forEach((assigneeTasks, assigneeId) => {
 for (let i = 0; i < assigneeTasks.length; i++) {
 for (let j = i + 1; j < assigneeTasks.length; j++) {
 const taskA = assigneeTasks[i];
 const taskB = assigneeTasks[j];
 
 if (
 taskA.scheduledStart! < taskB.scheduledEnd! &&
 taskB.scheduledStart! < taskA.scheduledEnd!
 ) {
 conflicts.push({
 type: 'overlap',
 tasks: [taskA.id, taskB.id],
 resourceId: assigneeId,
 message: `Tasks "${taskA.name}" and "${taskB.name}" overlap for ${taskA.assigneeName || assigneeId}`,
 suggestedResolution: 'Reschedule one of the tasks or reassign to another person',
 });
 }
 }
 }
 });
 
 return {
 isValid: errors.length === 0,
 errors,
 warnings,
 conflicts,
 };
}

// ============================================================================
// Task Status Management
// ============================================================================

export function canStartTask(task: Task, tasks: Task[]): { canStart: boolean; reason?: string } {
 // Check if all strong dependencies are completed
 for (const dep of task.dependencies.filter(d => d.isStrong)) {
 const dependsOn = tasks.find(t => t.id === dep.dependsOnId);
 if (!dependsOn) continue;
 
 switch (dep.type) {
 case 'finish_to_start':
 if (dependsOn.status !== 'completed') {
 return {
 canStart: false,
 reason: `Waiting for "${dependsOn.name}" to complete`,
 };
 }
 break;
 case 'start_to_start':
 if (dependsOn.status === 'pending') {
 return {
 canStart: false,
 reason: `Waiting for "${dependsOn.name}" to start`,
 };
 }
 break;
 }
 }
 
 return { canStart: true };
}

export function updateTaskStatus(
 task: Task,
 newStatus: TaskStatus,
 tasks: Task[]
): { updatedTask: Task; affectedTasks: Task[] } {
 const affectedTasks: Task[] = [];
 const now = new Date();
 
 const updatedTask: Task = {
 ...task,
 status: newStatus,
 updatedAt: now,
 };
 
 if (newStatus === 'in_progress' && !task.actualStart) {
 updatedTask.actualStart = now;
 }
 
 if (newStatus === 'completed') {
 updatedTask.actualEnd = now;
 updatedTask.progress = 100;
 
 // Update dependent tasks
 const dependents = getDependentTasks(task.id, tasks);
 dependents.forEach(dependent => {
 const { canStart } = canStartTask(dependent, [
 ...tasks.filter(t => t.id !== task.id),
 updatedTask,
 ]);
 
 if (canStart && dependent.status === 'blocked') {
 affectedTasks.push({
 ...dependent,
 status: 'pending',
 updatedAt: now,
 });
 }
 });
 }
 
 if (newStatus === 'blocked') {
 // Block all dependent tasks
 const dependents = getDependentTasks(task.id, tasks);
 dependents.forEach(dependent => {
 if (dependent.status !== 'completed') {
 affectedTasks.push({
 ...dependent,
 status: 'blocked',
 updatedAt: now,
 });
 }
 });
 }
 
 return { updatedTask, affectedTasks };
}

// ============================================================================
// Scheduling Functions
// ============================================================================

export function autoScheduleTasks(
 tasks: Task[],
 startDate: Date,
 workingHoursPerDay: number = 8,
 workingDays: number[] = [1, 2, 3, 4, 5] // Monday to Friday
): Task[] {
 const sortedIds = topologicalSort(tasks);
 const scheduledTasks = new Map<TaskId, Task>();
 
 sortedIds.forEach(taskId => {
 const task = tasks.find(t => t.id === taskId)!;
 let taskStart = startDate;
 
 // Find the latest dependency end time
 task.dependencies.forEach(dep => {
 const dependsOn = scheduledTasks.get(dep.dependsOnId);
 if (dependsOn?.scheduledEnd) {
 const depEnd = new Date(dependsOn.scheduledEnd.getTime() + dep.lag * 60 * 1000);
 if (depEnd > taskStart) {
 taskStart = depEnd;
 }
 }
 });
 
 // Adjust to next working day/hour if needed
 taskStart = getNextWorkingTime(taskStart, workingDays);
 
 // Calculate end time
 const taskEnd = addWorkingTime(taskStart, task.duration, workingHoursPerDay, workingDays);
 
 scheduledTasks.set(taskId, {
 ...task,
 scheduledStart: taskStart,
 scheduledEnd: taskEnd,
 status: task.status === 'pending' ? 'scheduled' : task.status,
 });
 });
 
 return Array.from(scheduledTasks.values());
}

function getNextWorkingTime(date: Date, workingDays: number[]): Date {
 const result = new Date(date);
 
 // If it's a weekend, move to Monday
 while (!workingDays.includes(result.getDay())) {
 result.setDate(result.getDate() + 1);
 result.setHours(9, 0, 0, 0); // Start at 9 AM
 }
 
 // If it's before working hours, move to start
 if (result.getHours() < 9) {
 result.setHours(9, 0, 0, 0);
 }
 
 // If it's after working hours, move to next day
 if (result.getHours() >= 17) {
 result.setDate(result.getDate() + 1);
 result.setHours(9, 0, 0, 0);
 return getNextWorkingTime(result, workingDays);
 }
 
 return result;
}

function addWorkingTime(
 start: Date,
 minutes: number,
 hoursPerDay: number,
 workingDays: number[]
): Date {
 const result = new Date(start);
 let remainingMinutes = minutes;
 
 while (remainingMinutes > 0) {
 // Hours remaining today
 const todayEnd = new Date(result);
 todayEnd.setHours(9 + hoursPerDay, 0, 0, 0);
 
 const minutesToday = Math.floor((todayEnd.getTime() - result.getTime()) / 60000);
 
 if (minutesToday >= remainingMinutes) {
 result.setTime(result.getTime() + remainingMinutes * 60000);
 remainingMinutes = 0;
 } else {
 remainingMinutes -= minutesToday;
 result.setDate(result.getDate() + 1);
 result.setHours(9, 0, 0, 0);
 
 // Skip to next working day
 while (!workingDays.includes(result.getDay())) {
 result.setDate(result.getDate() + 1);
 }
 }
 }
 
 return result;
}

// ============================================================================
// Recurrence
// ============================================================================

export function generateNextOccurrence(task: Task): Task | null {
 if (!task.isRecurring || !task.recurrence) return null;
 
 const recurrence = task.recurrence;
 
 // Check if we've reached max occurrences
 if (recurrence.maxOccurrences && recurrence.occurrenceCount >= recurrence.maxOccurrences) {
 return null;
 }
 
 // Check if we've passed the end date
 if (recurrence.endDate && new Date() > recurrence.endDate) {
 return null;
 }
 
 const baseDate = task.scheduledStart || new Date();
 let nextDate = new Date(baseDate);
 
 switch (recurrence.pattern) {
 case 'daily':
 nextDate.setDate(nextDate.getDate() + recurrence.interval);
 break;
 case 'weekly':
 nextDate.setDate(nextDate.getDate() + 7 * recurrence.interval);
 break;
 case 'monthly':
 nextDate.setMonth(nextDate.getMonth() + recurrence.interval);
 break;
 case 'yearly':
 nextDate.setFullYear(nextDate.getFullYear() + recurrence.interval);
 break;
 }
 
 return {
 ...task,
 id: generateId(),
 scheduledStart: nextDate,
 scheduledEnd: task.scheduledEnd
 ? new Date(nextDate.getTime() + task.duration * 60 * 1000)
 : undefined,
 status: 'pending',
 progress: 0,
 actualStart: undefined,
 actualEnd: undefined,
 recurrence: {
 ...recurrence,
 occurrenceCount: recurrence.occurrenceCount + 1,
 },
 createdAt: new Date(),
 updatedAt: new Date(),
 };
}

// ============================================================================
// Analytics
// ============================================================================

export function calculateAnalytics(tasks: Task[]): ScheduleAnalytics {
 const now = new Date();
 
 const tasksByStatus: Record<TaskStatus, number> = {
 pending: 0,
 scheduled: 0,
 in_progress: 0,
 completed: 0,
 blocked: 0,
 cancelled: 0,
 failed: 0,
 };
 
 const tasksByPriority: Record<TaskPriority, number> = {
 low: 0,
 medium: 0,
 high: 0,
 urgent: 0,
 critical: 0,
 };
 
 const workloadByAssignee: Record<string, number> = {};
 const overdueTasks: Task[] = [];
 const upcomingDeadlines: Array<{ taskId: TaskId; deadline: Date; daysRemaining: number }> = [];
 let totalCompletionTime = 0;
 let completedWithTime = 0;
 let onTimeTasks = 0;
 let onTrackTasks = 0;
 let delayedTasks = 0;
 
 tasks.forEach(task => {
 tasksByStatus[task.status]++;
 tasksByPriority[task.priority]++;
 
 // Workload by assignee
 if (task.assigneeId && task.status !== 'completed') {
 workloadByAssignee[task.assigneeId] =
 (workloadByAssignee[task.assigneeId] || 0) + task.estimatedEffort;
 }
 
 // Completion time
 if (task.status === 'completed' && task.actualStart && task.actualEnd) {
 totalCompletionTime += task.actualEnd.getTime() - task.actualStart.getTime();
 completedWithTime++;
 
 // Check if completed on time
 if (task.scheduledEnd && task.actualEnd <= task.scheduledEnd) {
 onTimeTasks++;
 }
 }
 
 // Overdue tasks
 if (task.scheduledEnd && task.scheduledEnd < now && task.status !== 'completed') {
 overdueTasks.push(task);
 delayedTasks++;
 } else if (task.scheduledEnd && task.status !== 'completed') {
 // Upcoming deadlines (within 7 days)
 const daysRemaining = Math.ceil(
 (task.scheduledEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
 );
 
 if (daysRemaining <= 7) {
 upcomingDeadlines.push({
 taskId: task.id,
 deadline: task.scheduledEnd,
 daysRemaining,
 });
 }
 
 if (daysRemaining > 0) {
 onTrackTasks++;
 }
 }
 });
 
 upcomingDeadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
 
 return {
 totalTasks: tasks.length,
 completedTasks: tasksByStatus.completed,
 onTrackTasks,
 delayedTasks,
 blockedTasks: tasksByStatus.blocked,
 averageCompletionTime: completedWithTime > 0 ? totalCompletionTime / completedWithTime : 0,
 onTimeDeliveryRate: completedWithTime > 0 ? onTimeTasks / completedWithTime : 0,
 tasksByStatus,
 tasksByPriority,
 upcomingDeadlines,
 overdueTasks,
 workloadByAssignee,
 };
}

// ============================================================================
// Gantt Chart Helpers
// ============================================================================

export function tasksToGantt(tasks: Task[]): GanttTask[] {
 return tasks.map(task => ({
 id: task.id,
 name: task.name,
 start: task.scheduledStart || task.createdAt,
 end: task.scheduledEnd || new Date(task.createdAt.getTime() + task.duration * 60 * 1000),
 progress: task.progress,
 dependencies: task.dependencies.map(d => d.dependsOnId).join(','),
 color: task.color || '#6366f1',
 milestone: task.duration === 0,
 collapsed: false,
 }));
}

export function tasksToCalendarEvents(tasks: Task[]): CalendarEvent[] {
 const events: CalendarEvent[] = [];
 
 tasks.forEach(task => {
 if (task.scheduledStart && task.scheduledEnd) {
 events.push({
 id: `task-${task.id}`,
 taskId: task.id,
 title: task.name,
 start: task.scheduledStart,
 end: task.scheduledEnd,
 allDay: task.duration >= 480, // 8+ hours = all day
 color: task.color || '#6366f1',
 type: 'task',
 });
 }
 
 // Add deadline marker
 if (task.scheduledEnd && task.status !== 'completed') {
 events.push({
 id: `deadline-${task.id}`,
 taskId: task.id,
 title: `Deadline: ${task.name}`,
 start: task.scheduledEnd,
 end: task.scheduledEnd,
 allDay: false,
 color: '#ef4444',
 type: 'deadline',
 });
 }
 });
 
 return events;
}

// ============================================================================
// Export/Import
// ============================================================================

export function exportTasks(tasks: Task[]): string {
 return JSON.stringify(tasks, null, 2);
}

export function importTasks(json: string): Task[] | null {
 try {
 const data = JSON.parse(json);
 if (!Array.isArray(data)) return null;
 
 return data.map(task => ({
 ...task,
 createdAt: new Date(task.createdAt),
 updatedAt: new Date(task.updatedAt),
 scheduledStart: task.scheduledStart ? new Date(task.scheduledStart) : undefined,
 scheduledEnd: task.scheduledEnd ? new Date(task.scheduledEnd) : undefined,
 actualStart: task.actualStart ? new Date(task.actualStart) : undefined,
 actualEnd: task.actualEnd ? new Date(task.actualEnd) : undefined,
 }));
 } catch {
 return null;
 }
}
