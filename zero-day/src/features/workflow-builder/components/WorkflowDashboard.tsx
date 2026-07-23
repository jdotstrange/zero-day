/**
 * Workflow Builder Dashboard Component
 * Main interface combining all workflow builder components
 */

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/common'
import { useWorkflowBuilder } from '../useWorkflowBuilder'
import { WorkflowCanvas } from './WorkflowCanvas'
import { NodePalette } from './NodePalette'
import { ExecutionPanel } from './ExecutionPanel'
import type { WorkflowNodeType } from '../types'

export function WorkflowDashboard() {
 const {
 workflows,
 currentWorkflow,
 selectedNodeId,
 selectedConnectionId,
 selectedNode,
 validation,
 isExecuting,
 executionLogs,
 lastExecutionResult,
 createWorkflow,
 createFromTemplate,
 openWorkflow,
 updateWorkflow,
 addNode,
 updateNode,
 deleteNode,
 moveNode,
 addConnection,
 deleteConnection,
 selectNode,
 selectConnection,
 execute,
 validate,
 clearLogs,
 templates,
 } = useWorkflowBuilder()

 const [showPalette, setShowPalette] = useState(true)
 const [showExecution, setShowExecution] = useState(false)
 const [showWorkflowList, setShowWorkflowList] = useState(false)
 const [showTemplates, setShowTemplates] = useState(false)
 const [editingNodeId, setEditingNodeId] = useState<string | null>(null)

 // Handle adding node from palette
 const handleAddNode = useCallback((type: WorkflowNodeType, name?: string) => {
 if (!currentWorkflow) {
 createWorkflow()
 }
 // Add node at center of canvas
 addNode(type, { x: 300, y: 200 }, name)
 }, [currentWorkflow, createWorkflow, addNode])

 // Handle running workflow
 const handleRun = useCallback(async () => {
 setShowExecution(true)
 await execute({ sampleData: 'test', timestamp: Date.now() })
 }, [execute])

 // Handle node double click (edit)
 const handleNodeDoubleClick = useCallback((nodeId: string) => {
 setEditingNodeId(nodeId)
 }, [])

 // Close node editor
 const handleCloseEditor = useCallback(() => {
 setEditingNodeId(null)
 }, [])

 return (
 <div className="card flex h-[calc(100vh-180px)] flex-col overflow-hidden">
 {/* Toolbar */}
 <div className="px-4 py-3 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <div className="flex items-center gap-4">
 {/* Workflow selector */}
 <div className="relative">
 <button
 onClick={() => setShowWorkflowList(!showWorkflowList)}
 className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
 >
 <Icon icon="solar:document-linear" className="w-4 h-4 text-secondary-500" />
 <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 max-w-[150px] truncate">
 {currentWorkflow?.name || 'Select Workflow'}
 </span>
 <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-secondary-400" />
 </button>

 {showWorkflowList && (
 <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-50">
 <div className="p-2 border-b border-surface-200 dark:border-surface-700">
 <button
 onClick={() => {
 createWorkflow()
 setShowWorkflowList(false)
 }}
 className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
 >
 <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
 New Workflow
 </button>
 <button
 onClick={() => {
 setShowTemplates(true)
 setShowWorkflowList(false)
 }}
 className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg"
 >
 <Icon icon="solar:bookmark-linear" className="w-4 h-4" />
 From Template
 </button>
 </div>
 <div className="max-h-64 overflow-y-auto p-2">
 {workflows.length === 0 ? (
 <p className="text-center text-sm text-secondary-400 py-4">No workflows yet</p>
 ) : (
 workflows.map(workflow => (
 <button
 key={workflow.id}
 onClick={() => {
 openWorkflow(workflow.id)
 setShowWorkflowList(false)
 }}
 className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
 currentWorkflow?.id === workflow.id
 ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
 : 'text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800'
 }`}
 >
 <div className="flex items-center gap-2 min-w-0">
 <Icon icon="solar:document-linear" className="w-4 h-4 shrink-0" />
 <span className="truncate">{workflow.name}</span>
 </div>
 <span className={`px-1.5 py-0.5 text-xs rounded ${
 workflow.status === 'active' ? 'bg-green-100 text-green-600' :
 workflow.status === 'draft' ? 'bg-surface-100 text-secondary-600' :
 'bg-yellow-100 text-yellow-600'
 }`}>
 {workflow.status}
 </span>
 </button>
 ))
 )}
 </div>
 </div>
 )}
 </div>

 {/* Workflow name editor */}
 {currentWorkflow && (
 <input
 type="text"
 value={currentWorkflow.name}
 onChange={(e) => updateWorkflow({ name: e.target.value })}
 className="px-2 py-1 text-sm font-medium bg-transparent border-b border-transparent hover:border-surface-300 focus:border-primary-500 dark:hover:border-surface-600 dark:focus:border-primary-500 text-secondary-900 dark:text-white focus:outline-none transition-colors"
 />
 )}
 </div>

 <div className="flex items-center gap-2">
 {/* Validation status */}
 {validation && (
 <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
 validation.isValid
 ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
 : 'bg-red-100 dark:bg-red-900/20 text-red-600'
 }`}>
 <Icon
 icon={validation.isValid ? 'solar:check-circle-linear' : 'solar:danger-triangle-linear'}
 className="w-4 h-4"
 />
 <span className="text-xs font-medium">
 {validation.isValid ? 'Valid' : `${validation.errors.length} errors`}
 </span>
 </div>
 )}

 {/* Toggle buttons */}
 <button
 onClick={() => setShowPalette(!showPalette)}
 className={`p-2 rounded-lg transition-colors ${
 showPalette
 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
 : 'text-secondary-500 hover:bg-surface-100 dark:hover:bg-surface-800'
 }`}
 title="Toggle palette"
 >
 <Icon icon="solar:widget-linear" className="w-5 h-5" />
 </button>

 <button
 onClick={() => setShowExecution(!showExecution)}
 className={`p-2 rounded-lg transition-colors ${
 showExecution
 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
 : 'text-secondary-500 hover:bg-surface-100 dark:hover:bg-surface-800'
 }`}
 title="Toggle execution panel"
 >
 <Icon icon="solar:play-circle-linear" className="w-5 h-5" />
 </button>

 <div className="w-px h-6 bg-surface-200 dark:bg-surface-700" />

 {/* Action buttons */}
 <button
 onClick={() => validate()}
 className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
 >
 <Icon icon="solar:check-square-linear" className="w-4 h-4" />
 Validate
 </button>

 <button
 onClick={handleRun}
 disabled={!currentWorkflow || isExecuting || !validation?.isValid}
 className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white text-sm font-semibold rounded-lg transition-colors"
 >
 {isExecuting ? (
 <>
 <Icon icon="solar:refresh-linear" className="w-4 h-4 animate-spin" />
 Running...
 </>
 ) : (
 <>
 <Icon icon="solar:play-linear" className="w-4 h-4" />
 Run
 </>
 )}
 </button>
 </div>
 </div>

 {/* Main content */}
 <div className="flex-1 flex overflow-hidden">
 {/* Node palette */}
 {showPalette && (
 <div className="w-64 shrink-0">
 <NodePalette onAddNode={handleAddNode} />
 </div>
 )}

 {/* Canvas */}
 <div className="flex-1 relative">
 {currentWorkflow ? (
 <WorkflowCanvas
 nodes={currentWorkflow.nodes}
 connections={currentWorkflow.connections}
 selectedNodeId={selectedNodeId}
 selectedConnectionId={selectedConnectionId}
 onSelectNode={selectNode}
 onSelectConnection={selectConnection}
 onMoveNode={moveNode}
 onAddConnection={addConnection}
 onDeleteNode={deleteNode}
 onDeleteConnection={deleteConnection}
 onNodeDoubleClick={handleNodeDoubleClick}
 />
 ) : (
 <div className="flex items-center justify-center h-full bg-surface-100 dark:bg-surface-800">
 <div className="text-center">
 <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
 <Icon icon="solar:branching-paths-up-linear" className="w-8 h-8 text-primary-500" />
 </div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
 No Workflow Selected
 </h3>
 <p className="text-sm text-secondary-500 mb-4">
 Create a new workflow or select an existing one to get started.
 </p>
 <div className="flex items-center justify-center gap-2">
 <button
 onClick={() => createWorkflow()}
 className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
 >
 <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
 New Workflow
 </button>
 <button
 onClick={() => setShowTemplates(true)}
 className="flex items-center gap-2 px-4 py-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-secondary-700 dark:text-secondary-300 text-sm font-medium rounded-lg transition-colors"
 >
 <Icon icon="solar:bookmark-linear" className="w-4 h-4" />
 From Template
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Selected node info */}
 {selectedNode && !editingNodeId && (
 <div className="absolute bottom-4 left-4 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 p-3 max-w-xs">
 <div className="flex items-start justify-between gap-2 mb-2">
 <h4 className="text-sm font-semibold text-secondary-900 dark:text-white">
 {selectedNode.name}
 </h4>
 <button
 onClick={() => setEditingNodeId(selectedNode.id)}
 className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
 >
 <Icon icon="solar:pen-linear" className="w-4 h-4" />
 </button>
 </div>
 <p className="text-xs text-secondary-500 capitalize mb-2">
 Type: {selectedNode.type}
 </p>
 {selectedNode.description && (
 <p className="text-xs text-secondary-400">{selectedNode.description}</p>
 )}
 <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-200 dark:border-surface-700">
 <button
 onClick={() => deleteNode(selectedNode.id)}
 className="text-xs text-red-500 hover:text-red-600"
 >
 Delete
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Execution panel */}
 {showExecution && (
 <div className="w-80 shrink-0">
 <ExecutionPanel
 isExecuting={isExecuting}
 logs={executionLogs}
 result={lastExecutionResult}
 onClearLogs={clearLogs}
 onClose={() => setShowExecution(false)}
 />
 </div>
 )}
 </div>

 {/* Templates modal */}
 {showTemplates &&
 createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={() => setShowTemplates(false)}
 />
 <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fade-in">
 <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
 Workflow Templates
 </h3>
 <button
 onClick={() => setShowTemplates(false)}
 className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
 </button>
 </div>
 
 <div className="p-6 max-h-96 overflow-y-auto">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {templates.map(template => (
 <button
 key={template.id}
 onClick={() => {
 createFromTemplate(template.id)
 setShowTemplates(false)
 }}
 className="flex items-start gap-3 p-4 text-left rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all group"
 >
 <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
 <Icon icon={template.icon} className="w-6 h-6 text-primary-500" />
 </div>
 <div>
 <h4 className="font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
 {template.name}
 </h4>
 <p className="text-xs text-secondary-500 mt-0.5">
 {template.description}
 </p>
 <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-surface-100 dark:bg-surface-800 text-secondary-500 rounded">
 {template.category}
 </span>
 </div>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>,
 document.body
 )}

 {/* Node editor modal */}
 {editingNodeId && selectedNode &&
 createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={handleCloseEditor}
 />
 <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
 <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
 Edit Node
 </h3>
 <button
 onClick={handleCloseEditor}
 className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
 </button>
 </div>
 
 <div className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Node Name
 </label>
 <input
 type="text"
 value={selectedNode.name}
 onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
 />
 </div>
 
 <div>
 <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
 Description
 </label>
 <textarea
 value={selectedNode.description || ''}
 onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
 rows={3}
 className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
 placeholder="Add a description..."
 />
 </div>

 <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
 <p className="text-xs text-secondary-500 mb-1">Node Type</p>
 <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 capitalize">
 {selectedNode.type}
 </p>
 </div>
 </div>

 <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
 <button
 onClick={handleCloseEditor}
 className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
 >
 Close
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 )
}

export default WorkflowDashboard
