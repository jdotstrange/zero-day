/**
 * Workflow Builder - React Hook
 * State management for workflows with localStorage persistence
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
 Workflow,
 WorkflowNode,
 ExecutionResult,
 ExecutionLogEntry,
 ValidationResult,
 WorkflowNodeType,
} from './types'
import {
 createEmptyWorkflow,
 createNode,
 createConnection,
 validateWorkflow,
 executeWorkflow,
 cloneWorkflow,
 exportWorkflow,
 importWorkflow,
 generateId,
} from './engine'
import { workflowTemplates } from './config'

const STORAGE_KEY = 'zeroday_workflows'

interface UseWorkflowBuilderOptions {
 autoSave?: boolean
 autoValidate?: boolean
}

interface WorkflowBuilderState {
 workflows: Workflow[]
 currentWorkflow: Workflow | null
 selectedNodeId: string | null
 selectedConnectionId: string | null
 validation: ValidationResult | null
 isExecuting: boolean
 executionLogs: ExecutionLogEntry[]
 lastExecutionResult: ExecutionResult | null
 isLoading: boolean
 clipboard: WorkflowNode[] | null
}

export function useWorkflowBuilder(options: UseWorkflowBuilderOptions = {}) {
 const { autoSave = true, autoValidate = true } = options

 const [state, setState] = useState<WorkflowBuilderState>({
 workflows: [],
 currentWorkflow: null,
 selectedNodeId: null,
 selectedConnectionId: null,
 validation: null,
 isExecuting: false,
 executionLogs: [],
 lastExecutionResult: null,
 isLoading: true,
 clipboard: null,
 })

 // Load workflows from localStorage
 useEffect(() => {
 try {
 const stored = localStorage.getItem(STORAGE_KEY)
 if (stored) {
 const parsed = JSON.parse(stored)
 setState(prev => ({
 ...prev,
 workflows: parsed,
 isLoading: false,
 }))
 } else {
 setState(prev => ({ ...prev, isLoading: false }))
 }
 } catch (error) {
 console.error('Failed to load workflows:', error)
 setState(prev => ({ ...prev, isLoading: false }))
 }
 }, [])

 // Save workflows to localStorage
 useEffect(() => {
 if (autoSave && !state.isLoading) {
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state.workflows))
 } catch (error) {
 console.error('Failed to save workflows:', error)
 }
 }
 }, [state.workflows, autoSave, state.isLoading])

 // Auto-validate current workflow
 useEffect(() => {
 if (autoValidate && state.currentWorkflow) {
 const result = validateWorkflow(state.currentWorkflow)
 setState(prev => ({ ...prev, validation: result }))
 }
 }, [state.currentWorkflow, autoValidate])

 // Selected node
 const selectedNode = useMemo(() => {
 if (!state.currentWorkflow || !state.selectedNodeId) return null
 return state.currentWorkflow.nodes.find(n => n.id === state.selectedNodeId) || null
 }, [state.currentWorkflow, state.selectedNodeId])

 // Selected connection
 const selectedConnection = useMemo(() => {
 if (!state.currentWorkflow || !state.selectedConnectionId) return null
 return state.currentWorkflow.connections.find(c => c.id === state.selectedConnectionId) || null
 }, [state.currentWorkflow, state.selectedConnectionId])

 // Create new workflow
 const createWorkflow = useCallback((name?: string) => {
 const workflow = createEmptyWorkflow()
 if (name) workflow.name = name

 setState(prev => ({
 ...prev,
 workflows: [...prev.workflows, workflow],
 currentWorkflow: workflow,
 selectedNodeId: null,
 selectedConnectionId: null,
 validation: null,
 executionLogs: [],
 }))

 return workflow
 }, [])

 // Create from template
 const createFromTemplate = useCallback((templateId: string) => {
 const template = workflowTemplates.find(t => t.id === templateId)
 if (!template) return null

 const workflow: Workflow = {
 ...template.workflow,
 id: generateId(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 runCount: 0,
 }

 setState(prev => ({
 ...prev,
 workflows: [...prev.workflows, workflow],
 currentWorkflow: workflow,
 selectedNodeId: null,
 selectedConnectionId: null,
 executionLogs: [],
 }))

 return workflow
 }, [])

 // Open workflow
 const openWorkflow = useCallback((id: string) => {
 const workflow = state.workflows.find(w => w.id === id)
 if (workflow) {
 setState(prev => ({
 ...prev,
 currentWorkflow: workflow,
 selectedNodeId: null,
 selectedConnectionId: null,
 validation: null,
 executionLogs: [],
 lastExecutionResult: null,
 }))
 }
 }, [state.workflows])

 // Update current workflow
 const updateWorkflow = useCallback((updates: Partial<Workflow>) => {
 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated: Workflow = {
 ...prev.currentWorkflow,
 ...updates,
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 }
 })
 }, [])

 // Delete workflow
 const deleteWorkflow = useCallback((id: string) => {
 setState(prev => ({
 ...prev,
 workflows: prev.workflows.filter(w => w.id !== id),
 currentWorkflow: prev.currentWorkflow?.id === id ? null : prev.currentWorkflow,
 }))
 }, [])

 // Duplicate workflow
 const duplicateWorkflow = useCallback((id: string) => {
 const workflow = state.workflows.find(w => w.id === id)
 if (!workflow) return null

 const cloned = cloneWorkflow(workflow)
 setState(prev => ({
 ...prev,
 workflows: [...prev.workflows, cloned],
 }))

 return cloned
 }, [state.workflows])

 // Add node
 const addNode = useCallback((
 type: WorkflowNodeType,
 position: { x: number; y: number },
 name?: string
 ) => {
 const node = createNode(type, position, name)

 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 nodes: [...prev.currentWorkflow.nodes, node],
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 selectedNodeId: node.id,
 }
 })

 return node
 }, [])

 // Update node
 const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 nodes: prev.currentWorkflow.nodes.map(n =>
 n.id === nodeId ? { ...n, ...updates } : n
 ),
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 }
 })
 }, [])

 // Delete node
 const deleteNode = useCallback((nodeId: string) => {
 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 nodes: prev.currentWorkflow.nodes.filter(n => n.id !== nodeId),
 connections: prev.currentWorkflow.connections.filter(
 c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
 ),
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
 }
 })
 }, [])

 // Move node
 const moveNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
 updateNode(nodeId, { position })
 }, [updateNode])

 // Add connection
 const addConnection = useCallback((
 sourceNodeId: string,
 sourcePortId: string,
 targetNodeId: string,
 targetPortId: string
 ) => {
 // Prevent self-connections
 if (sourceNodeId === targetNodeId) return null

 const connection = createConnection(sourceNodeId, sourcePortId, targetNodeId, targetPortId)

 setState(prev => {
 if (!prev.currentWorkflow) return prev

 // Check for duplicate connections
 const exists = prev.currentWorkflow.connections.some(
 c => c.sourceNodeId === sourceNodeId &&
 c.sourcePortId === sourcePortId &&
 c.targetNodeId === targetNodeId &&
 c.targetPortId === targetPortId
 )
 if (exists) return prev

 const updated = {
 ...prev.currentWorkflow,
 connections: [...prev.currentWorkflow.connections, connection],
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 }
 })

 return connection
 }, [])

 // Delete connection
 const deleteConnection = useCallback((connectionId: string) => {
 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 connections: prev.currentWorkflow.connections.filter(c => c.id !== connectionId),
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 selectedConnectionId: prev.selectedConnectionId === connectionId ? null : prev.selectedConnectionId,
 }
 })
 }, [])

 // Select node
 const selectNode = useCallback((nodeId: string | null) => {
 setState(prev => ({
 ...prev,
 selectedNodeId: nodeId,
 selectedConnectionId: null,
 }))
 }, [])

 // Select connection
 const selectConnection = useCallback((connectionId: string | null) => {
 setState(prev => ({
 ...prev,
 selectedConnectionId: connectionId,
 selectedNodeId: null,
 }))
 }, [])

 // Clear selection
 const clearSelection = useCallback(() => {
 setState(prev => ({
 ...prev,
 selectedNodeId: null,
 selectedConnectionId: null,
 }))
 }, [])

 // Copy nodes
 const copyNodes = useCallback((nodeIds: string[]) => {
 if (!state.currentWorkflow) return

 const nodes = state.currentWorkflow.nodes.filter(n => nodeIds.includes(n.id))
 setState(prev => ({ ...prev, clipboard: nodes }))
 }, [state.currentWorkflow])

 // Paste nodes
 const pasteNodes = useCallback((offset: { x: number; y: number } = { x: 50, y: 50 }) => {
 if (!state.clipboard || state.clipboard.length === 0) return []

 const newNodes = state.clipboard.map(node => ({
 ...node,
 id: generateId(),
 position: {
 x: node.position.x + offset.x,
 y: node.position.y + offset.y,
 },
 inputs: node.inputs.map(p => ({ ...p, id: generateId() })),
 outputs: node.outputs.map(p => ({ ...p, id: generateId() })),
 }))

 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 nodes: [...prev.currentWorkflow.nodes, ...newNodes],
 updatedAt: new Date().toISOString(),
 }

 return {
 ...prev,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 }
 })

 return newNodes
 }, [state.clipboard])

 // Execute workflow
 const execute = useCallback(async (initialData: Record<string, unknown> = {}) => {
 if (!state.currentWorkflow) return null

 setState(prev => ({
 ...prev,
 isExecuting: true,
 executionLogs: [],
 }))

 try {
 const result = await executeWorkflow(
 state.currentWorkflow,
 initialData,
 (entry) => {
 setState(prev => ({
 ...prev,
 executionLogs: [...prev.executionLogs, entry],
 }))
 }
 )

 // Update run count
 setState(prev => {
 if (!prev.currentWorkflow) return prev

 const updated = {
 ...prev.currentWorkflow,
 runCount: prev.currentWorkflow.runCount + 1,
 lastRun: new Date().toISOString(),
 }

 return {
 ...prev,
 isExecuting: false,
 lastExecutionResult: result,
 currentWorkflow: updated,
 workflows: prev.workflows.map(w => w.id === updated.id ? updated : w),
 }
 })

 return result
 } catch (error) {
 setState(prev => ({
 ...prev,
 isExecuting: false,
 }))
 throw error
 }
 }, [state.currentWorkflow])

 // Validate workflow
 const validate = useCallback(() => {
 if (!state.currentWorkflow) return null

 const result = validateWorkflow(state.currentWorkflow)
 setState(prev => ({ ...prev, validation: result }))
 return result
 }, [state.currentWorkflow])

 // Export current workflow
 const exportCurrent = useCallback(() => {
 if (!state.currentWorkflow) return null
 return exportWorkflow(state.currentWorkflow)
 }, [state.currentWorkflow])

 // Import workflow
 const importFromJson = useCallback((json: string) => {
 const workflow = importWorkflow(json)
 if (!workflow) return null

 setState(prev => ({
 ...prev,
 workflows: [...prev.workflows, workflow],
 currentWorkflow: workflow,
 }))

 return workflow
 }, [])

 // Clear execution logs
 const clearLogs = useCallback(() => {
 setState(prev => ({
 ...prev,
 executionLogs: [],
 lastExecutionResult: null,
 }))
 }, [])

 return {
 // State
 workflows: state.workflows,
 currentWorkflow: state.currentWorkflow,
 selectedNodeId: state.selectedNodeId,
 selectedConnectionId: state.selectedConnectionId,
 selectedNode,
 selectedConnection,
 validation: state.validation,
 isExecuting: state.isExecuting,
 executionLogs: state.executionLogs,
 lastExecutionResult: state.lastExecutionResult,
 isLoading: state.isLoading,
 clipboard: state.clipboard,

 // Workflow actions
 createWorkflow,
 createFromTemplate,
 openWorkflow,
 updateWorkflow,
 deleteWorkflow,
 duplicateWorkflow,
 exportCurrent,
 importFromJson,

 // Node actions
 addNode,
 updateNode,
 deleteNode,
 moveNode,

 // Connection actions
 addConnection,
 deleteConnection,

 // Selection
 selectNode,
 selectConnection,
 clearSelection,

 // Clipboard
 copyNodes,
 pasteNodes,

 // Execution
 execute,
 validate,
 clearLogs,

 // Templates
 templates: workflowTemplates,
 }
}
