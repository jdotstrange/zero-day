/**
 * DependencyGraph Component
 * Visual dependency graph for task relationships
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/common';
import type { Task, TaskId, TaskStatus, DependencyType } from '../types';

interface DependencyGraphProps {
 tasks: Task[];
 selectedTaskId: TaskId | null;
 onSelectTask: (taskId: TaskId | null) => void;
 onAddDependency: (fromTaskId: TaskId, toTaskId: TaskId, type: DependencyType) => void;
 onRemoveDependency: (taskId: TaskId, dependencyId: string) => void;
}

interface NodePosition {
 x: number;
 y: number;
}

interface GraphNode {
 task: Task;
 position: NodePosition;
 level: number;
 order: number;
}

const STATUS_COLORS: Record<TaskStatus, { fill: string; stroke: string; text: string }> = {
 pending: { fill: '#f3f4f6', stroke: '#9ca3af', text: '#4b5563' },
 scheduled: { fill: '#dbeafe', stroke: '#3b82f6', text: '#1d4ed8' },
 in_progress: { fill: '#fef3c7', stroke: '#f59e0b', text: '#b45309' },
 completed: { fill: '#d1fae5', stroke: '#10b981', text: '#047857' },
 blocked: { fill: '#fee2e2', stroke: '#ef4444', text: '#b91c1c' },
 cancelled: { fill: '#e5e7eb', stroke: '#6b7280', text: '#374151' },
 failed: { fill: '#fecaca', stroke: '#dc2626', text: '#991b1b' },
};

const DEPENDENCY_TYPE_COLORS: Record<DependencyType, string> = {
 finish_to_start: '#6366f1',
 start_to_start: '#10b981',
 finish_to_finish: '#f59e0b',
 start_to_finish: '#ef4444',
};

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const LEVEL_SPACING = 250;
const NODE_SPACING = 120;

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
 tasks,
 selectedTaskId,
 onSelectTask,
 onAddDependency,
 onRemoveDependency,
}) => {
 const svgRef = useRef<SVGSVGElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);

 const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 600 });
 const [isPanning, setIsPanning] = useState(false);
 const [panStart, setPanStart] = useState({ x: 0, y: 0 });
 const [zoom, setZoom] = useState(1);
 const [draggingEdge, setDraggingEdge] = useState<{ fromTaskId: TaskId; toPos: NodePosition } | null>(null);
 const [hoveredTask, setHoveredTask] = useState<TaskId | null>(null);
 const [showDependencyModal, setShowDependencyModal] = useState(false);
 const [pendingDependency, setPendingDependency] = useState<{ from: TaskId; to: TaskId } | null>(null);

 // Build the dependency graph with levels
 const graphNodes = useMemo<GraphNode[]>(() => {
 if (tasks.length === 0) return [];

 // Calculate levels using topological sort
 const taskMap = new Map<TaskId, Task>();
 const inDegree = new Map<TaskId, number>();
 const adjacencyList = new Map<TaskId, TaskId[]>();

 tasks.forEach(task => {
 taskMap.set(task.id, task);
 inDegree.set(task.id, 0);
 adjacencyList.set(task.id, []);
 });

 tasks.forEach(task => {
 task.dependencies.forEach(dep => {
 const dependsOn = taskMap.get(dep.dependsOnId);
 if (dependsOn) {
 adjacencyList.get(dep.dependsOnId)?.push(task.id);
 inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
 }
 });
 });

 // Calculate levels
 const levels = new Map<TaskId, number>();
 const queue: TaskId[] = [];

 // Start with tasks that have no dependencies
 tasks.forEach(task => {
 if (task.dependencies.length === 0) {
 queue.push(task.id);
 levels.set(task.id, 0);
 }
 });

 while (queue.length > 0) {
 const current = queue.shift()!;
 const currentLevel = levels.get(current) || 0;

 adjacencyList.get(current)?.forEach(dependent => {
 const newLevel = currentLevel + 1;
 levels.set(dependent, Math.max(levels.get(dependent) || 0, newLevel));
 
 const remaining = (inDegree.get(dependent) || 1) - 1;
 inDegree.set(dependent, remaining);
 
 if (remaining === 0) {
 queue.push(dependent);
 }
 });
 }

 // Handle tasks not in the graph (no dependencies and no dependents)
 tasks.forEach(task => {
 if (!levels.has(task.id)) {
 levels.set(task.id, 0);
 }
 });

 // Group by level and assign positions
 const levelGroups = new Map<number, Task[]>();
 tasks.forEach(task => {
 const level = levels.get(task.id) || 0;
 if (!levelGroups.has(level)) {
 levelGroups.set(level, []);
 }
 levelGroups.get(level)!.push(task);
 });

 // Create nodes with positions
 const nodes: GraphNode[] = [];
 levelGroups.forEach((levelTasks, level) => {
 levelTasks.forEach((task, order) => {
 nodes.push({
 task,
 level,
 order,
 position: {
 x: level * LEVEL_SPACING + 50,
 y: order * NODE_SPACING + 50,
 },
 });
 });
 });

 return nodes;
 }, [tasks]);

 // Calculate SVG dimensions
 const svgDimensions = useMemo(() => {
 if (graphNodes.length === 0) {
 return { width: 800, height: 400 };
 }

 const maxX = Math.max(...graphNodes.map(n => n.position.x)) + NODE_WIDTH + 100;
 const maxY = Math.max(...graphNodes.map(n => n.position.y)) + NODE_HEIGHT + 100;

 return {
 width: Math.max(800, maxX),
 height: Math.max(400, maxY),
 };
 }, [graphNodes]);

 // Handle mouse events for panning
 const handleMouseDown = useCallback((e: React.MouseEvent) => {
 if (e.button === 0 && !draggingEdge) {
 setIsPanning(true);
 setPanStart({ x: e.clientX, y: e.clientY });
 }
 }, [draggingEdge]);

 const handleMouseMove = useCallback((e: React.MouseEvent) => {
 if (isPanning) {
 const dx = (e.clientX - panStart.x) / zoom;
 const dy = (e.clientY - panStart.y) / zoom;
 setViewBox(prev => ({
 ...prev,
 x: prev.x - dx,
 y: prev.y - dy,
 }));
 setPanStart({ x: e.clientX, y: e.clientY });
 } else if (draggingEdge && svgRef.current) {
 const rect = svgRef.current.getBoundingClientRect();
 const x = ((e.clientX - rect.left) / zoom) + viewBox.x;
 const y = ((e.clientY - rect.top) / zoom) + viewBox.y;
 setDraggingEdge(prev => prev ? { ...prev, toPos: { x, y } } : null);
 }
 }, [isPanning, panStart, zoom, viewBox, draggingEdge]);

 const handleMouseUp = useCallback(() => {
 setIsPanning(false);
 if (draggingEdge) {
 // Check if dropped on a task
 const dropTarget = graphNodes.find(node => {
 const dx = draggingEdge.toPos.x - node.position.x;
 const dy = draggingEdge.toPos.y - node.position.y;
 return dx >= 0 && dx <= NODE_WIDTH && dy >= 0 && dy <= NODE_HEIGHT;
 });

 if (dropTarget && dropTarget.task.id !== draggingEdge.fromTaskId) {
 setPendingDependency({ from: draggingEdge.fromTaskId, to: dropTarget.task.id });
 setShowDependencyModal(true);
 }
 setDraggingEdge(null);
 }
 }, [draggingEdge, graphNodes]);

 // Zoom controls
 const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.1));
 const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1));
 const handleResetView = () => {
 setZoom(1);
 setViewBox({ x: 0, y: 0, width: 1200, height: 600 });
 };

 // Handle wheel zoom
 useEffect(() => {
 const handleWheel = (e: WheelEvent) => {
 if (e.ctrlKey || e.metaKey) {
 e.preventDefault();
 const delta = e.deltaY > 0 ? -0.1 : 0.1;
 setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
 }
 };

 const container = containerRef.current;
 if (container) {
 container.addEventListener('wheel', handleWheel, { passive: false });
 return () => container.removeEventListener('wheel', handleWheel);
 }
 }, []);

 // Draw edge between nodes
 const drawEdge = (fromNode: GraphNode, toNode: GraphNode, type: DependencyType, id: string) => {
 const fromX = fromNode.position.x + NODE_WIDTH;
 const fromY = fromNode.position.y + NODE_HEIGHT / 2;
 const toX = toNode.position.x;
 const toY = toNode.position.y + NODE_HEIGHT / 2;

 const midX = (fromX + toX) / 2;

 const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

 return (
 <g key={id}>
 <path
 d={path}
 fill="none"
 stroke={DEPENDENCY_TYPE_COLORS[type]}
 strokeWidth={2}
 strokeDasharray={type === 'finish_to_start' ? 'none' : '5,5'}
 className="transition-opacity"
 opacity={hoveredTask && hoveredTask !== fromNode.task.id && hoveredTask !== toNode.task.id ? 0.3 : 1}
 />
 {/* Arrow marker */}
 <polygon
 points={`${toX},${toY} ${toX - 8},${toY - 4} ${toX - 8},${toY + 4}`}
 fill={DEPENDENCY_TYPE_COLORS[type]}
 opacity={hoveredTask && hoveredTask !== fromNode.task.id && hoveredTask !== toNode.task.id ? 0.3 : 1}
 />
 </g>
 );
 };

 // Render dependency modal
 const renderDependencyModal = () => {
 if (!showDependencyModal || !pendingDependency) return null;

 const fromTask = tasks.find(t => t.id === pendingDependency.from);
 const toTask = tasks.find(t => t.id === pendingDependency.to);

 return createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={() => {
 setShowDependencyModal(false);
 setPendingDependency(null);
 }}
 />
 <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fade-in">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
 Add Dependency
 </h3>
 <p className="text-secondary-600 dark:text-secondary-400 mb-4">
 Create a dependency from <span className="font-medium text-secondary-900 dark:text-white">{fromTask?.name}</span> to <span className="font-medium text-secondary-900 dark:text-white">{toTask?.name}</span>
 </p>
 <div className="space-y-2 mb-6">
 {(['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish'] as DependencyType[]).map(type => (
 <button
 key={type}
 onClick={() => {
 onAddDependency(pendingDependency.from, pendingDependency.to, type);
 setShowDependencyModal(false);
 setPendingDependency(null);
 }}
 className="w-full flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
 >
 <div className="w-4 h-1 rounded" style={{ backgroundColor: DEPENDENCY_TYPE_COLORS[type] }} />
 <span className="text-sm text-secondary-700 dark:text-secondary-300 capitalize">
 {type.replace(/_/g, ' ')}
 </span>
 </button>
 ))}
 </div>
 <button
 onClick={() => {
 setShowDependencyModal(false);
 setPendingDependency(null);
 }}
 className="w-full px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>,
 document.body
 );
 };

 return (
 <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
 <div className="flex items-center gap-2">
 <Icon icon="solar:graph-bold-duotone" className="w-5 h-5 text-primary-500" />
 <h3 className="font-semibold text-secondary-900 dark:text-white">Dependency Graph</h3>
 <span className="text-sm text-secondary-500 dark:text-secondary-400">
 ({tasks.length} tasks, {tasks.reduce((acc, t) => acc + t.dependencies.length, 0)} dependencies)
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={handleZoomOut}
 className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:minus-circle-linear" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
 </button>
 <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400 min-w-[3rem] text-center">
 {Math.round(zoom * 100)}%
 </span>
 <button
 onClick={handleZoomIn}
 className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
 </button>
 <div className="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1" />
 <button
 onClick={handleResetView}
 className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 <Icon icon="solar:restart-linear" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
 </button>
 </div>
 </div>

 {/* Graph Canvas */}
 <div
 ref={containerRef}
 className="relative overflow-hidden cursor-grab active:cursor-grabbing"
 style={{ height: '500px' }}
 onMouseDown={handleMouseDown}
 onMouseMove={handleMouseMove}
 onMouseUp={handleMouseUp}
 onMouseLeave={handleMouseUp}
 >
 {tasks.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-secondary-500 dark:text-secondary-400">
 <Icon icon="solar:graph-linear" className="w-16 h-16 mb-4 opacity-50" />
 <p className="text-lg font-medium">No tasks to display</p>
 <p className="text-sm">Add tasks to see the dependency graph</p>
 </div>
 ) : (
 <svg
 ref={svgRef}
 width="100%"
 height="100%"
 viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
 style={{ minWidth: svgDimensions.width, minHeight: svgDimensions.height }}
 >
 {/* Background pattern */}
 <defs>
 <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
 <circle cx="1" cy="1" r="1" fill="currentColor" className="text-secondary-200 dark:text-secondary-700" />
 </pattern>
 </defs>
 <rect
 x={viewBox.x - 1000}
 y={viewBox.y - 1000}
 width={svgDimensions.width + 2000}
 height={svgDimensions.height + 2000}
 fill="url(#grid)"
 />

 {/* Edges */}
 {graphNodes.flatMap(node =>
 node.task.dependencies.map(dep => {
 const fromNode = graphNodes.find(n => n.task.id === dep.dependsOnId);
 if (!fromNode) return null;
 return drawEdge(fromNode, node, dep.type, dep.id);
 })
 )}

 {/* Dragging edge */}
 {draggingEdge && (() => {
 const fromNode = graphNodes.find(n => n.task.id === draggingEdge.fromTaskId);
 if (!fromNode) return null;
 return (
 <path
 d={`M ${fromNode.position.x + NODE_WIDTH} ${fromNode.position.y + NODE_HEIGHT / 2} L ${draggingEdge.toPos.x} ${draggingEdge.toPos.y}`}
 fill="none"
 stroke="#6366f1"
 strokeWidth={2}
 strokeDasharray="5,5"
 />
 );
 })()}

 {/* Nodes */}
 {graphNodes.map(node => {
 const colors = STATUS_COLORS[node.task.status];
 const isSelected = selectedTaskId === node.task.id;
 const isHovered = hoveredTask === node.task.id;

 return (
 <g
 key={node.task.id}
 transform={`translate(${node.position.x}, ${node.position.y})`}
 onClick={(e) => {
 e.stopPropagation();
 onSelectTask(node.task.id);
 }}
 onMouseEnter={() => setHoveredTask(node.task.id)}
 onMouseLeave={() => setHoveredTask(null)}
 className="cursor-pointer"
 >
 {/* Node background */}
 <rect
 width={NODE_WIDTH}
 height={NODE_HEIGHT}
 rx={8}
 fill={colors.fill}
 stroke={isSelected ? '#6366f1' : colors.stroke}
 strokeWidth={isSelected ? 3 : 2}
 className="transition-all duration-200"
 style={{
 filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
 }}
 />

 {/* Priority indicator */}
 <rect
 x={0}
 y={0}
 width={4}
 height={NODE_HEIGHT}
 rx={2}
 fill={
 node.task.priority === 'critical' ? '#dc2626' :
 node.task.priority === 'urgent' ? '#ef4444' :
 node.task.priority === 'high' ? '#f97316' :
 node.task.priority === 'medium' ? '#eab308' : '#22c55e'
 }
 />

 {/* Task name */}
 <text
 x={12}
 y={25}
 fontSize={12}
 fontWeight={600}
 fill={colors.text}
 >
 {node.task.name.length > 18 
 ? node.task.name.substring(0, 18) + '...' 
 : node.task.name}
 </text>

 {/* Status */}
 <text
 x={12}
 y={45}
 fontSize={10}
 fill={colors.text}
 opacity={0.8}
 >
 {node.task.status.replace('_', ' ')}
 </text>

 {/* Progress bar */}
 <rect
 x={12}
 y={55}
 width={NODE_WIDTH - 24}
 height={4}
 rx={2}
 fill="currentColor"
 className="text-secondary-200 dark:text-secondary-600"
 />
 <rect
 x={12}
 y={55}
 width={(NODE_WIDTH - 24) * (node.task.progress / 100)}
 height={4}
 rx={2}
 fill={colors.stroke}
 />

 {/* Progress percentage */}
 <text
 x={NODE_WIDTH - 12}
 y={62}
 fontSize={9}
 textAnchor="end"
 fill={colors.text}
 opacity={0.7}
 >
 {node.task.progress}%
 </text>

 {/* Connection handle */}
 <circle
 cx={NODE_WIDTH}
 cy={NODE_HEIGHT / 2}
 r={6}
 fill="white"
 stroke={colors.stroke}
 strokeWidth={2}
 className="cursor-crosshair hover:fill-primary-100 transition-colors"
 onMouseDown={(e) => {
 e.stopPropagation();
 setDraggingEdge({
 fromTaskId: node.task.id,
 toPos: { x: node.position.x + NODE_WIDTH, y: node.position.y + NODE_HEIGHT / 2 },
 });
 }}
 />

 {/* Delete dependencies button (when selected) */}
 {isSelected && node.task.dependencies.length > 0 && (
 <g transform={`translate(${NODE_WIDTH - 20}, -10)`}>
 <circle
 r={10}
 fill="#ef4444"
 className="cursor-pointer hover:fill-red-600 transition-colors"
 onClick={(e) => {
 e.stopPropagation();
 node.task.dependencies.forEach(dep => {
 onRemoveDependency(node.task.id, dep.id);
 });
 }}
 />
 <text
 y={4}
 fontSize={12}
 fill="white"
 textAnchor="middle"
 className="pointer-events-none"
 >
 ×
 </text>
 </g>
 )}
 </g>
 );
 })}
 </svg>
 )}
 </div>

 {/* Legend */}
 <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/30">
 <div className="flex items-center gap-4">
 <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Dependency Types:</span>
 {Object.entries(DEPENDENCY_TYPE_COLORS).map(([type, color]) => (
 <div key={type} className="flex items-center gap-1.5">
 <div className="w-4 h-1 rounded" style={{ backgroundColor: color }} />
 <span className="text-xs text-secondary-600 dark:text-secondary-300 capitalize">
 {type.replace(/_/g, ' ')}
 </span>
 </div>
 ))}
 </div>
 <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
 <Icon icon="solar:info-circle-linear" className="w-4 h-4" />
 <span>Drag from handle to create dependency</span>
 </div>
 </div>

 {/* Dependency Modal */}
 {renderDependencyModal()}
 </div>
 );
};

export default DependencyGraph;
