/**
 * Workflow Builder Types
 * Defines node-based workflow structures, connections, and execution
 */

// Node types available in the workflow
export type WorkflowNodeType =
 | 'trigger'
 | 'condition'
 | 'filter'
 | 'transform'
 | 'action'
 | 'delay'
 | 'loop'
 | 'merge'
 | 'split'

// Trigger types
export type TriggerType =
 | 'manual'
 | 'scheduled'
 | 'webhook'
 | 'data_change'
 | 'rule_match'

// Condition operators
export type ConditionOperator =
 | 'equals'
 | 'not_equals'
 | 'greater_than'
 | 'less_than'
 | 'contains'
 | 'is_empty'
 | 'is_not_empty'

// Action types
export type ActionType =
 | 'send_email'
 | 'send_notification'
 | 'update_record'
 | 'create_record'
 | 'delete_record'
 | 'call_webhook'
 | 'set_variable'
 | 'log_message'

// Transform operations
export type TransformOperation =
 | 'map'
 | 'filter'
 | 'reduce'
 | 'sort'
 | 'group'
 | 'merge'
 | 'extract'
 | 'calculate'

// Node position on canvas
export interface NodePosition {
 x: number
 y: number
}

// Port (connection point) on a node
export interface NodePort {
 id: string
 type: 'input' | 'output'
 label: string
 dataType?: 'any' | 'boolean' | 'number' | 'string' | 'array' | 'object'
 connected?: boolean
}

// Base node structure
export interface WorkflowNode {
 id: string
 type: WorkflowNodeType
 name: string
 description?: string
 position: NodePosition
 config: NodeConfig
 inputs: NodePort[]
 outputs: NodePort[]
 isValid: boolean
 validationErrors?: string[]
}

// Node-specific configurations
export type NodeConfig =
 | TriggerConfig
 | ConditionConfig
 | FilterConfig
 | TransformConfig
 | ActionConfig
 | DelayConfig
 | LoopConfig
 | MergeConfig
 | SplitConfig

export interface TriggerConfig {
 type: 'trigger'
 triggerType: TriggerType
 schedule?: {
 cron?: string
 interval?: number
 intervalUnit?: 'seconds' | 'minutes' | 'hours' | 'days'
 }
 dataSource?: string
 condition?: string
}

export interface ConditionConfig {
 type: 'condition'
 field: string
 operator: ConditionOperator
 value: unknown
 trueOutput?: string
 falseOutput?: string
}

export interface FilterConfig {
 type: 'filter'
 conditions: Array<{
 field: string
 operator: ConditionOperator
 value: unknown
 }>
 logic: 'AND' | 'OR'
}

export interface TransformConfig {
 type: 'transform'
 operation: TransformOperation
 sourceField?: string
 targetField?: string
 expression?: string
 options?: Record<string, unknown>
}

export interface ActionConfig {
 type: 'action'
 actionType: ActionType
 params: Record<string, unknown>
}

export interface DelayConfig {
 type: 'delay'
 duration: number
 unit: 'seconds' | 'minutes' | 'hours' | 'days'
}

export interface LoopConfig {
 type: 'loop'
 iterateOver: string
 itemVariable: string
 maxIterations?: number
}

export interface MergeConfig {
 type: 'merge'
 strategy: 'wait_all' | 'first_completed'
 timeout?: number
}

export interface SplitConfig {
 type: 'split'
 splitBy: 'condition' | 'percentage' | 'round_robin'
 branches: Array<{
 id: string
 label: string
 condition?: string
 percentage?: number
 }>
}

// Connection between nodes
export interface WorkflowConnection {
 id: string
 sourceNodeId: string
 sourcePortId: string
 targetNodeId: string
 targetPortId: string
 label?: string
}

// Complete workflow definition
export interface Workflow {
 id: string
 name: string
 description: string
 version: number
 status: 'draft' | 'active' | 'paused' | 'archived'
 nodes: WorkflowNode[]
 connections: WorkflowConnection[]
 variables: WorkflowVariable[]
 createdAt: string
 updatedAt: string
 lastRun?: string
 runCount: number
 tags: string[]
}

// Workflow variables
export interface WorkflowVariable {
 id: string
 name: string
 type: 'string' | 'number' | 'boolean' | 'array' | 'object'
 defaultValue?: unknown
 description?: string
}

// Execution context
export interface ExecutionContext {
 workflowId: string
 executionId: string
 variables: Record<string, unknown>
 data: Record<string, unknown>
 currentNodeId: string
 path: string[]
 startedAt: string
}

// Execution log entry
export interface ExecutionLogEntry {
 id: string
 executionId: string
 nodeId: string
 nodeName: string
 nodeType: WorkflowNodeType
 status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
 startedAt: string
 completedAt?: string
 duration?: number
 input: unknown
 output?: unknown
 error?: string
}

// Execution result
export interface ExecutionResult {
 executionId: string
 workflowId: string
 status: 'success' | 'failed' | 'cancelled'
 startedAt: string
 completedAt: string
 duration: number
 nodesExecuted: number
 logs: ExecutionLogEntry[]
 output: unknown
 error?: string
}

// Validation result
export interface ValidationResult {
 isValid: boolean
 errors: ValidationError[]
 warnings: ValidationWarning[]
}

export interface ValidationError {
 nodeId?: string
 connectionId?: string
 code: string
 message: string
}

export interface ValidationWarning {
 nodeId?: string
 code: string
 message: string
}

// Node template for palette
export interface NodeTemplate {
 type: WorkflowNodeType
 label: string
 icon: string
 color: string
 description: string
 category: string
 defaultConfig: Partial<NodeConfig>
 defaultInputs: NodePort[]
 defaultOutputs: NodePort[]
}

// Workflow template
export interface WorkflowTemplate {
 id: string
 name: string
 description: string
 category: string
 icon: string
 workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>
}
