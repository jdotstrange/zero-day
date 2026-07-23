/**
 * Workflow Builder - Core Engine
 * Workflow execution, validation, and utilities
 */

import type {
 Workflow,
 WorkflowNode,
 WorkflowConnection,
 NodeConfig,
 ExecutionContext,
 ExecutionLogEntry,
 ExecutionResult,
 ValidationResult,
 ValidationError,
 ValidationWarning,
 NodePort,
 WorkflowNodeType,
 TriggerConfig,
 ConditionConfig,
 FilterConfig,
 TransformConfig,
 ActionConfig,
 DelayConfig,
} from './types'

/**
 * Generate unique ID
 */
export function generateId(): string {
 return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Create empty workflow
 */
export function createEmptyWorkflow(): Workflow {
 return {
 id: generateId(),
 name: 'New Workflow',
 description: '',
 version: 1,
 status: 'draft',
 nodes: [],
 connections: [],
 variables: [],
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 runCount: 0,
 tags: [],
 }
}

/**
 * Create a new node with default configuration
 */
export function createNode(
 type: WorkflowNodeType,
 position: { x: number; y: number },
 name?: string
): WorkflowNode {
 const nodeDefaults = getNodeDefaults(type)
 
 return {
 id: generateId(),
 type,
 name: name || nodeDefaults.label,
 description: '',
 position,
 config: nodeDefaults.config,
 inputs: nodeDefaults.inputs.map(p => ({ ...p, id: generateId() })),
 outputs: nodeDefaults.outputs.map(p => ({ ...p, id: generateId() })),
 isValid: true,
 validationErrors: [],
 }
}

/**
 * Get default configuration for node types
 */
function getNodeDefaults(type: WorkflowNodeType): {
 label: string
 config: NodeConfig
 inputs: NodePort[]
 outputs: NodePort[]
} {
 switch (type) {
 case 'trigger':
 return {
 label: 'Trigger',
 config: { type: 'trigger', triggerType: 'manual' } as TriggerConfig,
 inputs: [],
 outputs: [{ id: '', type: 'output', label: 'Start', dataType: 'any' }],
 }
 case 'condition':
 return {
 label: 'Condition',
 config: { type: 'condition', field: '', operator: 'equals', value: '' } as ConditionConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [
 { id: '', type: 'output', label: 'True', dataType: 'any' },
 { id: '', type: 'output', label: 'False', dataType: 'any' },
 ],
 }
 case 'filter':
 return {
 label: 'Filter',
 config: { type: 'filter', conditions: [], logic: 'AND' } as FilterConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'array' }],
 outputs: [{ id: '', type: 'output', label: 'Filtered', dataType: 'array' }],
 }
 case 'transform':
 return {
 label: 'Transform',
 config: { type: 'transform', operation: 'map', expression: '' } as TransformConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [{ id: '', type: 'output', label: 'Output', dataType: 'any' }],
 }
 case 'action':
 return {
 label: 'Action',
 config: { type: 'action', actionType: 'log_message', params: {} } as ActionConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [{ id: '', type: 'output', label: 'Done', dataType: 'any' }],
 }
 case 'delay':
 return {
 label: 'Delay',
 config: { type: 'delay', duration: 1, unit: 'seconds' } as DelayConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [{ id: '', type: 'output', label: 'Continue', dataType: 'any' }],
 }
 case 'loop':
 return {
 label: 'Loop',
 config: { type: 'loop', iterateOver: '', itemVariable: 'item' },
 inputs: [{ id: '', type: 'input', label: 'Array', dataType: 'array' }],
 outputs: [
 { id: '', type: 'output', label: 'Item', dataType: 'any' },
 { id: '', type: 'output', label: 'Done', dataType: 'array' },
 ],
 }
 case 'merge':
 return {
 label: 'Merge',
 config: { type: 'merge', strategy: 'wait_all' },
 inputs: [
 { id: '', type: 'input', label: 'Input 1', dataType: 'any' },
 { id: '', type: 'input', label: 'Input 2', dataType: 'any' },
 ],
 outputs: [{ id: '', type: 'output', label: 'Merged', dataType: 'array' }],
 }
 case 'split':
 return {
 label: 'Split',
 config: { type: 'split', splitBy: 'condition', branches: [] },
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [
 { id: '', type: 'output', label: 'Branch A', dataType: 'any' },
 { id: '', type: 'output', label: 'Branch B', dataType: 'any' },
 ],
 }
 default:
 return {
 label: 'Node',
 config: { type: 'action', actionType: 'log_message', params: {} } as ActionConfig,
 inputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [{ id: '', type: 'output', label: 'Output', dataType: 'any' }],
 }
 }
}

