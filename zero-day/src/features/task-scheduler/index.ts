/**
 * Task Scheduler Feature
 * Phase 2 - Task Scheduling & Dependencies
 * 
 * Provides comprehensive task scheduling with dependency management,
 * critical path analysis, Gantt chart visualization, and calendar views.
 */

// Types
export * from './types';

// Engine functions
export {
 generateId,
 createTask,
 createDependency,
 getDependencyChain,
 getDependentTasks,
 hasCircularDependency,
 topologicalSort,
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

// Configuration
export {
 taskTemplates,
 projectTemplates,
 priorityConfig,
 statusConfig,
 dependencyTypeConfig,
 recurrencePatterns,
 generateSampleTasks,
} from './config';

// Hook
export { useTaskScheduler } from './useTaskScheduler';
export type { UseTaskSchedulerReturn } from './useTaskScheduler';

// Components
export {
 GanttChart,
 CalendarView,
 DependencyGraph,
 TaskSchedulerDashboard,
} from './components';
