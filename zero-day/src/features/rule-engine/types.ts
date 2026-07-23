/**
 * Rule Engine Types
 * Defines the structure for rules, conditions, and actions
 */

// Supported comparison operators
export type ComparisonOperator =
 | 'equals'
 | 'not_equals'
 | 'greater_than'
 | 'less_than'
 | 'greater_than_or_equal'
 | 'less_than_or_equal'
 | 'contains'
 | 'not_contains'
 | 'starts_with'
 | 'ends_with'
 | 'is_empty'
 | 'is_not_empty'
 | 'in_list'
 | 'not_in_list'
 | 'between'

// Logical operators for combining conditions
export type LogicalOperator = 'AND' | 'OR'

// Field types for condition values
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'select'

// Single condition
export interface RuleCondition {
 id: string
 field: string
 fieldType: FieldType
 operator: ComparisonOperator
 value: string | number | boolean | string[] | [number, number]
}

// Condition group (allows nesting)
export interface ConditionGroup {
 id: string
 logicalOperator: LogicalOperator
 conditions: (RuleCondition | ConditionGroup)[]
}

// Action types
export type ActionType =
 | 'highlight'
 | 'add_tag'
 | 'remove_tag'
 | 'show_notification'
 | 'set_field'
 | 'send_email'
 | 'trigger_webhook'
 | 'update_status'
 | 'calculate_field'

// Single action
export interface RuleAction {
 id: string
 type: ActionType
 config: Record<string, unknown>
}

// Complete rule definition
export interface Rule {
 id: string
 name: string
 description: string
 enabled: boolean
 priority: number
 conditionGroup: ConditionGroup
 actions: RuleAction[]
 createdAt: string
 updatedAt: string
 tags: string[]
 triggerCount: number
}

// Rule execution result
export interface RuleExecutionResult {
 ruleId: string
 ruleName: string
 matched: boolean
 triggeredActions: RuleAction[]
 executedAt: string
 dataSnapshot: Record<string, unknown>
 conditionResults: ConditionEvaluationResult[]
}

// Condition evaluation result (for debugging/display)
export interface ConditionEvaluationResult {
 conditionId: string
 field: string
 operator: ComparisonOperator
 expectedValue: unknown
 actualValue: unknown
 passed: boolean
}

// Available field definition (for UI)
export interface FieldDefinition {
 name: string
 label: string
 type: FieldType
 options?: { value: string; label: string }[]
 category: string
}

// Action configuration schema
export interface ActionConfig {
 type: ActionType
 label: string
 icon: string
 color: string
 fields: {
 name: string
 label: string
 type: 'text' | 'select' | 'color' | 'number' | 'textarea'
 options?: { value: string; label: string }[]
 required?: boolean
 placeholder?: string
 }[]
}

// Rule template for quick creation
export interface RuleTemplate {
 id: string
 name: string
 description: string
 category: string
 icon: string
 rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>
}