/**
 * Create a connection between two nodes
 */
export function createConnection(
 sourceNodeId: string,
 sourcePortId: string,
 targetNodeId: string,
 targetPortId: string
): WorkflowConnection {
 return {
 id: generateId(),
 sourceNodeId,
 sourcePortId,
 targetNodeId,
 targetPortId,
 }
}

/**
 * Validate workflow structure
 */
export function validateWorkflow(workflow: Workflow): ValidationResult {
 const errors: ValidationError[] = []
 const warnings: ValidationWarning[] = []

 // Check for at least one trigger node
 const triggerNodes = workflow.nodes.filter(n => n.type === 'trigger')
 if (triggerNodes.length === 0) {
 errors.push({
 code: 'NO_TRIGGER',
 message: 'Workflow must have at least one trigger node',
 })
 }

 // Check for multiple triggers (warning)
 if (triggerNodes.length > 1) {
 warnings.push({
 code: 'MULTIPLE_TRIGGERS',
 message: 'Workflow has multiple trigger nodes. Only one will be used.',
 })
 }

 // Check for disconnected nodes
 workflow.nodes.forEach(node => {
 if (node.type === 'trigger') return // Triggers don't need inputs

 const hasInput = workflow.connections.some(c => c.targetNodeId === node.id)
 if (!hasInput) {
 warnings.push({
 nodeId: node.id,
 code: 'DISCONNECTED_NODE',
 message: `Node "${node.name}" has no incoming connections`,
 })
 }
 })

 // Check for cycles
 const cycles = detectCycles(workflow)
 if (cycles.length > 0) {
 errors.push({
 code: 'CYCLE_DETECTED',
 message: `Workflow contains circular references: ${cycles.join(' → ')}`,
 })
 }

 // Validate individual nodes
 workflow.nodes.forEach(node => {
 const nodeErrors = validateNode(node)
 errors.push(...nodeErrors.map(e => ({ ...e, nodeId: node.id })))
 })

 // Check for dead ends (nodes with no outputs connected)
 workflow.nodes.forEach(node => {
 if (node.outputs.length === 0) return

 const hasOutput = workflow.connections.some(c => c.sourceNodeId === node.id)
 if (!hasOutput && node.type !== 'action') {
 warnings.push({
 nodeId: node.id,
 code: 'DEAD_END',
 message: `Node "${node.name}" has no outgoing connections`,
 })
 }
 })

 return {
 isValid: errors.length === 0,
 errors,
 warnings,
 }
}

/**
 * Validate individual node
 */
function validateNode(node: WorkflowNode): ValidationError[] {
 const errors: ValidationError[] = []

 if (!node.name.trim()) {
 errors.push({
 code: 'EMPTY_NAME',
 message: 'Node name is required',
 })
 }

 // Type-specific validation
 switch (node.config.type) {
 case 'condition':
 if (!node.config.field) {
 errors.push({
 code: 'MISSING_FIELD',
 message: 'Condition field is required',
 })
 }
 break
 case 'action':
 if (!node.config.actionType) {
 errors.push({
 code: 'MISSING_ACTION_TYPE',
 message: 'Action type is required',
 })
 }
 break
 case 'delay':
 if (node.config.duration <= 0) {
 errors.push({
 code: 'INVALID_DURATION',
 message: 'Delay duration must be positive',
 })
 }
 break
 }

 return errors
}

/**
 * Detect cycles in workflow graph using DFS
 */
function detectCycles(workflow: Workflow): string[] {
 const visited = new Set<string>()
 const recursionStack = new Set<string>()
 const cycles: string[] = []

 function dfs(nodeId: string, path: string[]): boolean {
 visited.add(nodeId)
 recursionStack.add(nodeId)

 const outgoingConnections = workflow.connections.filter(c => c.sourceNodeId === nodeId)
 
 for (const conn of outgoingConnections) {
 const targetId = conn.targetNodeId
 
 if (!visited.has(targetId)) {
 if (dfs(targetId, [...path, targetId])) {
 return true
 }
 } else if (recursionStack.has(targetId)) {
 const node = workflow.nodes.find(n => n.id === targetId)
 cycles.push(node?.name || targetId)
 return true
 }
 }

 recursionStack.delete(nodeId)
 return false
 }

 // Start from trigger nodes
 const triggers = workflow.nodes.filter(n => n.type === 'trigger')
 for (const trigger of triggers) {
 if (!visited.has(trigger.id)) {
 dfs(trigger.id, [trigger.name])
 }
 }

 return cycles
}

