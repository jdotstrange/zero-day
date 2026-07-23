/**
 * Rule Condition Builder Component
 * Premium UI for building rule conditions with nested groups
 */

import { useState } from 'react'
import { Icon } from '@/components/common'
import type { RuleCondition, ConditionGroup, ComparisonOperator } from '../types'
import { availableFields, getOperatorsForFieldType, getFieldsByCategory } from '../config'
import { createEmptyCondition, createEmptyConditionGroup } from '../engine'

interface ConditionBuilderProps {
 conditionGroup: ConditionGroup
 onChange: (group: ConditionGroup) => void
 depth?: number
}

export function ConditionBuilder({ conditionGroup, onChange, depth = 0 }: ConditionBuilderProps) {
 const [isExpanded, setIsExpanded] = useState(true)
 const fieldsByCategory = getFieldsByCategory()

 const handleLogicalOperatorChange = (operator: 'AND' | 'OR') => {
 onChange({ ...conditionGroup, logicalOperator: operator })
 }

 const handleAddCondition = () => {
 onChange({
 ...conditionGroup,
 conditions: [...conditionGroup.conditions, createEmptyCondition()],
 })
 }

 const handleAddGroup = () => {
 onChange({
 ...conditionGroup,
 conditions: [...conditionGroup.conditions, createEmptyConditionGroup()],
 })
 }

 const handleRemoveItem = (id: string) => {
 onChange({
 ...conditionGroup,
 conditions: conditionGroup.conditions.filter((item) => item.id !== id),
 })
 }

 const handleConditionChange = (id: string, updates: Partial<RuleCondition>) => {
 onChange({
 ...conditionGroup,
 conditions: conditionGroup.conditions.map((item) => {
 if ('logicalOperator' in item) return item
 if (item.id !== id) return item
 return { ...item, ...updates }
 }),
 })
 }

 const handleGroupChange = (id: string, newGroup: ConditionGroup) => {
 onChange({
 ...conditionGroup,
 conditions: conditionGroup.conditions.map((item) =>
 item.id === id ? newGroup : item
 ),
 })
 }

 const isConditionGroup = (item: RuleCondition | ConditionGroup): item is ConditionGroup => {
 return 'logicalOperator' in item
 }

 const depthColors = [
 'border-primary-500/50 bg-primary-50/30 dark:bg-primary-900/10',
 'border-accent-500/50 bg-accent-50/30 dark:bg-accent-900/10',
 'border-success-500/50 bg-success-50/30 dark:bg-success-900/10',
 'border-warning-500/50 bg-warning-50/30 dark:bg-warning-900/10',
 ]

 return (
 <div
 className={`relative rounded-xl border-2 border-dashed p-4 transition-all ${
 depthColors[depth % depthColors.length]
 }`}
 >
 {/* Group Header */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <button
 onClick={() => setIsExpanded(!isExpanded)}
 className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
 >
 <Icon
 icon={isExpanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
 className="w-4 h-4 text-secondary-500"
 />
 </button>

 {/* Logical Operator Toggle */}
 <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
 <button
 onClick={() => handleLogicalOperatorChange('AND')}
 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
 conditionGroup.logicalOperator === 'AND'
 ? 'bg-primary-500 text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 >
 AND
 </button>
 <button
 onClick={() => handleLogicalOperatorChange('OR')}
 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
 conditionGroup.logicalOperator === 'OR'
 ? 'bg-accent-500 text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 >
 OR
 </button>
 </div>

 <span className="text-xs text-secondary-500 dark:text-secondary-400">
 {conditionGroup.conditions.length} condition{conditionGroup.conditions.length !== 1 ? 's' : ''}
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={handleAddCondition}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
 >
 <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
 Condition
 </button>
 <button
 onClick={handleAddGroup}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/50 transition-colors"
 >
 <Icon icon="solar:folder-add-linear" className="w-3.5 h-3.5" />
 Group
 </button>
 </div>
 </div>

 {/* Conditions List */}
 {isExpanded && (
 <div className="space-y-3">
 {conditionGroup.conditions.map((item, index) => (
 <div key={item.id} className="relative">
 {/* Connector Line */}
 {index > 0 && (
 <div className="absolute -top-3 left-6 flex items-center justify-center">
 <span
 className={`px-2 py-0.5 text-[10px] font-bold rounded ${
 conditionGroup.logicalOperator === 'AND'
 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
 : 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300'
 }`}
 >
 {conditionGroup.logicalOperator}
 </span>
 </div>
 )}

 {isConditionGroup(item) ? (
 <ConditionBuilder
 conditionGroup={item}
 onChange={(newGroup) => handleGroupChange(item.id, newGroup)}
 depth={depth + 1}
 />
 ) : (
 <ConditionRow
 condition={item}
 onChange={(updates) => handleConditionChange(item.id, updates)}
 onRemove={() => handleRemoveItem(item.id)}
 fieldsByCategory={fieldsByCategory}
 />
 )}

 {/* Remove Group Button */}
 {isConditionGroup(item) && depth > 0 && (
 <button
 onClick={() => handleRemoveItem(item.id)}
 className="absolute -top-2 -right-2 p-1 bg-danger-100 dark:bg-danger-900/50 text-danger-600 dark:text-danger-400 rounded-full hover:bg-danger-200 dark:hover:bg-danger-900 transition-colors"
 >
 <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
 </button>
 )}
 </div>
 ))}

 {conditionGroup.conditions.length === 0 && (
 <div className="flex items-center justify-center py-8 text-secondary-400 dark:text-secondary-500">
 <div className="text-center">
 <Icon icon="solar:filter-linear" className="w-8 h-8 mx-auto mb-2 opacity-50" />
 <p className="text-sm">No conditions added yet</p>
 <p className="text-xs mt-1">Click "Condition" to add your first rule condition</p>
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 )
}

interface ConditionRowProps {
 condition: RuleCondition
 onChange: (updates: Partial<RuleCondition>) => void
 onRemove: () => void
 fieldsByCategory: Record<string, typeof availableFields>
}

function ConditionRow({ condition, onChange, onRemove, fieldsByCategory }: ConditionRowProps) {
 const [showFieldDropdown, setShowFieldDropdown] = useState(false)

 const selectedField = availableFields.find((f) => f.name === condition.field)
 const operators = getOperatorsForFieldType(condition.fieldType || 'string')

 const handleFieldSelect = (field: typeof availableFields[0]) => {
 onChange({
 field: field.name,
 fieldType: field.type,
 operator: getOperatorsForFieldType(field.type)[0]?.value || 'equals',
 value: field.type === 'boolean' ? false : field.type === 'number' ? 0 : '',
 })
 setShowFieldDropdown(false)
 }

 const handleOperatorChange = (operator: ComparisonOperator) => {
 onChange({ operator })
 }

 const handleValueChange = (value: string | number | boolean) => {
 onChange({ value })
 }

 const needsNoValue = condition.operator === 'is_empty' || condition.operator === 'is_not_empty'

 return (
 <div className="flex items-start gap-3 p-3 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm group transition-shadow">
 {/* Field Selector */}
 <div className="relative flex-1 min-w-[180px]">
 <button
 onClick={() => setShowFieldDropdown(!showFieldDropdown)}
 className="w-full flex items-center justify-between px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
 >
 <span className={selectedField ? 'text-secondary-900 dark:text-white' : 'text-secondary-400'}>
 {selectedField?.label || 'Select field...'}
 </span>
 <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-secondary-400" />
 </button>

 {/* Field Dropdown */}
 {showFieldDropdown && (
 <div className="absolute z-50 top-full left-0 mt-1 w-72 max-h-64 overflow-y-auto bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl">
 {Object.entries(fieldsByCategory).map(([category, fields]) => (
 <div key={category}>
 <div className="px-3 py-2 text-xs font-semibold text-secondary-500 dark:text-secondary-400 bg-surface-50 dark:bg-surface-900 sticky top-0">
 {category}
 </div>
 {fields.map((field) => (
 <button
 key={field.name}
 onClick={() => handleFieldSelect(field)}
 className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors ${
 condition.field === field.name ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-secondary-700 dark:text-secondary-300'
 }`}
 >
 <span className="text-xs px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-700 text-secondary-500 dark:text-secondary-400">
 {field.type}
 </span>
 {field.label}
 </button>
 ))}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Operator Selector */}
 <div className="flex-1 min-w-[150px]">
 <select
 value={condition.operator}
 onChange={(e) => handleOperatorChange(e.target.value as ComparisonOperator)}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 >
 {operators.map((op) => (
 <option key={op.value} value={op.value}>
 {op.label}
 </option>
 ))}
 </select>
 </div>

 {/* Value Input */}
 {!needsNoValue && (
 <div className="flex-1 min-w-[150px]">
 <ValueInput
 condition={condition}
 selectedField={selectedField}
 onChange={handleValueChange}
 />
 </div>
 )}

 {/* Remove Button */}
 <button
 onClick={onRemove}
 className="p-2 text-secondary-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
 >
 <Icon icon="solar:trash-bin-2-linear" className="w-4 h-4" />
 </button>
 </div>
 )
}

interface ValueInputProps {
 condition: RuleCondition
 selectedField: typeof availableFields[0] | undefined
 onChange: (value: string | number | boolean) => void
}

function ValueInput({ condition, selectedField, onChange }: ValueInputProps) {
 // Select field with options
 if (selectedField?.options && condition.operator !== 'in_list' && condition.operator !== 'not_in_list') {
 return (
 <select
 value={String(condition.value)}
 onChange={(e) => onChange(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 >
 <option value="">Select value...</option>
 {selectedField.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 )
 }

 // Boolean field
 if (condition.fieldType === 'boolean') {
 return (
 <select
 value={String(condition.value)}
 onChange={(e) => onChange(e.target.value === 'true')}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 >
 <option value="true">True</option>
 <option value="false">False</option>
 </select>
 )
 }

 // Number field
 if (condition.fieldType === 'number') {
 return (
 <input
 type="number"
 value={condition.value as number}
 onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
 placeholder="Enter number..."
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 )
 }

 // Date field
 if (condition.fieldType === 'date') {
 return (
 <input
 type="date"
 value={String(condition.value)}
 onChange={(e) => onChange(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 )
 }

 // Default: text input
 return (
 <input
 type="text"
 value={String(condition.value)}
 onChange={(e) => onChange(e.target.value)}
 placeholder="Enter value..."
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 )
}
