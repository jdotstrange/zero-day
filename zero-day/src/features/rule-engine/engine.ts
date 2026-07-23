/**
 * Rule Engine - Core Logic
 * Evaluates rules against data and executes actions
 */

import type {
 Rule,
 RuleCondition,
 ConditionGroup,
 RuleAction,
 RuleExecutionResult,
 ConditionEvaluationResult,
 ComparisonOperator,
} from './types'

/**
 * Evaluate a single condition against data
 */
export function evaluateCondition(
 condition: RuleCondition,
 data: Record<string, unknown>
): ConditionEvaluationResult {
 const actualValue = getNestedValue(data, condition.field)
 const passed = compareValues(
 actualValue,
 condition.operator,
 condition.value,
 condition.fieldType
 )

 return {
 conditionId: condition.id,
 field: condition.field,
 operator: condition.operator,
 expectedValue: condition.value,
 actualValue,
 passed,
 }
}

/**
 * Get nested value from object using dot notation
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
 * Compare values based on operator
 */
function compareValues(
 actual: unknown,
 operator: ComparisonOperator,
 expected: unknown,
 _fieldType: string
): boolean {
 // Handle null/undefined
 if (actual === null || actual === undefined) {
 if (operator === 'is_empty') return true
 if (operator === 'is_not_empty') return false
 return false
 }

 switch (operator) {
 case 'equals':
 return String(actual).toLowerCase() === String(expected).toLowerCase()

 case 'not_equals':
 return String(actual).toLowerCase() !== String(expected).toLowerCase()

 case 'greater_than':
 return Number(actual) > Number(expected)

 case 'less_than':
 return Number(actual) < Number(expected)

 case 'greater_than_or_equal':
 return Number(actual) >= Number(expected)

 case 'less_than_or_equal':
 return Number(actual) <= Number(expected)

 case 'contains':
 return String(actual).toLowerCase().includes(String(expected).toLowerCase())

 case 'not_contains':
 return !String(actual).toLowerCase().includes(String(expected).toLowerCase())

 case 'starts_with':
 return String(actual).toLowerCase().startsWith(String(expected).toLowerCase())

 case 'ends_with':
 return String(actual).toLowerCase().endsWith(String(expected).toLowerCase())

 case 'is_empty':
 return actual === '' || actual === null || actual === undefined

 case 'is_not_empty':
 return actual !== '' && actual !== null && actual !== undefined

 case 'in_list':
 if (Array.isArray(expected)) {
 return expected.some(
 (item) => String(item).toLowerCase() === String(actual).toLowerCase()
 )
 }
 return false

 case 'not_in_list':
 if (Array.isArray(expected)) {
 return !expected.some(
 (item) => String(item).toLowerCase() === String(actual).toLowerCase()
 )
 }
 return true

 case 'between':
 if (Array.isArray(expected) && expected.length === 2) {
 const num = Number(actual)
 return num >= Number(expected[0]) && num <= Number(expected[1])
 }
 return false

 default:
 return false
 }
}

/**
 * Check if item is a condition group
 */
export function isConditionGroup(item: RuleCondition | ConditionGroup): item is ConditionGroup {
 return 'logicalOperator' in item && 'conditions' in item
}

export function countConditions(group: ConditionGroup): number {
 return group.conditions.reduce((count, item) => {
  if (isConditionGroup(item)) return count + countConditions(item)
  return count + 1
 }, 0)
}

/**
 * Evaluate a condition group (recursive)
 */
export function evaluateConditionGroup(
 group: ConditionGroup,
 data: Record<string, unknown>
): { passed: boolean; results: ConditionEvaluationResult[] } {
 const results: ConditionEvaluationResult[] = []
 const evaluations: boolean[] = []

 for (const item of group.conditions) {
 if (isConditionGroup(item)) {
 const nestedResult = evaluateConditionGroup(item, data)
 results.push(...nestedResult.results)
 evaluations.push(nestedResult.passed)
 } else {
 const result = evaluateCondition(item, data)
 results.push(result)
 evaluations.push(result.passed)
 }
 }

 const passed =
 group.logicalOperator === 'AND'
 ? evaluations.every((e) => e)
 : evaluations.some((e) => e)

 return { passed, results }
}