/**
 * Get execution order (topological sort)
 */
export function getExecutionOrder(workflow: Workflow): string[] {
 const inDegree = new Map<string, number>()
 const adjacencyList = new Map<string, string[]>()

 // Initialize
 workflow.nodes.forEach(node => {
 inDegree.set(node.id, 0)
 adjacencyList.set(node.id, [])
 })

 // Build graph
 workflow.connections.forEach(conn => {
 const targets = adjacencyList.get(conn.sourceNodeId) || []
 targets.push(conn.targetNodeId)
 adjacencyList.set(conn.sourceNodeId, targets)

 inDegree.set(conn.targetNodeId, (inDegree.get(conn.targetNodeId) || 0) + 1)
 })

 // Find nodes with no incoming edges (triggers)
 const queue: string[] = []
 workflow.nodes.forEach(node => {
 if (inDegree.get(node.id) === 0) {
 queue.push(node.id)
 }
 })

 const order: string[] = []
 while (queue.length > 0) {
 const nodeId = queue.shift()!
 order.push(nodeId)

 const neighbors = adjacencyList.get(nodeId) || []
 for (const neighbor of neighbors) {
 const newDegree = (inDegree.get(neighbor) || 0) - 1
 inDegree.set(neighbor, newDegree)
 if (newDegree === 0) {
 queue.push(neighbor)
 }
 }
 }

 return order
}

/**
 * Execute workflow (simulation)
 */
export async function executeWorkflow(
 workflow: Workflow,
 initialData: Record<string, unknown> = {},
 onLogEntry?: (entry: ExecutionLogEntry) => void
): Promise<ExecutionResult> {
 const executionId = generateId()
 const startedAt = new Date().toISOString()
 const logs: ExecutionLogEntry[] = []

 const context: ExecutionContext = {
 workflowId: workflow.id,
 executionId,
 variables: {},
 data: initialData,
 currentNodeId: '',
 path: [],
 startedAt,
 }

 // Initialize variables
 workflow.variables.forEach(v => {
 context.variables[v.name] = v.defaultValue
 })

 try {
 const order = getExecutionOrder(workflow)
 
 for (const nodeId of order) {
 const node = workflow.nodes.find(n => n.id === nodeId)
 if (!node) continue

 context.currentNodeId = nodeId
 context.path.push(nodeId)

 const logEntry: ExecutionLogEntry = {
 id: generateId(),
 executionId,
 nodeId,
 nodeName: node.name,
 nodeType: node.type,
 status: 'running',
 startedAt: new Date().toISOString(),
 input: { ...context.data },
 }

 onLogEntry?.(logEntry)

 try {
 const output = await executeNode(node, context)
 context.data = { ...context.data, ...output }

 logEntry.status = 'success'
 logEntry.completedAt = new Date().toISOString()
 logEntry.duration = Date.now() - new Date(logEntry.startedAt).getTime()
 logEntry.output = output

 logs.push(logEntry)
 onLogEntry?.(logEntry)
 } catch (error) {
 logEntry.status = 'failed'
 logEntry.completedAt = new Date().toISOString()
 logEntry.duration = Date.now() - new Date(logEntry.startedAt).getTime()
 logEntry.error = error instanceof Error ? error.message : 'Unknown error'

 logs.push(logEntry)
 onLogEntry?.(logEntry)

 throw error
 }
 }

 const completedAt = new Date().toISOString()
 return {
 executionId,
 workflowId: workflow.id,
 status: 'success',
 startedAt,
 completedAt,
 duration: Date.now() - new Date(startedAt).getTime(),
 nodesExecuted: logs.length,
 logs,
 output: context.data,
 }
 } catch (error) {
 const completedAt = new Date().toISOString()
 return {
 executionId,
 workflowId: workflow.id,
 status: 'failed',
 startedAt,
 completedAt,
 duration: Date.now() - new Date(startedAt).getTime(),
 nodesExecuted: logs.length,
 logs,
 output: context.data,
 error: error instanceof Error ? error.message : 'Unknown error',
 }
 }
}

/**
 * Execute a single node
 */
