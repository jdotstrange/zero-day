// Task Scheduler Hook
// Phase 2 - React hook for task scheduling and dependency management

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
 Task,
 TaskId,
 TaskStatus,
 TaskPriority,
 TaskDependency,
 DependencyType,
 CriticalPathResult,
 ScheduleValidationResult,
 ScheduleAnalytics,
 GanttTask,
 CalendarEvent,
} from './types';
import {
 generateId,
 createTask,
 createDependency,
 getDependentTasks,
 hasCircularDependency,
 calculateCriticalPath,
 validateSchedule,
 canStartTask,
 updateTaskStatus,
 autoScheduleTasks,
 generateNextOccurrence,
 calculateAnalytics,
 tasksToGantt,
 tasksToCalendarEvents,
 exportTasks,
 importTasks,
} from './engine';

const STORAGE_KEY = 'zeroday_tasks';

export interface UseTaskSchedulerReturn {
 // Tasks
 tasks: Task[];
 selectedTask: Task | null;
 
 // Analysis
 criticalPath: CriticalPathResult | null;
 validationResult: ScheduleValidationResult | null;
 analytics: ScheduleAnalytics | null;
 
 // Views
 ganttTasks: GanttTask[];
 calendarEvents: CalendarEvent[];
 
 // Task CRUD
 addTask: (name: string, options?: Partial<Task>) => Task;
 updateTask: (taskId: TaskId, updates: Partial<Task>) => void;
 deleteTask: (taskId: TaskId) => void;
 duplicateTask: (taskId: TaskId) => Task | null;
 selectTask: (taskId: TaskId | null) => void;
 
 // Status Management
 changeTaskStatus: (taskId: TaskId, status: TaskStatus) => void;
 startTask: (taskId: TaskId) => { success: boolean; reason?: string };
 completeTask: (taskId: TaskId) => void;
 blockTask: (taskId: TaskId, reason?: string) => void;
 
 // Dependencies
 addDependency: (taskId: TaskId, dependsOnId: TaskId, type?: DependencyType, lag?: number) => boolean;
 removeDependency: (taskId: TaskId, dependencyId: string) => void;
 getDependencies: (taskId: TaskId) => TaskDependency[];
 getDependents: (taskId: TaskId) => Task[];
 
 // Scheduling
 scheduleTask: (taskId: TaskId, start: Date, end: Date) => void;
 autoSchedule: (startDate?: Date) => void;
 rescheduleAll: () => void;
 
 // Progress
 updateProgress: (taskId: TaskId, progress: number) => void;
 
 // Analysis
 runValidation: () => ScheduleValidationResult;
 calculateCriticalPathAnalysis: () => CriticalPathResult | null;
 refreshAnalytics: () => void;
 
 // Filters
 filterByStatus: (status: TaskStatus | null) => Task[];
 filterByPriority: (priority: TaskPriority | null) => Task[];
 filterByAssignee: (assigneeId: string | null) => Task[];
 filterByTags: (tags: string[]) => Task[];
 searchTasks: (query: string) => Task[];
 
 // Export/Import
 exportAllTasks: () => string;
 importTasksFromJson: (json: string) => boolean;
 
 // Bulk Operations
 bulkUpdateStatus: (taskIds: TaskId[], status: TaskStatus) => void;
 bulkDelete: (taskIds: TaskId[]) => void;
 bulkAssign: (taskIds: TaskId[], assigneeId: string, assigneeName: string) => void;
}

