/**
 * Workflow Builder - Configuration and Templates
 * Node templates, presets, and workflow templates
 */

import type { NodeTemplate, WorkflowTemplate, WorkflowNodeType } from './types'

// Node templates for the palette
export const nodeTemplates: NodeTemplate[] = [
 // Triggers
 {
 type: 'trigger',
 label: 'Manual Trigger',
 icon: 'solar:play-circle-linear',
 color: '#10B981',
 description: 'Start workflow manually',
 category: 'Triggers',
 defaultConfig: { type: 'trigger', triggerType: 'manual' },
 defaultInputs: [],
 defaultOutputs: [{ id: '', type: 'output', label: 'Start', dataType: 'any' }],
 },
 {
 type: 'trigger',
 label: 'Scheduled',
 icon: 'solar:clock-circle-linear',
 color: '#10B981',
 description: 'Run on a schedule',
 category: 'Triggers',
 defaultConfig: { type: 'trigger', triggerType: 'scheduled', schedule: { interval: 60, intervalUnit: 'minutes' } },
 defaultInputs: [],
 defaultOutputs: [{ id: '', type: 'output', label: 'Start', dataType: 'any' }],
 },
 {
 type: 'trigger',
 label: 'Data Change',
 icon: 'solar:database-linear',
 color: '#10B981',
 description: 'Trigger on data changes',
 category: 'Triggers',
 defaultConfig: { type: 'trigger', triggerType: 'data_change', dataSource: '' },
 defaultInputs: [],
 defaultOutputs: [{ id: '', type: 'output', label: 'Changed Data', dataType: 'object' }],
 },

 // Logic
 {
 type: 'condition',
 label: 'If/Else',
 icon: 'solar:branching-paths-up-linear',
 color: '#8B5CF6',
 description: 'Branch based on condition',
 category: 'Logic',
 defaultConfig: { type: 'condition', field: '', operator: 'equals', value: '' },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [
 { id: '', type: 'output', label: 'True', dataType: 'any' },
 { id: '', type: 'output', label: 'False', dataType: 'any' },
 ],
 },
 {
 type: 'filter',
 label: 'Filter',
 icon: 'solar:filter-linear',
 color: '#8B5CF6',
 description: 'Filter array items',
 category: 'Logic',
 defaultConfig: { type: 'filter', conditions: [], logic: 'AND' },
 defaultInputs: [{ id: '', type: 'input', label: 'Array', dataType: 'array' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Filtered', dataType: 'array' }],
 },
 {
 type: 'split',
 label: 'Split',
 icon: 'solar:share-linear',
 color: '#8B5CF6',
 description: 'Split into branches',
 category: 'Logic',
 defaultConfig: { type: 'split', splitBy: 'condition', branches: [] },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [
 { id: '', type: 'output', label: 'Branch A', dataType: 'any' },
 { id: '', type: 'output', label: 'Branch B', dataType: 'any' },
 ],
 },
 {
 type: 'merge',
 label: 'Merge',
 icon: 'solar:login-3-linear',
 color: '#8B5CF6',
 description: 'Merge multiple branches',
 category: 'Logic',
 defaultConfig: { type: 'merge', strategy: 'wait_all' },
 defaultInputs: [
 { id: '', type: 'input', label: 'Input 1', dataType: 'any' },
 { id: '', type: 'input', label: 'Input 2', dataType: 'any' },
 ],
 defaultOutputs: [{ id: '', type: 'output', label: 'Merged', dataType: 'array' }],
 },
 {
 type: 'loop',
 label: 'Loop',
 icon: 'solar:refresh-linear',
 color: '#8B5CF6',
 description: 'Iterate over items',
 category: 'Logic',
 defaultConfig: { type: 'loop', iterateOver: '', itemVariable: 'item' },
 defaultInputs: [{ id: '', type: 'input', label: 'Array', dataType: 'array' }],
 defaultOutputs: [
 { id: '', type: 'output', label: 'Item', dataType: 'any' },
 { id: '', type: 'output', label: 'Done', dataType: 'array' },
 ],
 },

 // Transform
 {
 type: 'transform',
 label: 'Map',
 icon: 'solar:transformation-linear',
 color: '#F59E0B',
 description: 'Transform data',
 category: 'Transform',
 defaultConfig: { type: 'transform', operation: 'map', expression: '' },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Output', dataType: 'any' }],
 },
 {
 type: 'transform',
 label: 'Extract',
 icon: 'solar:download-linear',
 color: '#F59E0B',
 description: 'Extract field value',
 category: 'Transform',
 defaultConfig: { type: 'transform', operation: 'extract', sourceField: '', targetField: '' },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'object' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Value', dataType: 'any' }],
 },
 {
 type: 'transform',
 label: 'Calculate',
 icon: 'solar:calculator-linear',
 color: '#F59E0B',
 description: 'Perform calculations',
 category: 'Transform',
 defaultConfig: { type: 'transform', operation: 'calculate', expression: '' },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Result', dataType: 'number' }],
 },

 // Actions
 {
 type: 'action',
 label: 'Send Email',
 icon: 'solar:letter-linear',
 color: '#3B82F6',
 description: 'Send an email',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'send_email', params: { to: '', subject: '', body: '' } },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Sent', dataType: 'boolean' }],
 },
 {
 type: 'action',
 label: 'Notification',
 icon: 'solar:bell-linear',
 color: '#3B82F6',
 description: 'Send notification',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'send_notification', params: { title: '', message: '' } },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Sent', dataType: 'boolean' }],
 },
 {
 type: 'action',
 label: 'Update Record',
 icon: 'solar:pen-linear',
 color: '#3B82F6',
 description: 'Update a record',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'update_record', params: { table: '', id: '', data: {} } },
 defaultInputs: [{ id: '', type: 'input', label: 'Record', dataType: 'object' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Updated', dataType: 'object' }],
 },
 {
 type: 'action',
 label: 'Create Record',
 icon: 'solar:add-circle-linear',
 color: '#3B82F6',
 description: 'Create new record',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'create_record', params: { table: '', data: {} } },
 defaultInputs: [{ id: '', type: 'input', label: 'Data', dataType: 'object' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Created', dataType: 'object' }],
 },
 {
 type: 'action',
 label: 'Log',
 icon: 'solar:document-text-linear',
 color: '#3B82F6',
 description: 'Log message',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'log_message', params: { message: '' } },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Done', dataType: 'any' }],
 },
 {
 type: 'action',
 label: 'Set Variable',
 icon: 'solar:clipboard-linear',
 color: '#3B82F6',
 description: 'Set workflow variable',
 category: 'Actions',
 defaultConfig: { type: 'action', actionType: 'set_variable', params: { name: '', value: '' } },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Done', dataType: 'any' }],
 },

 // Control
 {
 type: 'delay',
 label: 'Delay',
 icon: 'solar:clock-circle-linear',
 color: '#6366F1',
 description: 'Wait for duration',
 category: 'Control',
 defaultConfig: { type: 'delay', duration: 5, unit: 'seconds' },
 defaultInputs: [{ id: '', type: 'input', label: 'Input', dataType: 'any' }],
 defaultOutputs: [{ id: '', type: 'output', label: 'Continue', dataType: 'any' }],
 },
]

// Get templates by category
export function getTemplatesByCategory(): Record<string, NodeTemplate[]> {
 return nodeTemplates.reduce((acc, template) => {
 if (!acc[template.category]) {
 acc[template.category] = []
 }
 acc[template.category].push(template)
 return acc
 }, {} as Record<string, NodeTemplate[]>)
}

// Get template by type and label
export function getTemplate(type: WorkflowNodeType, label?: string): NodeTemplate | undefined {
 return nodeTemplates.find(t => t.type === type && (!label || t.label === label))
}

// Node type colors
export const nodeTypeColors: Record<WorkflowNodeType, string> = {
 trigger: '#10B981',
 condition: '#8B5CF6',
 filter: '#8B5CF6',
 transform: '#F59E0B',
 action: '#3B82F6',
 delay: '#6366F1',
 loop: '#8B5CF6',
 merge: '#8B5CF6',
 split: '#8B5CF6',
}

// Node type icons
export const nodeTypeIcons: Record<WorkflowNodeType, string> = {
 trigger: 'solar:play-circle-linear',
 condition: 'solar:branching-paths-up-linear',
 filter: 'solar:filter-linear',
 transform: 'solar:transformation-linear',
 action: 'solar:bolt-linear',
 delay: 'solar:clock-circle-linear',
 loop: 'solar:refresh-linear',
 merge: 'solar:login-3-linear',
 split: 'solar:share-linear',
}

// Workflow templates
export const workflowTemplates: WorkflowTemplate[] = [
 {
 id: 'email-automation',
 name: 'Email Automation',
 description: 'Send automated emails based on conditions',
 category: 'Marketing',
 icon: 'solar:letter-linear',
 workflow: {
 name: 'Email Automation',
 description: 'Send automated emails based on user actions',
 version: 1,
 status: 'draft',
 nodes: [
 {
 id: 'trigger-1',
 type: 'trigger',
 name: 'On User Sign Up',
 position: { x: 100, y: 200 },
 config: { type: 'trigger', triggerType: 'data_change', dataSource: 'users' },
 inputs: [],
 outputs: [{ id: 'out-1', type: 'output', label: 'User', dataType: 'object' }],
 isValid: true,
 },
 {
 id: 'condition-1',
 type: 'condition',
 name: 'Check Email Verified',
 position: { x: 350, y: 200 },
 config: { type: 'condition', field: 'emailVerified', operator: 'equals', value: true },
 inputs: [{ id: 'in-1', type: 'input', label: 'User', dataType: 'object' }],
 outputs: [
 { id: 'out-2', type: 'output', label: 'Verified', dataType: 'object' },
 { id: 'out-3', type: 'output', label: 'Not Verified', dataType: 'object' },
 ],
 isValid: true,
 },
 {
 id: 'action-1',
 type: 'action',
 name: 'Send Welcome Email',
 position: { x: 600, y: 100 },
 config: { type: 'action', actionType: 'send_email', params: { subject: 'Welcome!', body: 'Welcome to our platform!' } },
 inputs: [{ id: 'in-2', type: 'input', label: 'User', dataType: 'object' }],
 outputs: [{ id: 'out-4', type: 'output', label: 'Sent', dataType: 'boolean' }],
 isValid: true,
 },
 {
 id: 'action-2',
 type: 'action',
 name: 'Send Verification Email',
 position: { x: 600, y: 300 },
 config: { type: 'action', actionType: 'send_email', params: { subject: 'Please Verify', body: 'Click to verify your email' } },
 inputs: [{ id: 'in-3', type: 'input', label: 'User', dataType: 'object' }],
 outputs: [{ id: 'out-5', type: 'output', label: 'Sent', dataType: 'boolean' }],
 isValid: true,
 },
 ],
 connections: [
 { id: 'conn-1', sourceNodeId: 'trigger-1', sourcePortId: 'out-1', targetNodeId: 'condition-1', targetPortId: 'in-1' },
 { id: 'conn-2', sourceNodeId: 'condition-1', sourcePortId: 'out-2', targetNodeId: 'action-1', targetPortId: 'in-2' },
 { id: 'conn-3', sourceNodeId: 'condition-1', sourcePortId: 'out-3', targetNodeId: 'action-2', targetPortId: 'in-3' },
 ],
 variables: [],
 tags: ['email', 'automation'],
 },
 },
 {
 id: 'order-processing',
 name: 'Order Processing',
 description: 'Process new orders with notifications',
 category: 'E-commerce',
 icon: 'solar:cart-linear',
 workflow: {
 name: 'Order Processing',
 description: 'Process incoming orders',
 version: 1,
 status: 'draft',
 nodes: [
 {
 id: 'trigger-1',
 type: 'trigger',
 name: 'New Order',
 position: { x: 100, y: 200 },
 config: { type: 'trigger', triggerType: 'data_change', dataSource: 'orders' },
 inputs: [],
 outputs: [{ id: 'out-1', type: 'output', label: 'Order', dataType: 'object' }],
 isValid: true,
 },
 {
 id: 'filter-1',
 type: 'filter',
 name: 'Filter High Value',
 position: { x: 350, y: 200 },
 config: { type: 'filter', conditions: [{ field: 'total', operator: 'greater_than', value: 1000 }], logic: 'AND' },
 inputs: [{ id: 'in-1', type: 'input', label: 'Order', dataType: 'object' }],
 outputs: [{ id: 'out-2', type: 'output', label: 'Filtered', dataType: 'object' }],
 isValid: true,
 },
 {
 id: 'action-1',
 type: 'action',
 name: 'Notify Manager',
 position: { x: 600, y: 200 },
 config: { type: 'action', actionType: 'send_notification', params: { title: 'High Value Order', message: 'New order over $1000' } },
 inputs: [{ id: 'in-2', type: 'input', label: 'Order', dataType: 'object' }],
 outputs: [{ id: 'out-3', type: 'output', label: 'Done', dataType: 'any' }],
 isValid: true,
 },
 ],
 connections: [
 { id: 'conn-1', sourceNodeId: 'trigger-1', sourcePortId: 'out-1', targetNodeId: 'filter-1', targetPortId: 'in-1' },
 { id: 'conn-2', sourceNodeId: 'filter-1', sourcePortId: 'out-2', targetNodeId: 'action-1', targetPortId: 'in-2' },
 ],
 variables: [],
 tags: ['orders', 'notifications'],
 },
 },
 {
 id: 'data-pipeline',
 name: 'Data Pipeline',
 description: 'Transform and process data',
 category: 'Data',
 icon: 'solar:chart-linear',
 workflow: {
 name: 'Data Pipeline',
 description: 'ETL-style data processing',
 version: 1,
 status: 'draft',
 nodes: [
 {
 id: 'trigger-1',
 type: 'trigger',
 name: 'Scheduled Run',
 position: { x: 100, y: 200 },
 config: { type: 'trigger', triggerType: 'scheduled', schedule: { interval: 1, intervalUnit: 'hours' } },
 inputs: [],
 outputs: [{ id: 'out-1', type: 'output', label: 'Start', dataType: 'any' }],
 isValid: true,
 },
 {
 id: 'transform-1',
 type: 'transform',
 name: 'Extract Data',
 position: { x: 350, y: 200 },
 config: { type: 'transform', operation: 'extract', sourceField: 'rawData' },
 inputs: [{ id: 'in-1', type: 'input', label: 'Input', dataType: 'any' }],
 outputs: [{ id: 'out-2', type: 'output', label: 'Data', dataType: 'array' }],
 isValid: true,
 },
 {
 id: 'filter-1',
 type: 'filter',
 name: 'Filter Valid',
 position: { x: 600, y: 200 },
 config: { type: 'filter', conditions: [{ field: 'status', operator: 'equals', value: 'active' }], logic: 'AND' },
 inputs: [{ id: 'in-2', type: 'input', label: 'Data', dataType: 'array' }],
 outputs: [{ id: 'out-3', type: 'output', label: 'Valid', dataType: 'array' }],
 isValid: true,
 },
 {
 id: 'action-1',
 type: 'action',
 name: 'Log Results',
 position: { x: 850, y: 200 },
 config: { type: 'action', actionType: 'log_message', params: { message: 'Pipeline completed' } },
 inputs: [{ id: 'in-3', type: 'input', label: 'Data', dataType: 'any' }],
 outputs: [{ id: 'out-4', type: 'output', label: 'Done', dataType: 'any' }],
 isValid: true,
 },
 ],
 connections: [
 { id: 'conn-1', sourceNodeId: 'trigger-1', sourcePortId: 'out-1', targetNodeId: 'transform-1', targetPortId: 'in-1' },
 { id: 'conn-2', sourceNodeId: 'transform-1', sourcePortId: 'out-2', targetNodeId: 'filter-1', targetPortId: 'in-2' },
 { id: 'conn-3', sourceNodeId: 'filter-1', sourcePortId: 'out-3', targetNodeId: 'action-1', targetPortId: 'in-3' },
 ],
 variables: [],
 tags: ['data', 'etl'],
 },
 },
]

// Get workflow template by ID
export function getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
 return workflowTemplates.find(t => t.id === id)
}

// Category icons
export const categoryIcons: Record<string, string> = {
 Triggers: 'solar:play-circle-linear',
 Logic: 'solar:branching-paths-up-linear',
 Transform: 'solar:transformation-linear',
 Actions: 'solar:bolt-linear',
 Control: 'solar:clock-circle-linear',
}