async function executeNode(
 node: WorkflowNode,
 context: ExecutionContext
): Promise<Record<string, unknown>> {
 // Simulate processing delay
 await sleep(50 + Math.random() * 100)

 switch (node.config.type) {
 case 'trigger':
 return { _triggered: true, _timestamp: new Date().toISOString() }

 case 'condition': {
 const config = node.config
 const fieldValue = getNestedValue(context.data, config.field)
 const result = evaluateCondition(fieldValue, config.operator, config.value)
 return { _conditionResult: result, _branch: result ? 'true' : 'false' }
 }

 case 'filter': {
 const config = node.config
 const inputArray = Array.isArray(context.data) ? context.data : [context.data]
 const filtered = inputArray.filter(item => {
 return config.conditions.every(cond => {
 const value = getNestedValue(item as Record<string, unknown>, cond.field)
 return evaluateCondition(value, cond.operator, cond.value)
 })
 })
 return { _filtered: filtered, _count: filtered.length }
 }

 case 'transform': {
 const config = node.config
 switch (config.operation) {
 case 'map':
 return { _transformed: context.data }
 case 'extract':
 if (config.sourceField) {
 return { [config.targetField || 'extracted']: getNestedValue(context.data, config.sourceField) }
 }
 return context.data as Record<string, unknown>
 default:
 return { _transformed: context.data }
 }
 }

 case 'action': {
 const config = node.config
 switch (config.actionType) {
 case 'log_message':
 console.log('[Workflow Action]', config.params.message || 'No message')
 return { _logged: true }
 case 'set_variable':
 return { [config.params.name as string]: config.params.value }
 case 'send_notification':
 return { _notificationSent: true, _message: config.params.message }
 default:
 return { _actionExecuted: config.actionType }
 }
 }

 case 'delay': {
 const config = node.config
 const ms = config.duration * getTimeMultiplier(config.unit)
 // Cap delay at 2 seconds for simulation
 await sleep(Math.min(ms, 2000))
 return { _delayed: true, _duration: ms }
 }

 case 'loop': {
 const config = node.config
 const items = getNestedValue(context.data, config.iterateOver)
 if (Array.isArray(items)) {
 return { _loopItems: items, _itemCount: items.length }
 }
 return { _loopItems: [], _itemCount: 0 }
 }

 case 'merge':
 return { _merged: true, ...context.data }

 case 'split':
 return { _split: true, ...context.data }

 default:
 return {}
 }
}

/**
 * Evaluate a condition
 */
function evaluateCondition(
 actual: unknown,
 operator: string,
 expected: unknown
): boolean {
 switch (operator) {
 case 'equals':
 return String(actual).toLowerCase() === String(expected).toLowerCase()
 case 'not_equals':
 return String(actual).toLowerCase() !== String(expected).toLowerCase()
 case 'greater_than':
 return Number(actual) > Number(expected)
 case 'less_than':
 return Number(actual) < Number(expected)
 case 'contains':
 return String(actual).toLowerCase().includes(String(expected).toLowerCase())
 case 'is_empty':
 return actual === null || actual === undefined || actual === ''
 case 'is_not_empty':
 return actual !== null && actual !== undefined && actual !== ''
 default:
 return false
 }
}

/**
 * Get nested value from object
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
 return path.split('.').reduce((acc: unknown, key) => {
 if (acc && typeof acc === 'object' && key in acc) {
 return (acc as Record<string, unknown>)[key]
 }
 return undefined
 }, obj)
}

/**
 * Get time multiplier for delay units
 */
function getTimeMultiplier(unit: string): number {
 switch (unit) {
 case 'seconds': return 1000
 case 'minutes': return 60 * 1000
 case 'hours': return 60 * 60 * 1000
 case 'days': return 24 * 60 * 60 * 1000
 default: return 1000
 }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
 return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Clone workflow
 */
export function cloneWorkflow(workflow: Workflow): Workflow {
 return {
 ...JSON.parse(JSON.stringify(workflow)),
 id: generateId(),
 name: `${workflow.name} (Copy)`,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 runCount: 0,
 }
}

/**
 * Export workflow to JSON
 */
export function exportWorkflow(workflow: Workflow): string {
 return JSON.stringify(workflow, null, 2)
}

/**
 * Import workflow from JSON
 */
export function importWorkflow(json: string): Workflow | null {
 try {
 const workflow = JSON.parse(json)
 return {
 ...workflow,
 id: generateId(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 }
 } catch {
 return null
 }
}
