/**
 * TaskSchedulerDashboard Component
 * Main dashboard for Task Scheduling & Dependencies feature
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/common';
import { FeatureTabBar } from '@/components/features';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useTaskScheduler } from '../useTaskScheduler';
import { taskTemplates, projectTemplates, generateSampleTasks } from '../config';
import { GanttChart } from './GanttChart';
import { CalendarView } from './CalendarView';
import { DependencyGraph } from './DependencyGraph';
import type { Task, TaskPriority, TaskStatus, DependencyType } from '../types';

type ViewMode = 'dashboard' | 'gantt' | 'calendar' | 'dependencies';
type GanttViewMode = 'day' | 'week' | 'month';
type CalendarViewMode = 'month' | 'week' | 'day';

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
 { value: 'pending', label: 'Pending', color: 'bg-surface-500' },
 { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500' },
 { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
 { value: 'completed', label: 'Completed', color: 'bg-green-500' },
 { value: 'blocked', label: 'Blocked', color: 'bg-red-500' },
 { value: 'cancelled', label: 'Cancelled', color: 'bg-surface-400' },
 { value: 'failed', label: 'Failed', color: 'bg-red-700' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
 { value: 'low', label: 'Low', color: 'bg-green-500' },
 { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
 { value: 'high', label: 'High', color: 'bg-orange-500' },
 { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
 { value: 'critical', label: 'Critical', color: 'bg-red-700' },
];

export const TaskSchedulerDashboard: React.FC = () => {
 const {
 tasks,
 selectedTask,
 analytics,
 validationResult,
 selectTask,
 addTask,
 updateTask,
 deleteTask,
 addDependency,
 removeDependency,
 bulkDelete,
 runValidation,
 refreshAnalytics,
 importTasksFromJson,
 } = useTaskScheduler();

 const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
 const [ganttViewMode, setGanttViewMode] = useState<GanttViewMode>('week');
 const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('month');
 const [showAddTaskModal, setShowAddTaskModal] = useState(false);
 const [showTaskDetailPanel, setShowTaskDetailPanel] = useState(false);
 const [newTaskData, setNewTaskData] = useState<Partial<Task>>({
 name: '',
 description: '',
 priority: 'medium',
 status: 'pending',
 estimatedEffort: 4,
 duration: 240,
 tags: [],
 });

 const handleLoadSample = () => {
 const sampleTasks = generateSampleTasks();
 const json = JSON.stringify(sampleTasks);
 importTasksFromJson(json);
 refreshAnalytics();
 runValidation();
 };

 const handleClearAll = () => {
 const taskIds = tasks.map(t => t.id);
 bulkDelete(taskIds);
 };

 const handleAddTask = () => {
 if (!newTaskData.name) return;

 addTask(newTaskData.name, {
 description: newTaskData.description || '',
 priority: newTaskData.priority || 'medium',
 estimatedEffort: newTaskData.estimatedEffort || 4,
 duration: newTaskData.duration || 240,
 scheduledStart: newTaskData.scheduledStart,
 scheduledEnd: newTaskData.scheduledEnd,
 tags: newTaskData.tags || [],
 });

 setNewTaskData({
 name: '',
 description: '',
 priority: 'medium',
 status: 'pending',
 estimatedEffort: 4,
 duration: 240,
 tags: [],
 });
 setShowAddTaskModal(false);
 };

 const handleAddFromTemplate = (templateId: string) => {
 const template = taskTemplates.find(t => t.id === templateId);
 if (!template) return;

 addTask(template.name, {
 description: template.description,
 priority: template.defaultPriority,
 duration: template.defaultDuration,
 tags: template.defaultTags,
 category: template.category,
 });
 };

 const handleSelectTask = (taskId: string | null) => {
 selectTask(taskId);
 if (taskId) {
 setShowTaskDetailPanel(true);
 }
 };

 const handleAddDependency = (fromTaskId: string, toTaskId: string, type: DependencyType) => {
 addDependency(toTaskId, fromTaskId, type);
 };

 // Analytics display values
 const totalTasks = analytics?.totalTasks ?? tasks.length;
 const completedTasks = analytics?.completedTasks ?? tasks.filter(t => t.status === 'completed').length;
 const inProgressTasks = analytics?.tasksByStatus?.in_progress ?? tasks.filter(t => t.status === 'in_progress').length;
 const blockedTasks = analytics?.blockedTasks ?? tasks.filter(t => t.status === 'blocked').length;
 const overdueTasks = analytics?.overdueTasks?.length ?? 0;
 const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

 const renderStatCards = () => (
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
 <Icon icon="solar:checklist-minimalistic-bold-duotone" className="w-6 h-6 text-blue-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{totalTasks}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Tasks</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
 <Icon icon="solar:check-circle-bold-duotone" className="w-6 h-6 text-green-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{completedTasks}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">Completed</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
 <Icon icon="solar:play-circle-bold-duotone" className="w-6 h-6 text-yellow-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{inProgressTasks}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">In Progress</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
 <Icon icon="solar:lock-bold-duotone" className="w-6 h-6 text-red-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{blockedTasks}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">Blocked</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
 <Icon icon="solar:calendar-bold-duotone" className="w-6 h-6 text-orange-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{overdueTasks}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">Overdue</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
 <Icon icon="solar:chart-2-bold-duotone" className="w-6 h-6 text-purple-600" />
 </div>
 <div>
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">{completionRate}%</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">Completion Rate</p>
 </div>
 </div>
 </div>
 </div>
 );

 const renderTaskList = () => (
 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <h3 className="font-semibold text-secondary-900 dark:text-white">Tasks</h3>
 <div className="flex items-center gap-2">
 <span className="text-sm text-secondary-500">{tasks.length} tasks</span>
 </div>
 </div>
 <div className="max-h-[400px] overflow-auto">
 {tasks.length === 0 ? (
 <div className="p-8 text-center text-secondary-500 dark:text-secondary-400">
 <Icon icon="solar:checklist-minimalistic-linear" className="w-12 h-12 mx-auto mb-3 opacity-50" />
 <p>No tasks yet</p>
 <p className="text-sm">Create a task or load sample data</p>
 </div>
 ) : (
 tasks.map(task => (
 <div
 key={task.id}
 onClick={() => handleSelectTask(task.id)}
 className={`flex items-center gap-4 p-4 border-b border-surface-100 dark:border-surface-700 cursor-pointer transition-colors ${
 selectedTask?.id === task.id
 ? 'bg-primary-50 dark:bg-primary-900/20'
 : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
 }`}
 >
 <div className={`w-2 h-2 rounded-full ${
 PRIORITY_OPTIONS.find(p => p.value === task.priority)?.color
 }`} />
 <div className="flex-1 min-w-0">
 <p className="font-medium text-secondary-900 dark:text-white truncate">{task.name}</p>
 <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">{task.description}</p>
 </div>
 <div className="flex items-center gap-2">
 <span className={`px-2 py-1 text-xs rounded-full ${
 STATUS_OPTIONS.find(s => s.value === task.status)?.color
 } text-white`}>
 {task.status.replace('_', ' ')}
 </span>
 <span className="text-sm text-secondary-500 dark:text-secondary-400">
 {task.progress}%
 </span>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );

 const renderValidationWarnings = () => {
 if (!validationResult || validationResult.isValid) return null;

 return (
 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
 <div className="flex items-center gap-2 mb-3">
 <Icon icon="solar:danger-triangle-bold" className="w-5 h-5 text-red-600" />
 <h4 className="font-semibold text-red-800 dark:text-red-200">Schedule Issues</h4>
 </div>
 <div className="space-y-2">
 {validationResult.errors.map((error, i) => (
 <div key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
 <Icon icon="solar:close-circle-bold" className="w-4 h-4 mt-0.5 flex-shrink-0" />
 <span>{error.message}</span>
 </div>
 ))}
 {validationResult.warnings.map((warning, i) => (
 <div key={i} className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
 <Icon icon="solar:info-circle-bold" className="w-4 h-4 mt-0.5 flex-shrink-0" />
 <span>{warning.message}</span>
 </div>
 ))}
 </div>
 </div>
 );
 };

 const renderAddTaskModal = () => {
 if (!showAddTaskModal) return null;

 return createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={() => setShowAddTaskModal(false)}
 />
 <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Add New Task</h3>
 <button
 onClick={() => setShowAddTaskModal(false)}
 className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5 text-secondary-500" />
 </button>
 </div>

 <div className="p-4 space-y-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Task Name *
 </label>
 <input
 type="text"
 value={newTaskData.name || ''}
 onChange={(e) => setNewTaskData({ ...newTaskData, name: e.target.value })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 placeholder="Enter task name"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Description
 </label>
 <textarea
 value={newTaskData.description || ''}
 onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
 rows={3}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 placeholder="Enter task description"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Priority
 </label>
 <select
 value={newTaskData.priority || 'medium'}
 onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as TaskPriority })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 >
 {PRIORITY_OPTIONS.map(opt => (
 <option key={opt.value} value={opt.value}>{opt.label}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Duration (minutes)
 </label>
 <input
 type="number"
 value={newTaskData.duration || 240}
 onChange={(e) => setNewTaskData({ ...newTaskData, duration: parseInt(e.target.value) })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Start Date
 </label>
 <input
 type="datetime-local"
 onChange={(e) => setNewTaskData({ ...newTaskData, scheduledStart: new Date(e.target.value) })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 End Date
 </label>
 <input
 type="datetime-local"
 onChange={(e) => setNewTaskData({ ...newTaskData, scheduledEnd: new Date(e.target.value) })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 />
 </div>
 </div>

 {/* Templates */}
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
 Or use a template:
 </label>
 <div className="flex flex-wrap gap-2">
 {taskTemplates.slice(0, 4).map(template => (
 <button
 key={template.id}
 onClick={() => {
 handleAddFromTemplate(template.id);
 setShowAddTaskModal(false);
 }}
 className="px-3 py-1.5 text-sm bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-secondary-700 dark:text-secondary-300 rounded-lg transition-colors"
 >
 {template.name}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="flex justify-end gap-3 p-4 border-t border-surface-200 dark:border-surface-700">
 <button
 onClick={() => setShowAddTaskModal(false)}
 className="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleAddTask}
 disabled={!newTaskData.name}
 className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
 >
 Add Task
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
 };

 const renderTaskDetailPanel = () => {
 if (!showTaskDetailPanel || !selectedTask) return null;

 return (
 <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-surface-800 shadow-xl border-l border-surface-200 dark:border-surface-700 z-40 overflow-auto">
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Task Details</h3>
 <button
 onClick={() => {
 setShowTaskDetailPanel(false);
 selectTask(null);
 }}
 className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5 text-secondary-500" />
 </button>
 </div>

 <div className="p-4 space-y-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Task Name
 </label>
 <input
 type="text"
 value={selectedTask.name}
 onChange={(e) => updateTask(selectedTask.id, { name: e.target.value })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Description
 </label>
 <textarea
 value={selectedTask.description}
 onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
 rows={3}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Status
 </label>
 <select
 value={selectedTask.status}
 onChange={(e) => updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white"
 >
 {STATUS_OPTIONS.map(opt => (
 <option key={opt.value} value={opt.value}>{opt.label}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Priority
 </label>
 <select
 value={selectedTask.priority}
 onChange={(e) => updateTask(selectedTask.id, { priority: e.target.value as TaskPriority })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-secondary-900 dark:text-white"
 >
 {PRIORITY_OPTIONS.map(opt => (
 <option key={opt.value} value={opt.value}>{opt.label}</option>
 ))}
 </select>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Progress: {selectedTask.progress}%
 </label>
 <input
 type="range"
 min="0"
 max="100"
 value={selectedTask.progress}
 onChange={(e) => updateTask(selectedTask.id, { progress: parseInt(e.target.value) })}
 className="w-full"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
 Dependencies ({selectedTask.dependencies.length})
 </label>
 {selectedTask.dependencies.length === 0 ? (
 <p className="text-sm text-secondary-500 dark:text-secondary-400">No dependencies</p>
 ) : (
 <div className="space-y-2">
 {selectedTask.dependencies.map(dep => {
 const depTask = tasks.find(t => t.id === dep.dependsOnId);
 return (
 <div
 key={dep.id}
 className="flex items-center justify-between p-2 bg-surface-50 dark:bg-surface-700 rounded-lg"
 >
 <div className="flex items-center gap-2">
 <Icon icon="solar:link-bold" className="w-4 h-4 text-secondary-500" />
 <span className="text-sm text-secondary-700 dark:text-secondary-300">
 {depTask?.name || 'Unknown'}
 </span>
 <span className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
 ({dep.type.replace(/_/g, ' ')})
 </span>
 </div>
 <button
 onClick={() => removeDependency(selectedTask.id, dep.id)}
 className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
 >
 <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4 text-red-500" />
 </button>
 </div>
 );
 })}
 </div>
 )}
 </div>

 <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
 <button
 onClick={() => {
 deleteTask(selectedTask.id);
 setShowTaskDetailPanel(false);
 selectTask(null);
 }}
 className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
 >
 <Icon icon="solar:trash-bin-minimalistic-bold" className="w-4 h-4" />
 Delete Task
 </button>
 </div>
 </div>
 </div>
 );
 };

 return (
 <Card padding="none" className="overflow-hidden">
 <CardHeader className="mb-0 flex-col gap-4 border-b border-surface-200 p-4 dark:border-surface-700 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <CardTitle>Scheduler workspace</CardTitle>
 <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
 Schedule tasks, manage dependencies, and visualize your project timeline
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <Button type="button" variant="secondary" onClick={handleLoadSample}>
 <Icon icon="solar:database-bold" className="w-4 h-4" />
 Load Sample
 </Button>
 <Button type="button" variant="danger" onClick={handleClearAll}>
 <Icon icon="solar:trash-bin-minimalistic-bold" className="w-4 h-4" />
 Clear All
 </Button>
 <Button type="button" onClick={() => setShowAddTaskModal(true)}>
 <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
 Add Task
 </Button>
 </div>
 </CardHeader>

 <CardContent className="space-y-6 p-4">
 <FeatureTabBar
 tabs={[
 { id: 'dashboard' as const, label: 'Dashboard', icon: 'solar:widget-bold-duotone' },
 { id: 'gantt' as const, label: 'Gantt', icon: 'solar:calendar-bold-duotone' },
 { id: 'calendar' as const, label: 'Calendar', icon: 'solar:calendar-date-bold-duotone' },
 { id: 'dependencies' as const, label: 'Dependencies', icon: 'solar:graph-bold-duotone' },
 ]}
 active={viewMode}
 onChange={setViewMode}
 />
 {viewMode === 'dashboard' && (
 <div className="space-y-6">
 {renderStatCards()}
 {renderValidationWarnings()}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {renderTaskList()}
 <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
 <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Project Templates</h3>
 <div className="space-y-3">
 {projectTemplates.map(template => (
 <div
 key={template.id}
 className="p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer transition-colors"
 >
 <div className="flex items-center gap-2 mb-1">
 <Icon icon={template.icon} className="w-5 h-5 text-primary-500" />
 <span className="font-medium text-secondary-900 dark:text-white">{template.name}</span>
 </div>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">{template.description}</p>
 <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
 {template.tasks.length} tasks • {template.milestones.length} milestones
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {viewMode === 'gantt' && (
 <GanttChart
 tasks={tasks}
 selectedTaskId={selectedTask?.id || null}
 onSelectTask={handleSelectTask}
 onUpdateTask={(id, updates) => updateTask(id, updates)}
 viewMode={ganttViewMode}
 onViewModeChange={setGanttViewMode}
 />
 )}

 {viewMode === 'calendar' && (
 <CalendarView
 tasks={tasks}
 selectedTaskId={selectedTask?.id || null}
 onSelectTask={handleSelectTask}
 onDateSelect={(date) => {
 setNewTaskData({ ...newTaskData, scheduledStart: date });
 setShowAddTaskModal(true);
 }}
 view={calendarViewMode}
 onViewChange={setCalendarViewMode}
 />
 )}

 {viewMode === 'dependencies' && (
 <DependencyGraph
 tasks={tasks}
 selectedTaskId={selectedTask?.id || null}
 onSelectTask={handleSelectTask}
 onAddDependency={handleAddDependency}
 onRemoveDependency={removeDependency}
 />
 )}

 {/* Modals */}
 {renderAddTaskModal()}
 {renderTaskDetailPanel()}
 </CardContent>
 </Card>
 );
};

export default TaskSchedulerDashboard;
