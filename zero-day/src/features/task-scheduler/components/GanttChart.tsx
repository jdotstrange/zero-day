/**
 * GanttChart Component
 * Interactive Gantt chart visualization for task scheduling
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from '@/components/common';
import type { Task, TaskId, TaskStatus, TaskPriority } from '../types';

interface GanttChartProps {
 tasks: Task[];
 selectedTaskId: TaskId | null;
 onSelectTask: (taskId: TaskId | null) => void;
 onUpdateTask: (taskId: TaskId, updates: Partial<Task>) => void;
 viewMode: 'day' | 'week' | 'month';
 onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
}

interface TimelineConfig {
 startDate: Date;
 endDate: Date;
 totalDays: number;
 cellWidth: number;
 headerHeight: number;
 rowHeight: number;
}

interface GanttTaskView {
 id: TaskId;
 name: string;
 startDate: Date;
 endDate: Date;
 progress: number;
 status: TaskStatus;
 priority: TaskPriority;
 dependencies: TaskId[];
}

const STATUS_COLORS: Record<TaskStatus, { bg: string; border: string; text: string }> = {
 pending: { bg: 'bg-surface-100 dark:bg-surface-700', border: 'border-surface-300', text: 'text-secondary-600 dark:text-secondary-300' },
 scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300', text: 'text-blue-700 dark:text-blue-300' },
 in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300', text: 'text-yellow-700 dark:text-yellow-300' },
 completed: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300', text: 'text-green-700 dark:text-green-300' },
 blocked: { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-300', text: 'text-red-700 dark:text-red-300' },
 cancelled: { bg: 'bg-surface-100 dark:bg-surface-700', border: 'border-surface-400', text: 'text-secondary-500' },
 failed: { bg: 'bg-red-200 dark:bg-red-900/50', border: 'border-red-400', text: 'text-red-700 dark:text-red-300' },
};

const PRIORITY_INDICATORS: Record<TaskPriority, string> = {
 low: 'bg-green-500',
 medium: 'bg-yellow-500',
 high: 'bg-orange-500',
 urgent: 'bg-red-500',
 critical: 'bg-red-700',
};

export const GanttChart: React.FC<GanttChartProps> = ({
 tasks,
 selectedTaskId,
 onSelectTask,
 onUpdateTask,
 viewMode,
 onViewModeChange,
}) => {
 const containerRef = useRef<HTMLDivElement>(null);
 const [scrollLeft, setScrollLeft] = useState(0);
 const [draggingTask, setDraggingTask] = useState<TaskId | null>(null);
 const [dragOffset, setDragOffset] = useState(0);

 // Calculate timeline bounds
 const timelineConfig = useMemo<TimelineConfig>(() => {
 const now = new Date();
 let startDate = new Date(now);
 let endDate = new Date(now);

 // Find earliest and latest dates from tasks
 tasks.forEach(task => {
 if (task.scheduledStart && task.scheduledStart < startDate) {
 startDate = new Date(task.scheduledStart);
 }
 if (task.scheduledEnd && task.scheduledEnd > endDate) {
 endDate = new Date(task.scheduledEnd);
 }
 });

 // Add padding
 startDate.setDate(startDate.getDate() - 7);
 endDate.setDate(endDate.getDate() + 14);

 const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

 const cellWidth = viewMode === 'day' ? 40 : viewMode === 'week' ? 120 : 200;

 return {
 startDate,
 endDate,
 totalDays,
 cellWidth,
 headerHeight: 72,
 rowHeight: 64,
 };
 }, [tasks, viewMode]);


 // Convert tasks to Gantt format
 const ganttTasks = useMemo<GanttTaskView[]>(() => {
 return tasks
 .filter(task => task.scheduledStart || task.scheduledEnd)
 .map(task => {
 const start = task.scheduledStart || task.scheduledEnd!;
 const end = task.scheduledEnd || task.scheduledStart!;

 return {
 id: task.id,
 name: task.name,
 startDate: start,
 endDate: end,
 progress: task.progress,
 status: task.status,
 priority: task.priority,
 dependencies: task.dependencies.map(d => d.dependsOnId),
 };
 })
 .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
 }, [tasks, timelineConfig.startDate]);

 const visibleRowCount = useMemo(() => Math.max(6, ganttTasks.length), [ganttTasks.length]);

 // Generate timeline headers
 const timelineHeaders = useMemo(() => {
 const headers: { date: Date; label: string; isWeekend: boolean; isToday: boolean }[] = [];
 const today = new Date();
 today.setHours(0, 0, 0, 0);

 for (let i = 0; i < timelineConfig.totalDays; i++) {
 const date = new Date(timelineConfig.startDate);
 date.setDate(date.getDate() + i);
 const dayOfWeek = date.getDay();

 let label = '';
 if (viewMode === 'day') {
 label = date.getDate().toString();
 } else if (viewMode === 'week') {
 if (dayOfWeek === 1) { // Monday
 label = `Week ${Math.ceil((date.getDate() + 6 - dayOfWeek) / 7)}`;
 }
 } else {
 if (date.getDate() === 1) {
 label = date.toLocaleDateString('en-US', { month: 'short' });
 }
 }

 headers.push({
 date,
 label,
 isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
 isToday: date.getTime() === today.getTime(),
 });
 }

 return headers;
 }, [timelineConfig, viewMode]);

 // Handle scroll
 const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
 setScrollLeft(e.currentTarget.scrollLeft);
 };

 // Handle drag start
 const handleDragStart = (taskId: TaskId, e: React.MouseEvent) => {
 e.preventDefault();
 setDraggingTask(taskId);
 const rect = (e.target as HTMLElement).getBoundingClientRect();
 setDragOffset(e.clientX - rect.left);
 };

 // Handle drag
 useEffect(() => {
 if (!draggingTask) return;

 const handleMouseMove = (e: MouseEvent) => {
 if (!containerRef.current) return;
 
 const containerRect = containerRef.current.getBoundingClientRect();
 const relativeX = e.clientX - containerRect.left + scrollLeft - 200 - dragOffset;
 const dayOffset = Math.floor(relativeX / timelineConfig.cellWidth);
 
 const newStartDate = new Date(timelineConfig.startDate);
 newStartDate.setDate(newStartDate.getDate() + dayOffset);

 const task = tasks.find(t => t.id === draggingTask);
 if (task) {
 const duration = task.scheduledEnd && task.scheduledStart
 ? Math.ceil((task.scheduledEnd.getTime() - task.scheduledStart.getTime()) / (1000 * 60 * 60 * 24))
 : 1;
 
 const newEndDate = new Date(newStartDate);
 newEndDate.setDate(newEndDate.getDate() + duration);

 onUpdateTask(draggingTask, {
 scheduledStart: newStartDate,
 scheduledEnd: newEndDate,
 });
 }
 };

 const handleMouseUp = () => {
 setDraggingTask(null);
 setDragOffset(0);
 };

 document.addEventListener('mousemove', handleMouseMove);
 document.addEventListener('mouseup', handleMouseUp);

 return () => {
 document.removeEventListener('mousemove', handleMouseMove);
 document.removeEventListener('mouseup', handleMouseUp);
 };
 }, [draggingTask, scrollLeft, timelineConfig, tasks, onUpdateTask, dragOffset]);

 // Get task position and width
 const getTaskStyle = (task: GanttTaskView) => {
 const startOffset = Math.floor(
 (task.startDate.getTime() - timelineConfig.startDate.getTime()) / (1000 * 60 * 60 * 24)
 );
 const duration = Math.max(1, Math.ceil(
 (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
 ));

 return {
 left: `${startOffset * timelineConfig.cellWidth}px`,
 width: `${duration * timelineConfig.cellWidth - 8}px`,
 };
 };

 // Render dependency lines
 const renderDependencyLines = (task: GanttTaskView, taskIndex: number) => {
 return task.dependencies.map(depId => {
 const depTask = ganttTasks.find(t => t.id === depId);
 if (!depTask) return null;

 const depIndex = ganttTasks.findIndex(t => t.id === depId);
 const depEndOffset = Math.floor(
 (depTask.endDate.getTime() - timelineConfig.startDate.getTime()) / (1000 * 60 * 60 * 24)
 );
 const taskStartOffset = Math.floor(
 (task.startDate.getTime() - timelineConfig.startDate.getTime()) / (1000 * 60 * 60 * 24)
 );

 const x1 = depEndOffset * timelineConfig.cellWidth;
 const y1 = depIndex * timelineConfig.rowHeight + timelineConfig.rowHeight / 2;
 const x2 = taskStartOffset * timelineConfig.cellWidth;
 const y2 = taskIndex * timelineConfig.rowHeight + timelineConfig.rowHeight / 2;

 const midX = (x1 + x2) / 2;

 return (
 <g key={`${task.id}-${depId}`}>
 <path
 d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 className="text-secondary-300 dark:text-secondary-600"
 markerEnd="url(#arrowhead)"
 />
 </g>
 );
 });
 };

 return (
 <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <div className="flex items-center gap-2">
 <Icon icon="solar:calendar-bold-duotone" className="w-5 h-5 text-primary-500" />
 <h3 className="font-semibold text-secondary-900 dark:text-white">Gantt Chart</h3>
 <span className="text-sm text-secondary-500 dark:text-secondary-400">
 ({ganttTasks.length} tasks)
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
 {(['day', 'week', 'month'] as const).map(mode => (
 <button
 key={mode}
 onClick={() => onViewModeChange(mode)}
 className={`px-3 py-1 text-sm rounded-md transition-colors ${
 viewMode === mode
 ? 'bg-white dark:bg-surface-600 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
 }`}
 >
 {mode.charAt(0).toUpperCase() + mode.slice(1)}
 </button>
 ))}
 </div>
 <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
 <Icon icon="solar:settings-linear" className="w-5 h-5 text-secondary-500" />
 </button>
 </div>
 </div>

 {/* Chart */}
 <div className="flex">
 {/* Task List */}
 <div className="w-[200px] flex-shrink-0 border-r border-surface-200 dark:border-surface-700">
 {/* Header */}
 <div 
 className="px-4 py-3 bg-surface-50 dark:bg-surface-700/50 border-b border-surface-200 dark:border-surface-700 font-medium text-sm text-secondary-600 dark:text-secondary-300"
 style={{ height: `${timelineConfig.headerHeight}px` }}
 >
 Task Name
 </div>
 {/* Task rows */}
 <div
 className="overflow-auto"
 style={{ minHeight: `${visibleRowCount * timelineConfig.rowHeight}px` }}
 >
 {ganttTasks.map((task) => (
 <div
 key={task.id}
 onClick={() => onSelectTask(task.id)}
 className={`px-4 flex items-center gap-2 border-b border-surface-100 dark:border-surface-700 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors ${
 selectedTaskId === task.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
 }`}
 style={{ height: `${timelineConfig.rowHeight}px` }}
 >
 <div className={`w-2 h-2 rounded-full ${PRIORITY_INDICATORS[task.priority]}`} />
 <span className="text-sm text-secondary-900 dark:text-white truncate flex-1">
 {task.name}
 </span>
 <Icon
 icon={
 task.status === 'completed' ? 'solar:check-circle-bold' :
 task.status === 'blocked' ? 'solar:lock-bold' :
 task.status === 'in_progress' ? 'solar:play-circle-bold' :
 'solar:clock-circle-bold'
 }
 className={`w-4 h-4 flex-shrink-0 ${STATUS_COLORS[task.status].text}`}
 />
 </div>
 ))}
 </div>
 </div>

 {/* Timeline */}
 <div 
 ref={containerRef}
 className="flex-1 overflow-auto"
 onScroll={handleScroll}
 >
 <div style={{ width: `${timelineConfig.totalDays * timelineConfig.cellWidth}px` }}>
 {/* Timeline Header */}
 <div 
 className="flex border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50"
 style={{ height: `${timelineConfig.headerHeight}px` }}
 >
 {/* Month row */}
 <div className="absolute flex" style={{ height: '30px' }}>
 {timelineHeaders.filter(h => {
 if (viewMode === 'day') return h.date.getDate() === 1;
 if (viewMode === 'week') return h.date.getDay() === 1 && h.date.getDate() <= 7;
 return h.date.getDate() === 1;
 }).map(header => {
 const offset = Math.floor(
 (header.date.getTime() - timelineConfig.startDate.getTime()) / (1000 * 60 * 60 * 24)
 );
 return (
 <div
 key={header.date.toISOString()}
 className="text-xs font-medium text-secondary-600 dark:text-secondary-300 px-2"
 style={{ 
 position: 'absolute',
 left: `${offset * timelineConfig.cellWidth}px`,
 }}
 >
 {header.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
 </div>
 );
 })}
 </div>
 {/* Day row */}
 <div className="flex mt-7">
 {timelineHeaders.map((header, i) => (
 <div
 key={i}
 className={`flex-shrink-0 text-center text-xs border-l border-surface-200 dark:border-surface-600 ${
 header.isToday 
 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold' 
 : header.isWeekend 
 ? 'bg-surface-100 dark:bg-surface-700 text-secondary-400'
 : 'text-secondary-500 dark:text-secondary-400'
 }`}
 style={{ width: `${timelineConfig.cellWidth}px`, paddingTop: '6px' }}
 >
 {viewMode === 'day' ? (
 <>
 <div className="text-[10px] uppercase">
 {header.date.toLocaleDateString('en-US', { weekday: 'short' })}
 </div>
 <div>{header.label}</div>
 </>
 ) : (
 header.label
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Task Bars */}
 <div className="relative">
 {/* Background grid */}
 <div className="absolute inset-0 flex">
 {timelineHeaders.map((header, i) => (
 <div
 key={i}
 className={`flex-shrink-0 border-l border-surface-100 dark:border-surface-700 ${
 header.isToday 
 ? 'bg-primary-50/50 dark:bg-primary-900/10' 
 : header.isWeekend 
 ? 'bg-surface-50 dark:bg-surface-800'
 : ''
 }`}
 style={{
 width: `${timelineConfig.cellWidth}px`,
 height: `${visibleRowCount * timelineConfig.rowHeight}px`,
 }}
 />
 ))}
 </div>

 {/* Today marker */}
 {timelineHeaders.some(h => h.isToday) && (
 <div
 className="absolute top-0 w-0.5 bg-primary-500"
 style={{
 left: `${timelineHeaders.findIndex(h => h.isToday) * timelineConfig.cellWidth + timelineConfig.cellWidth / 2}px`,
 height: `${visibleRowCount * timelineConfig.rowHeight}px`,
 }}
 />
 )}

 {/* Dependency lines SVG */}
 <svg
 className="absolute inset-0 pointer-events-none"
 style={{ 
 width: `${timelineConfig.totalDays * timelineConfig.cellWidth}px`,
 height: `${visibleRowCount * timelineConfig.rowHeight}px`,
 }}
 >
 <defs>
 <marker
 id="arrowhead"
 markerWidth="10"
 markerHeight="7"
 refX="9"
 refY="3.5"
 orient="auto"
 >
 <polygon
 points="0 0, 10 3.5, 0 7"
 fill="currentColor"
 className="text-secondary-400 dark:text-secondary-500"
 />
 </marker>
 </defs>
 {ganttTasks.map((task, index) => renderDependencyLines(task, index))}
 </svg>

 {/* Task bars */}
 {ganttTasks.map((task, index) => {
 const style = getTaskStyle(task);
 const colors = STATUS_COLORS[task.status];

 return (
 <div
 key={task.id}
 className="absolute flex items-center"
 style={{
 top: `${index * timelineConfig.rowHeight + 8}px`,
 left: style.left,
 width: style.width,
 height: `${timelineConfig.rowHeight - 16}px`,
 }}
 >
 <div
 onMouseDown={(e) => handleDragStart(task.id, e)}
 onClick={() => onSelectTask(task.id)}
 className={`relative w-full h-full rounded-md border-2 cursor-move overflow-hidden transition-shadow ${
 colors.bg
 } ${colors.border} ${
 selectedTaskId === task.id 
 ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-surface-800' 
 : ' '
 } ${
 draggingTask === task.id ? 'opacity-75' : ''
 }`}
 >
 {/* Progress bar */}
 <div 
 className="absolute inset-y-0 left-0 bg-current opacity-20"
 style={{ width: `${task.progress}%` }}
 />
 {/* Content */}
 <div className="relative flex items-center gap-1 px-2 h-full">
 <span className={`text-xs font-medium truncate ${colors.text}`}>
 {task.name}
 </span>
 {task.progress > 0 && (
 <span className={`text-[10px] ${colors.text} opacity-75`}>
 {task.progress}%
 </span>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>

 {/* Legend */}
 <div className="flex items-center gap-6 px-4 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/30">
 <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Status:</span>
 {Object.entries(STATUS_COLORS).slice(0, 4).map(([status, colors]) => (
 <div key={status} className="flex items-center gap-1.5">
 <div className={`w-3 h-3 rounded border ${colors.bg} ${colors.border}`} />
 <span className="text-xs text-secondary-600 dark:text-secondary-300 capitalize">
 {status.replace('_', ' ')}
 </span>
 </div>
 ))}
 <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 ml-4">Priority:</span>
 {Object.entries(PRIORITY_INDICATORS).map(([priority, color]) => (
 <div key={priority} className="flex items-center gap-1.5">
 <div className={`w-2 h-2 rounded-full ${color}`} />
 <span className="text-xs text-secondary-600 dark:text-secondary-300 capitalize">{priority}</span>
 </div>
 ))}
 </div>
 </div>
 );
};

export default GanttChart;
