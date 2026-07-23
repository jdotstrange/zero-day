/**
 * Workflow Canvas Component
 * Interactive canvas for building workflows with drag-and-drop
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { Icon } from '@/components/common'
import type { WorkflowNode, WorkflowConnection, NodePort } from '../types'
import { nodeTypeColors, nodeTypeIcons } from '../config'

interface WorkflowCanvasProps {
 nodes: WorkflowNode[]
 connections: WorkflowConnection[]
 selectedNodeId: string | null
 selectedConnectionId: string | null
 onSelectNode: (nodeId: string | null) => void
 onSelectConnection: (connectionId: string | null) => void
 onMoveNode: (nodeId: string, position: { x: number; y: number }) => void
 onAddConnection: (sourceNodeId: string, sourcePortId: string, targetNodeId: string, targetPortId: string) => void
 onDeleteNode: (nodeId: string) => void
 onDeleteConnection: (connectionId: string) => void
 onNodeDoubleClick: (nodeId: string) => void
}

interface DragState {
 type: 'node' | 'connection' | 'pan' | null
 nodeId?: string
 startX: number
 startY: number
 offsetX: number
 offsetY: number
 sourcePort?: { nodeId: string; portId: string; x: number; y: number }
}

export function WorkflowCanvas({
 nodes,
 connections,
 selectedNodeId,
 selectedConnectionId,
 onSelectNode,
 onSelectConnection,
 onMoveNode,
 onAddConnection,
 onDeleteNode,
 onDeleteConnection,
 onNodeDoubleClick,
}: WorkflowCanvasProps) {
 const canvasRef = useRef<HTMLDivElement>(null)
 const [dragState, setDragState] = useState<DragState | null>(null)
 const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
 const [connectionPreview, setConnectionPreview] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)

 // Handle keyboard shortcuts
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'Delete' || e.key === 'Backspace') {
 if (selectedNodeId) {
 onDeleteNode(selectedNodeId)
 } else if (selectedConnectionId) {
 onDeleteConnection(selectedConnectionId)
 }
 }
 if (e.key === 'Escape') {
 onSelectNode(null)
 onSelectConnection(null)
 }
 }

 window.addEventListener('keydown', handleKeyDown)
 return () => window.removeEventListener('keydown', handleKeyDown)
 }, [selectedNodeId, selectedConnectionId, onDeleteNode, onDeleteConnection, onSelectNode, onSelectConnection])

 // Get port position
 const getPortPosition = useCallback((node: WorkflowNode, port: NodePort): { x: number; y: number } => {
 const nodeWidth = 200
 const portOffset = 20

 if (port.type === 'input') {
 const inputIndex = node.inputs.findIndex(p => p.id === port.id)
 return {
 x: node.position.x,
 y: node.position.y + portOffset + inputIndex * 24 + 40,
 }
 } else {
 const outputIndex = node.outputs.findIndex(p => p.id === port.id)
 return {
 x: node.position.x + nodeWidth,
 y: node.position.y + portOffset + outputIndex * 24 + 40,
 }
 }
 }, [])

 // Handle mouse down on node
 const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
 e.stopPropagation()
 onSelectNode(nodeId)
 onSelectConnection(null)

 const node = nodes.find(n => n.id === nodeId)
 if (!node) return

 setDragState({
 type: 'node',
 nodeId,
 startX: e.clientX,
 startY: e.clientY,
 offsetX: node.position.x,
 offsetY: node.position.y,
 })
 }, [nodes, onSelectNode, onSelectConnection])

 // Handle mouse down on port
 const handlePortMouseDown = useCallback((e: React.MouseEvent, node: WorkflowNode, port: NodePort) => {
 e.stopPropagation()
 if (port.type !== 'output') return

 const pos = getPortPosition(node, port)
 setDragState({
 type: 'connection',
 startX: e.clientX,
 startY: e.clientY,
 offsetX: 0,
 offsetY: 0,
 sourcePort: { nodeId: node.id, portId: port.id, x: pos.x, y: pos.y },
 })
 setConnectionPreview({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y })
 }, [getPortPosition])

 // Handle mouse up on port (connection drop)
 const handlePortMouseUp = useCallback((node: WorkflowNode, port: NodePort) => {
 if (!dragState?.sourcePort || port.type !== 'input') return

 onAddConnection(
 dragState.sourcePort.nodeId,
 dragState.sourcePort.portId,
 node.id,
 port.id
 )

 setDragState(null)
 setConnectionPreview(null)
 }, [dragState, onAddConnection])

 // Handle canvas mouse down
 const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
 if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-grid')) {
 onSelectNode(null)
 onSelectConnection(null)

 // Pan start
 setDragState({
 type: 'pan',
 startX: e.clientX,
 startY: e.clientY,
 offsetX: viewport.x,
 offsetY: viewport.y,
 })
 }
 }, [onSelectNode, onSelectConnection, viewport])

 // Handle mouse move
 const handleMouseMove = useCallback((e: React.MouseEvent) => {
 if (!dragState) return

 if (dragState.type === 'node' && dragState.nodeId) {
 const dx = (e.clientX - dragState.startX) / viewport.zoom
 const dy = (e.clientY - dragState.startY) / viewport.zoom
 onMoveNode(dragState.nodeId, {
 x: dragState.offsetX + dx,
 y: dragState.offsetY + dy,
 })
 } else if (dragState.type === 'connection' && dragState.sourcePort) {
 const rect = canvasRef.current?.getBoundingClientRect()
 if (!rect) return

 const x = (e.clientX - rect.left - viewport.x) / viewport.zoom
 const y = (e.clientY - rect.top - viewport.y) / viewport.zoom

 setConnectionPreview({
 x1: dragState.sourcePort.x,
 y1: dragState.sourcePort.y,
 x2: x,
 y2: y,
 })
 } else if (dragState.type === 'pan') {
 const dx = e.clientX - dragState.startX
 const dy = e.clientY - dragState.startY
 setViewport(prev => ({
 ...prev,
 x: dragState.offsetX + dx,
 y: dragState.offsetY + dy,
 }))
 }
 }, [dragState, viewport, onMoveNode])

 // Handle mouse up
 const handleMouseUp = useCallback(() => {
 setDragState(null)
 setConnectionPreview(null)
 }, [])

 // Handle wheel for zoom
 const handleWheel = useCallback((e: React.WheelEvent) => {
 e.preventDefault()
 const delta = e.deltaY > 0 ? 0.9 : 1.1
 const newZoom = Math.min(2, Math.max(0.25, viewport.zoom * delta))
 setViewport(prev => ({ ...prev, zoom: newZoom }))
 }, [viewport.zoom])

 // Render connection path
 const renderConnectionPath = (conn: WorkflowConnection) => {
 const sourceNode = nodes.find(n => n.id === conn.sourceNodeId)
 const targetNode = nodes.find(n => n.id === conn.targetNodeId)
 if (!sourceNode || !targetNode) return null

 const sourcePort = sourceNode.outputs.find(p => p.id === conn.sourcePortId)
 const targetPort = targetNode.inputs.find(p => p.id === conn.targetPortId)
 if (!sourcePort || !targetPort) return null

 const start = getPortPosition(sourceNode, sourcePort)
 const end = getPortPosition(targetNode, targetPort)

 const midX = (start.x + end.x) / 2
 const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`

 const isSelected = conn.id === selectedConnectionId

 return (
 <g key={conn.id}>
 {/* Invisible wider path for easier clicking */}
 <path
 d={path}
 fill="none"
 stroke="transparent"
 strokeWidth={20}
 style={{ cursor: 'pointer' }}
 onClick={(e) => {
 e.stopPropagation()
 onSelectConnection(conn.id)
 onSelectNode(null)
 }}
 />
 <path
 d={path}
 fill="none"
 stroke={isSelected ? '#3B82F6' : '#94A3B8'}
 strokeWidth={isSelected ? 3 : 2}
 strokeDasharray={isSelected ? '5,3' : 'none'}
 style={{ cursor: 'pointer', transition: 'all 0.2s' }}
 onClick={(e) => {
 e.stopPropagation()
 onSelectConnection(conn.id)
 onSelectNode(null)
 }}
 />
 {/* Arrow at end */}
 <circle
 cx={end.x - 8}
 cy={end.y}
 r={4}
 fill={isSelected ? '#3B82F6' : '#94A3B8'}
 />
 </g>
 )
 }

 // Render preview connection
 const renderPreviewConnection = () => {
 if (!connectionPreview) return null

 const { x1, y1, x2, y2 } = connectionPreview
 const midX = (x1 + x2) / 2
 const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`

 return (
 <path
 d={path}
 fill="none"
 stroke="#3B82F6"
 strokeWidth={2}
 strokeDasharray="5,5"
 opacity={0.7}
 />
 )
 }

 // Render node
 const renderNode = (node: WorkflowNode) => {
 const isSelected = node.id === selectedNodeId
 const color = nodeTypeColors[node.type]
 const icon = nodeTypeIcons[node.type]

 return (
 <div
 key={node.id}
 className={`absolute select-none transition-shadow ${isSelected ? 'z-10' : ''}`}
 style={{
 left: node.position.x,
 top: node.position.y,
 width: 200,
 }}
 onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
 onDoubleClick={() => onNodeDoubleClick(node.id)}
 >
 <div
 className={`relative bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden ${
 isSelected ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-surface-900' : ''
 }`}
 style={{ borderLeft: `4px solid ${color}` }}
 >
 {/* Header */}
 <div className="px-3 py-2 flex items-center gap-2 border-b border-surface-200 dark:border-surface-700">
 <div
 className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
 style={{ backgroundColor: `${color}20` }}
 >
 <Icon icon={icon} className="w-3.5 h-3.5" style={{ color }} />
 </div>
 <span className="text-sm font-medium text-secondary-900 dark:text-white truncate">
 {node.name}
 </span>
 </div>

 {/* Ports */}
 <div className="py-2">
 {/* Input ports */}
 {node.inputs.map((port) => (
 <div
 key={port.id}
 className="flex items-center px-3 py-0.5 text-xs text-secondary-500 dark:text-secondary-400 relative"
 >
 <div
 className={`absolute -left-2.5 w-4 h-4 rounded-full border-2 border-white dark:border-surface-800 cursor-pointer transition-transform hover:scale-125 ${
 dragState?.type === 'connection' ? 'ring-2 ring-primary-500' : ''
 }`}
 style={{ backgroundColor: '#94A3B8', top: '50%', transform: 'translateY(-50%)' }}
 onMouseUp={() => handlePortMouseUp(node, port)}
 />
 <span className="ml-2">{port.label}</span>
 </div>
 ))}
 
 {/* Output ports */}
 {node.outputs.map((port) => (
 <div
 key={port.id}
 className="flex items-center justify-end px-3 py-0.5 text-xs text-secondary-500 dark:text-secondary-400 relative"
 >
 <span className="mr-2">{port.label}</span>
 <div
 className="absolute -right-2.5 w-4 h-4 rounded-full border-2 border-white dark:border-surface-800 cursor-pointer transition-transform hover:scale-125"
 style={{ backgroundColor: color, top: '50%', transform: 'translateY(-50%)' }}
 onMouseDown={(e) => handlePortMouseDown(e, node, port)}
 />
 </div>
 ))}
 </div>

 {/* Validation indicator */}
 {!node.isValid && (
 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
 <Icon icon="solar:danger-triangle-linear" className="w-3 h-3 text-white" />
 </div>
 )}
 </div>
 </div>
 )
 }

 return (
 <div
 ref={canvasRef}
 className="relative w-full h-full overflow-hidden bg-surface-100 dark:bg-surface-800 cursor-grab active:cursor-grabbing"
 onMouseDown={handleCanvasMouseDown}
 onMouseMove={handleMouseMove}
 onMouseUp={handleMouseUp}
 onMouseLeave={handleMouseUp}
 onWheel={handleWheel}
 >
 {/* Grid background */}
 <div
 className="canvas-grid absolute inset-0"
 style={{
 backgroundImage: `
 radial-gradient(circle, #CBD5E1 1px, transparent 1px)
 `,
 backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
 backgroundPosition: `${viewport.x}px ${viewport.y}px`,
 }}
 />

 {/* Viewport transform container */}
 <div
 className="absolute inset-0"
 style={{
 transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
 transformOrigin: '0 0',
 }}
 >
 {/* Connections SVG layer */}
 <svg
 className="absolute inset-0 pointer-events-none"
 style={{ overflow: 'visible', width: '100%', height: '100%' }}
 >
 <g className="pointer-events-auto">
 {connections.map(renderConnectionPath)}
 {renderPreviewConnection()}
 </g>
 </svg>

 {/* Nodes layer */}
 {nodes.map(renderNode)}
 </div>

 {/* Zoom controls */}
 <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-surface-900 rounded-lg shadow-lg px-3 py-2">
 <button
 onClick={() => setViewport(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
 className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded"
 >
 <Icon icon="solar:add-circle-linear" className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
 </button>
 <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400 min-w-[40px] text-center">
 {Math.round(viewport.zoom * 100)}%
 </span>
 <button
 onClick={() => setViewport(prev => ({ ...prev, zoom: Math.max(0.25, prev.zoom - 0.1) }))}
 className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded"
 >
 <Icon icon="solar:minus-circle-linear" className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
 </button>
 <div className="w-px h-4 bg-surface-200 dark:bg-surface-700" />
 <button
 onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
 className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded"
 title="Reset view"
 >
 <Icon icon="solar:restart-linear" className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
 </button>
 </div>
 </div>
 )
}

export default WorkflowCanvas
