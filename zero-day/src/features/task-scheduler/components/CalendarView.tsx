/**
 * CalendarView Component
 * Calendar visualization for task scheduling with month/week/day views
 */

import React, { useState, useMemo } from 'react';
import { Icon } from '@/components/common';
import type { Task, TaskId, TaskStatus, TaskPriority } from '../types';

interface CalendarViewProps {
 tasks: Task[];
 selectedTaskId: TaskId | null;
 onSelectTask: (taskId: TaskId | null) => void;
 onDateSelect: (date: Date) => void;
 view: 'month' | 'week' | 'day';
 onViewChange: (view: 'month' | 'week' | 'day') => void;
}

interface CalendarDay {
 date: Date;
 isCurrentMonth: boolean;
 isToday: boolean;
 isSelected: boolean;
 tasks: Task[];
}

const STATUS_COLORS: Record<TaskStatus, string> = {
 pending: 'bg-surface-400',
 scheduled: 'bg-blue-500',
 in_progress: 'bg-yellow-500',
 completed: 'bg-green-500',
 blocked: 'bg-red-500',
 cancelled: 'bg-surface-300',
 failed: 'bg-red-700',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
 low: 'border-l-green-500',
 medium: 'border-l-yellow-500',
 high: 'border-l-orange-500',
 urgent: 'border-l-red-500',
 critical: 'border-l-red-700',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
 'January', 'February', 'March', 'April', 'May', 'June',
 'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
 tasks,
 selectedTaskId,
 onSelectTask,
 onDateSelect,
 view,
 onViewChange,
}) => {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [selectedDate, setSelectedDate] = useState<Date | null>(null);

 // Generate calendar days
 const calendarDays = useMemo<CalendarDay[]>(() => {
 const days: CalendarDay[] = [];
 const today = new Date();
 today.setHours(0, 0, 0, 0);

 const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
 const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
 
 // Start from the first day of the week containing the first day of month
 const startDate = new Date(firstDayOfMonth);
 startDate.setDate(startDate.getDate() - startDate.getDay());

 // End at the last day of the week containing the last day of month
 const endDate = new Date(lastDayOfMonth);
 endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

 const current = new Date(startDate);
 while (current <= endDate) {
 const dateClone = new Date(current);
 dateClone.setHours(0, 0, 0, 0);

 // Find tasks for this day
 const dayTasks = tasks.filter(task => {
 if (task.scheduledStart) {
 const taskDate = new Date(task.scheduledStart);
 taskDate.setHours(0, 0, 0, 0);
 return taskDate.getTime() === dateClone.getTime();
 }
 return false;
 });

 days.push({
 date: dateClone,
 isCurrentMonth: dateClone.getMonth() === currentDate.getMonth(),
 isToday: dateClone.getTime() === today.getTime(),
 isSelected: selectedDate ? dateClone.getTime() === selectedDate.getTime() : false,
 tasks: dayTasks,
 });

 current.setDate(current.getDate() + 1);
 }

 return days;
 }, [currentDate, tasks, selectedDate]);

 // Get week days for week view
 const weekDays = useMemo<CalendarDay[]>(() => {
 const days: CalendarDay[] = [];
 const today = new Date();
 today.setHours(0, 0, 0, 0);

 const startOfWeek = new Date(currentDate);
 startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

 for (let i = 0; i < 7; i++) {
 const date = new Date(startOfWeek);
 date.setDate(date.getDate() + i);
 date.setHours(0, 0, 0, 0);

 const dayTasks = tasks.filter(task => {
 if (task.scheduledStart) {
 const taskDate = new Date(task.scheduledStart);
 taskDate.setHours(0, 0, 0, 0);
 return taskDate.getTime() === date.getTime();
 }
 return false;
 });

 days.push({
 date,
 isCurrentMonth: true,
 isToday: date.getTime() === today.getTime(),
 isSelected: selectedDate ? date.getTime() === selectedDate.getTime() : false,
 tasks: dayTasks,
 });
 }

 return days;
 }, [currentDate, tasks, selectedDate]);

 // Get tasks for day view
 const dayTasks = useMemo(() => {
 return tasks.filter(task => {
 if (task.scheduledStart) {
 const taskDate = new Date(task.scheduledStart);
 taskDate.setHours(0, 0, 0, 0);
 const currentDateClean = new Date(currentDate);
 currentDateClean.setHours(0, 0, 0, 0);
 return taskDate.getTime() === currentDateClean.getTime();
 }
 return false;
 });
 }, [currentDate, tasks]);

 const navigatePrevious = () => {
 const newDate = new Date(currentDate);
 if (view === 'month') {
 newDate.setMonth(newDate.getMonth() - 1);
 } else if (view === 'week') {
 newDate.setDate(newDate.getDate() - 7);
 } else {
 newDate.setDate(newDate.getDate() - 1);
 }
 setCurrentDate(newDate);
 };

 const navigateNext = () => {
 const newDate = new Date(currentDate);
 if (view === 'month') {
 newDate.setMonth(newDate.getMonth() + 1);
 } else if (view === 'week') {
 newDate.setDate(newDate.getDate() + 7);
 } else {
 newDate.setDate(newDate.getDate() + 1);
 }
 setCurrentDate(newDate);
 };

 const goToToday = () => {
 setCurrentDate(new Date());
 };

 const handleDateClick = (date: Date) => {
 setSelectedDate(date);
 onDateSelect(date);
 };

 const getHeaderText = () => {
 if (view === 'month') {
 return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
 } else if (view === 'week') {
 const startOfWeek = new Date(currentDate);
 startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
 const endOfWeek = new Date(startOfWeek);
 endOfWeek.setDate(endOfWeek.getDate() + 6);
 return `${MONTHS[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${
 startOfWeek.getMonth() !== endOfWeek.getMonth() ? MONTHS[endOfWeek.getMonth()] + ' ' : ''
 }${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
 } else {
 return currentDate.toLocaleDateString('en-US', {
 weekday: 'long',
 month: 'long',
 day: 'numeric',
 year: 'numeric',
 });
 }
 };

 const renderMonthView = () => (
 <div className="p-4">
 {/* Weekday headers */}
 <div className="grid grid-cols-7 gap-1 mb-2">
 {WEEKDAYS.map(day => (
 <div
 key={day}
 className="text-center text-sm font-medium text-secondary-500 dark:text-secondary-400 py-2"
 >
 {day}
 </div>
 ))}
 </div>

 {/* Calendar grid */}
 <div className="grid grid-cols-7 gap-1">
 {calendarDays.map((day, index) => (
 <div
 key={index}
 onClick={() => handleDateClick(day.date)}
 className={`min-h-[100px] p-1 border rounded-lg cursor-pointer transition-colors ${
 day.isToday
 ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
 : day.isSelected
 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
 : day.isCurrentMonth
 ? 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50'
 : 'border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50'
 }`}
 >
 <div className={`text-sm font-medium mb-1 ${
 day.isToday
 ? 'text-primary-600 dark:text-primary-400'
 : day.isCurrentMonth
 ? 'text-secondary-900 dark:text-white'
 : 'text-secondary-400 dark:text-secondary-600'
 }`}>
 {day.date.getDate()}
 </div>
 <div className="space-y-1">
 {day.tasks.slice(0, 3).map(task => (
 <div
 key={task.id}
 onClick={(e) => {
 e.stopPropagation();
 onSelectTask(task.id);
 }}
 className={`px-1.5 py-0.5 rounded text-xs truncate border-l-2 ${
 PRIORITY_COLORS[task.priority]
 } ${
 selectedTaskId === task.id
 ? 'bg-primary-100 dark:bg-primary-900/30'
 : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
 }`}
 >
 <div className="flex items-center gap-1">
 <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[task.status]}`} />
 <span className="truncate text-secondary-700 dark:text-secondary-300">
 {task.name}
 </span>
 </div>
 </div>
 ))}
 {day.tasks.length > 3 && (
 <div className="text-xs text-secondary-500 dark:text-secondary-400 px-1">
 +{day.tasks.length - 3} more
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 );

 const renderWeekView = () => (
 <div className="p-4">
 <div className="grid grid-cols-7 gap-2">
 {weekDays.map((day, index) => (
 <div
 key={index}
 onClick={() => handleDateClick(day.date)}
 className={`min-h-[400px] border rounded-lg cursor-pointer transition-colors ${
 day.isToday
 ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
 : day.isSelected
 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
 : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50'
 }`}
 >
 {/* Day header */}
 <div className={`text-center py-2 border-b ${
 day.isToday
 ? 'border-primary-200 dark:border-primary-700'
 : 'border-surface-200 dark:border-surface-700'
 }`}>
 <div className={`text-xs uppercase ${
 day.isToday
 ? 'text-primary-600 dark:text-primary-400'
 : 'text-secondary-500 dark:text-secondary-400'
 }`}>
 {WEEKDAYS[index]}
 </div>
 <div className={`text-lg font-semibold ${
 day.isToday
 ? 'text-primary-600 dark:text-primary-400'
 : 'text-secondary-900 dark:text-white'
 }`}>
 {day.date.getDate()}
 </div>
 </div>

 {/* Tasks */}
 <div className="p-2 space-y-1 overflow-auto max-h-[350px]">
 {day.tasks.map(task => (
 <div
 key={task.id}
 onClick={(e) => {
 e.stopPropagation();
 onSelectTask(task.id);
 }}
 className={`p-2 rounded border-l-2 ${PRIORITY_COLORS[task.priority]} ${
 selectedTaskId === task.id
 ? 'bg-primary-100 dark:bg-primary-900/30 ring-1 ring-primary-500'
 : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
 }`}
 >
 <div className="flex items-center gap-1.5 mb-1">
 <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[task.status]}`} />
 <span className="text-xs font-medium text-secondary-800 dark:text-secondary-200 truncate">
 {task.name}
 </span>
 </div>
 {task.scheduledStart && (
 <div className="text-[10px] text-secondary-500 dark:text-secondary-400">
 {task.scheduledStart.toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit',
 })}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 );

 const renderDayView = () => {
 const hours = Array.from({ length: 24 }, (_, i) => i);

 return (
 <div className="p-4">
 <div className="flex">
 {/* Time column */}
 <div className="w-16 flex-shrink-0">
 {hours.map(hour => (
 <div
 key={hour}
 className="h-16 flex items-start justify-end pr-2 text-xs text-secondary-500 dark:text-secondary-400"
 >
 {hour.toString().padStart(2, '0')}:00
 </div>
 ))}
 </div>

 {/* Events column */}
 <div className="flex-1 relative border-l border-surface-200 dark:border-surface-700">
 {/* Hour lines */}
 {hours.map(hour => (
 <div
 key={hour}
 className="h-16 border-b border-surface-100 dark:border-surface-700"
 />
 ))}

 {/* Tasks */}
 {dayTasks.map(task => {
 if (!task.scheduledStart) return null;

 const startHour = task.scheduledStart.getHours();
 const startMinute = task.scheduledStart.getMinutes();
 const duration = task.duration || 60; // Default 1 hour
 const top = (startHour * 64) + (startMinute / 60 * 64);
 const height = Math.max(32, (duration / 60) * 64);

 return (
 <div
 key={task.id}
 onClick={() => onSelectTask(task.id)}
 className={`absolute left-1 right-1 rounded-md border-l-4 p-2 cursor-pointer transition-shadow ${
 PRIORITY_COLORS[task.priority]
 } ${
 selectedTaskId === task.id
 ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 shadow-lg'
 : 'bg-surface-100 dark:bg-surface-700 '
 }`}
 style={{ top: `${top}px`, height: `${height}px`, minHeight: '32px' }}
 >
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[task.status]}`} />
 <span className="text-sm font-medium text-secondary-800 dark:text-secondary-200 truncate">
 {task.name}
 </span>
 </div>
 <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
 {task.scheduledStart.toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit',
 })}
 {task.scheduledEnd && (
 <>
 {' - '}
 {task.scheduledEnd.toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit',
 })}
 </>
 )}
 </div>
 </div>
 );
 })}

 {/* Current time indicator */}
 {(() => {
 const now = new Date();
 const today = new Date(currentDate);
 today.setHours(0, 0, 0, 0);
 const todayCheck = new Date();
 todayCheck.setHours(0, 0, 0, 0);
 
 if (today.getTime() === todayCheck.getTime()) {
 const top = (now.getHours() * 64) + (now.getMinutes() / 60 * 64);
 return (
 <div
 className="absolute left-0 right-0 flex items-center"
 style={{ top: `${top}px` }}
 >
 <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
 <div className="flex-1 h-0.5 bg-red-500" />
 </div>
 );
 }
 return null;
 })()}
 </div>
 </div>
 </div>
 );
 };

 return (
 <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2">
 <button
 onClick={navigatePrevious}
 className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
 </button>
 <button
 onClick={navigateNext}
 className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
 </button>
 </div>

 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
 {getHeaderText()}
 </h3>

 <button
 onClick={goToToday}
 className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
 >
 Today
 </button>
 </div>

 <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
 {(['month', 'week', 'day'] as const).map(v => (
 <button
 key={v}
 onClick={() => onViewChange(v)}
 className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
 view === v
 ? 'bg-white dark:bg-surface-600 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
 }`}
 >
 {v.charAt(0).toUpperCase() + v.slice(1)}
 </button>
 ))}
 </div>
 </div>

 {/* Calendar Content */}
 <div className="overflow-auto max-h-[600px]">
 {view === 'month' && renderMonthView()}
 {view === 'week' && renderWeekView()}
 {view === 'day' && renderDayView()}
 </div>

 {/* Footer stats */}
 <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/30">
 <div className="flex items-center gap-4">
 <span className="text-sm text-secondary-600 dark:text-secondary-400">
 <span className="font-medium text-secondary-900 dark:text-white">{tasks.length}</span> total tasks
 </span>
 <span className="text-sm text-secondary-600 dark:text-secondary-400">
 <span className="font-medium text-green-600 dark:text-green-400">
 {tasks.filter(t => t.status === 'completed').length}
 </span> completed
 </span>
 <span className="text-sm text-secondary-600 dark:text-secondary-400">
 <span className="font-medium text-yellow-600 dark:text-yellow-400">
 {tasks.filter(t => t.status === 'in_progress').length}
 </span> in progress
 </span>
 </div>
 <div className="flex items-center gap-3">
 {Object.entries(STATUS_COLORS).slice(0, 4).map(([status, color]) => (
 <div key={status} className="flex items-center gap-1.5">
 <div className={`w-2 h-2 rounded-full ${color}`} />
 <span className="text-xs text-secondary-600 dark:text-secondary-300 capitalize">
 {status.replace('_', ' ')}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

export default CalendarView;