/**
 * Execute actions for a matched rule
 */
export function executeActions(
 actions: RuleAction[],
 data: Record<string, unknown>,
 callbacks?: {
 onHighlight?: (config: Record<string, unknown>, data: Record<string, unknown>) => void
 onNotification?: (config: Record<string, unknown>) => void
 onAddTag?: (config: Record<string, unknown>, data: Record<string, unknown>) => void
 onSetField?: (config: Record<string, unknown>, data: Record<string, unknown>) => void
 onUpdateStatus?: (config: Record<string, unknown>, data: Record<string, unknown>) => void
 }
): RuleAction[] {
 const executed: RuleAction[] = []

 for (const action of actions) {
 try {
 switch (action.type) {
 case 'highlight':
 callbacks?.onHighlight?.(action.config, data)
 break
 case 'show_notification':
 callbacks?.onNotification?.(action.config)
 break
 case 'add_tag':
 callbacks?.onAddTag?.(action.config, data)
 break
 case 'set_field':
 callbacks?.onSetField?.(action.config, data)
 break
 case 'update_status':
 callbacks?.onUpdateStatus?.(action.config, data)
 break
 // Add more action handlers as needed
 }
 executed.push(action)
 } catch (error) {
 console.error(`Failed to execute action ${action.type}:`, error)
 }
 }

 return executed
}

/**
 * Execute a single rule against data
 */
export function executeRule(
 rule: Rule,
 data: Record<string, unknown>,
 callbacks?: Parameters<typeof executeActions>[2]
): RuleExecutionResult {
 const { passed, results } = evaluateConditionGroup(rule.conditionGroup, data)

 let triggeredActions: RuleAction[] = []
 if (passed && rule.enabled) {
 triggeredActions = executeActions(rule.actions, data, callbacks)
 }

 return {
 ruleId: rule.id,
 ruleName: rule.name,
 matched: passed,
 triggeredActions,
 executedAt: new Date().toISOString(),
 dataSnapshot: { ...data },
 conditionResults: results,
 }
}

/**
 * Execute multiple rules against data (sorted by priority)
 */
export function executeRules(
 rules: Rule[],
 data: Record<string, unknown>,
 callbacks?: Parameters<typeof executeActions>[2]
): RuleExecutionResult[] {
 const sortedRules = [...rules].sort((a, b) => b.priority - a.priority)
 return sortedRules.map((rule) => executeRule(rule, data, callbacks))
}

/**
 * Validate a rule definition
 */
export function validateRule(rule: Partial<Rule>): { valid: boolean; errors: string[] } {
 const errors: string[] = []

 if (!rule.name?.trim()) {
 errors.push('Rule name is required')
 }

 if (!rule.conditionGroup?.conditions?.length) {
 errors.push('At least one condition is required')
 }

 if (!rule.actions?.length) {
 errors.push('At least one action is required')
 }

 return {
 valid: errors.length === 0,
 errors,
 }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
 return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Create empty condition
 */
export function createEmptyCondition(): RuleCondition {
 return {
 id: generateId(),
 field: '',
 fieldType: 'string',
 operator: 'equals',
 value: '',
 }
}

/**
 * Create empty condition group
 */
export function createEmptyConditionGroup(): ConditionGroup {
 return {
 id: generateId(),
 logicalOperator: 'AND',
 conditions: [createEmptyCondition()],
 }
}

/**
 * Create empty action
 */
export function createEmptyAction(type: RuleAction['type'] = 'show_notification'): RuleAction {
 return {
 id: generateId(),
 type,
 config: {},
 }
}

/**
 * Create empty rule
 */
export function createEmptyRule(): Rule {
 return {
 id: generateId(),
 name: '',
 description: '',
 enabled: true,
 priority: 1,
 conditionGroup: createEmptyConditionGroup(),
 actions: [createEmptyAction()],
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 tags: [],
 triggerCount: 0,
 }
}