export function useTaskScheduler(): UseTaskSchedulerReturn {
 // State
 const [tasks, setTasks] = useState<Task[]>([]);
 const [selectedTaskId, setSelectedTaskId] = useState<TaskId | null>(null);
 const [criticalPath, setCriticalPath] = useState<CriticalPathResult | null>(null);
 const [validationResult, setValidationResult] = useState<ScheduleValidationResult | null>(null);
 const [analytics, setAnalytics] = useState<ScheduleAnalytics | null>(null);

 // Derived state
 const selectedTask = useMemo(
 () => tasks.find(t => t.id === selectedTaskId) || null,
 [tasks, selectedTaskId]
 );

 const ganttTasks = useMemo(() => tasksToGantt(tasks), [tasks]);
 const calendarEvents = useMemo(() => tasksToCalendarEvents(tasks), [tasks]);

 // Load from localStorage
 useEffect(() => {
 try {
 const saved = localStorage.getItem(STORAGE_KEY);
 if (saved) {
 const imported = importTasks(saved);
 if (imported) {
 setTasks(imported);
 }
 }
 } catch (error) {
 console.error('Failed to load tasks:', error);
 }
 }, []);

 // Save to localStorage
 useEffect(() => {
 try {
 localStorage.setItem(STORAGE_KEY, exportTasks(tasks));
 } catch (error) {
 console.error('Failed to save tasks:', error);
 }
 }, [tasks]);

 // Task CRUD
 const addTask = useCallback((name: string, options?: Partial<Task>): Task => {
 const task = createTask(name, options);
 setTasks(prev => [...prev, task]);
 return task;
 }, []);

 const updateTask = useCallback((taskId: TaskId, updates: Partial<Task>) => {
 setTasks(prev =>
 prev.map(t =>
 t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
 )
 );
 }, []);

 const deleteTask = useCallback((taskId: TaskId) => {
 setTasks(prev => {
 // Remove the task
 const filtered = prev.filter(t => t.id !== taskId);
 // Remove dependencies pointing to this task
 return filtered.map(t => ({
 ...t,
 dependencies: t.dependencies.filter(d => d.dependsOnId !== taskId),
 dependents: t.dependents.filter(id => id !== taskId),
 }));
 });
 if (selectedTaskId === taskId) {
 setSelectedTaskId(null);
 }
 }, [selectedTaskId]);

 const duplicateTask = useCallback((taskId: TaskId): Task | null => {
 const task = tasks.find(t => t.id === taskId);
 if (!task) return null;

 const newTask = createTask(`${task.name} (Copy)`, {
 ...task,
 id: undefined,
 dependencies: [], // Don't copy dependencies
 dependents: [],
 status: 'pending',
 progress: 0,
 actualStart: undefined,
 actualEnd: undefined,
 });

 setTasks(prev => [...prev, newTask]);
 return newTask;
 }, [tasks]);

 const selectTask = useCallback((taskId: TaskId | null) => {
 setSelectedTaskId(taskId);
 }, []);

 // Status Management
 const changeTaskStatus = useCallback((taskId: TaskId, status: TaskStatus) => {
 const task = tasks.find(t => t.id === taskId);
 if (!task) return;

 const { updatedTask, affectedTasks } = updateTaskStatus(task, status, tasks);
 
 setTasks(prev => {
 let updated = prev.map(t => (t.id === taskId ? updatedTask : t));
 affectedTasks.forEach(affected => {
 updated = updated.map(t => (t.id === affected.id ? affected : t));
 });
 return updated;
 });
 }, [tasks]);

 const startTask = useCallback((taskId: TaskId): { success: boolean; reason?: string } => {
 const task = tasks.find(t => t.id === taskId);
 if (!task) return { success: false, reason: 'Task not found' };

 const { canStart, reason } = canStartTask(task, tasks);
 if (!canStart) {
 return { success: false, reason };
 }

 changeTaskStatus(taskId, 'in_progress');
 return { success: true };
 }, [tasks, changeTaskStatus]);

 const completeTask = useCallback((taskId: TaskId) => {
 changeTaskStatus(taskId, 'completed');

 // Generate next occurrence for recurring tasks
 const task = tasks.find(t => t.id === taskId);
 if (task?.isRecurring) {
 const nextOccurrence = generateNextOccurrence(task);
 if (nextOccurrence) {
 setTasks(prev => [...prev, nextOccurrence]);
 }
 }
 }, [tasks, changeTaskStatus]);

 const blockTask = useCallback((taskId: TaskId) => {
 changeTaskStatus(taskId, 'blocked');
 }, [changeTaskStatus]);

 // Dependencies
 const addDependency = useCallback(
 (taskId: TaskId, dependsOnId: TaskId, type: DependencyType = 'finish_to_start', lag: number = 0): boolean => {
 // Check for circular dependency
 if (hasCircularDependency(taskId, dependsOnId, tasks)) {
 return false;
 }

 const dependency = createDependency(taskId, dependsOnId, type, lag);
 const dependsOnTask = tasks.find(t => t.id === dependsOnId);

 setTasks(prev =>
 prev.map(t => {
 if (t.id === taskId) {
 return {
 ...t,
 dependencies: [
 ...t.dependencies,
 { ...dependency, dependsOnName: dependsOnTask?.name },
 ],
 updatedAt: new Date(),
 };
 }
 if (t.id === dependsOnId) {
 return {
 ...t,
 dependents: [...t.dependents, taskId],
 updatedAt: new Date(),
 };
 }
 return t;
 })
 );

 return true;
 },
 [tasks]
 );

 const removeDependency = useCallback((taskId: TaskId, dependencyId: string) => {
 setTasks(prev =>
 prev.map(t => {
 if (t.id === taskId) {
 return {
 ...t,
 dependencies: t.dependencies.filter(d => d.id !== dependencyId),
 updatedAt: new Date(),
 };
 }
 // Remove from dependents of the other task
 const task = prev.find(pt => pt.id === taskId);
 const foundDep = task?.dependencies.find(d => d.id === dependencyId);
 if (foundDep && t.id === foundDep.dependsOnId) {
 return {
 ...t,
 dependents: t.dependents.filter(id => id !== taskId),
 updatedAt: new Date(),
 };
 }
 return t;
 })
 );
 }, []);

 const getDependencies = useCallback(
 (taskId: TaskId): TaskDependency[] => {
 const task = tasks.find(t => t.id === taskId);
 return task?.dependencies || [];
 },
 [tasks]
 );

 const getDependents = useCallback(
 (taskId: TaskId): Task[] => {
 return getDependentTasks(taskId, tasks);
 },
 [tasks]
 );

 // Scheduling
 const scheduleTask = useCallback((taskId: TaskId, start: Date, end: Date) => {
 updateTask(taskId, {
 scheduledStart: start,
 scheduledEnd: end,
 status: 'scheduled',
 });
 }, [updateTask]);

 const autoSchedule = useCallback((startDate: Date = new Date()) => {
 const scheduled = autoScheduleTasks(tasks, startDate);
 setTasks(scheduled);
 }, [tasks]);

 const rescheduleAll = useCallback(() => {
 const projectStart = tasks.reduce((earliest, task) => {
 if (task.scheduledStart && task.scheduledStart < earliest) {
 return task.scheduledStart;
 }
 return earliest;
 }, new Date());

 autoSchedule(projectStart);
 }, [tasks, autoSchedule]);

 // Progress
 const updateProgress = useCallback((taskId: TaskId, progress: number) => {
 const clampedProgress = Math.max(0, Math.min(100, progress));
 updateTask(taskId, {
 progress: clampedProgress,
 status: clampedProgress === 100 ? 'completed' : 
 clampedProgress > 0 ? 'in_progress' : undefined,
 });
 }, [updateTask]);

 // Analysis
 const runValidation = useCallback((): ScheduleValidationResult => {
 const result = validateSchedule(tasks);
 setValidationResult(result);
 return result;
 }, [tasks]);

 const calculateCriticalPathAnalysis = useCallback((): CriticalPathResult | null => {
 if (tasks.length === 0) {
 setCriticalPath(null);
 return null;
 }

 const projectStart = tasks.reduce((earliest, task) => {
 if (task.scheduledStart && task.scheduledStart < earliest) {
 return task.scheduledStart;
 }
 return earliest;
 }, new Date());

 const result = calculateCriticalPath(tasks, projectStart);
 setCriticalPath(result);
 return result;
 }, [tasks]);

 const refreshAnalytics = useCallback(() => {
 const result = calculateAnalytics(tasks);
 setAnalytics(result);
 }, [tasks]);

 // Filters
 const filterByStatus = useCallback(
 (status: TaskStatus | null): Task[] => {
 if (!status) return tasks;
 return tasks.filter(t => t.status === status);
 },
 [tasks]
 );

 const filterByPriority = useCallback(
 (priority: TaskPriority | null): Task[] => {
 if (!priority) return tasks;
 return tasks.filter(t => t.priority === priority);
 },
 [tasks]
 );

 const filterByAssignee = useCallback(
 (assigneeId: string | null): Task[] => {
 if (!assigneeId) return tasks;
 return tasks.filter(t => t.assigneeId === assigneeId);
 },
 [tasks]
 );

 const filterByTags = useCallback(
 (tags: string[]): Task[] => {
 if (tags.length === 0) return tasks;
 return tasks.filter(t => tags.some(tag => t.tags.includes(tag)));
 },
 [tasks]
 );

 const searchTasks = useCallback(
 (query: string): Task[] => {
 if (!query.trim()) return tasks;
 const lowerQuery = query.toLowerCase();
 return tasks.filter(
 t =>
 t.name.toLowerCase().includes(lowerQuery) ||
 t.description.toLowerCase().includes(lowerQuery) ||
 t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
 );
 },
 [tasks]
 );

 // Export/Import
 const exportAllTasks = useCallback((): string => {
 return exportTasks(tasks);
 }, [tasks]);

 const importTasksFromJson = useCallback((json: string): boolean => {
 const imported = importTasks(json);
 if (!imported) return false;
 
 // Generate new IDs to avoid conflicts
 const idMap = new Map<string, string>();
 imported.forEach(task => {
 idMap.set(task.id, generateId());
 });

 const remappedTasks = imported.map(task => ({
 ...task,
 id: idMap.get(task.id)!,
 dependencies: task.dependencies.map(dep => ({
 ...dep,
 id: generateId(),
 taskId: idMap.get(dep.taskId) || dep.taskId,
 dependsOnId: idMap.get(dep.dependsOnId) || dep.dependsOnId,
 })),
 dependents: task.dependents.map(id => idMap.get(id) || id),
 }));

 setTasks(prev => [...prev, ...remappedTasks]);
 return true;
 }, []);

 // Bulk Operations
 const bulkUpdateStatus = useCallback((taskIds: TaskId[], status: TaskStatus) => {
 setTasks(prev =>
 prev.map(t =>
 taskIds.includes(t.id) ? { ...t, status, updatedAt: new Date() } : t
 )
 );
 }, []);

 const bulkDelete = useCallback((taskIds: TaskId[]) => {
 setTasks(prev => {
 const filtered = prev.filter(t => !taskIds.includes(t.id));
 return filtered.map(t => ({
 ...t,
 dependencies: t.dependencies.filter(d => !taskIds.includes(d.dependsOnId)),
 dependents: t.dependents.filter(id => !taskIds.includes(id)),
 }));
 });
 }, []);

 const bulkAssign = useCallback(
 (taskIds: TaskId[], assigneeId: string, assigneeName: string) => {
 setTasks(prev =>
 prev.map(t =>
 taskIds.includes(t.id)
 ? { ...t, assigneeId, assigneeName, updatedAt: new Date() }
 : t
 )
 );
 },
 []
 );

 return {
 // Tasks
 tasks,
 selectedTask,
 
 // Analysis
 criticalPath,
 validationResult,
 analytics,
 
 // Views
 ganttTasks,
 calendarEvents,
 
 // Task CRUD
 addTask,
 updateTask,
 deleteTask,
 duplicateTask,
 selectTask,
 
 // Status Management
 changeTaskStatus,
 startTask,
 completeTask,
 blockTask,
 
 // Dependencies
 addDependency,
 removeDependency,
 getDependencies,
 getDependents,
 
 // Scheduling
 scheduleTask,
 autoSchedule,
 rescheduleAll,
 
 // Progress
 updateProgress,
 
 // Analysis
 runValidation,
 calculateCriticalPathAnalysis,
 refreshAnalytics,
 
 // Filters
 filterByStatus,
 filterByPriority,
 filterByAssignee,
 filterByTags,
 searchTasks,
 
 // Export/Import
 exportAllTasks,
 importTasksFromJson,
 
 // Bulk Operations
 bulkUpdateStatus,
 bulkDelete,
 bulkAssign,
 };
}
