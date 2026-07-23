/**
 * Action Builder Component
 * Premium UI for configuring rule actions
 */

import { useState } from 'react'
import { Icon } from '@/components/common'
import type { RuleAction } from '../types'
import { actionConfigs, getActionConfig } from '../config'
import { generateId } from '../engine'

interface ActionBuilderProps {
 actions: RuleAction[]
 onChange: (actions: RuleAction[]) => void
}

export function ActionBuilder({ actions, onChange }: ActionBuilderProps) {
 const [showAddMenu, setShowAddMenu] = useState(false)

 const handleAddAction = (type: RuleAction['type']) => {
 const config = getActionConfig(type)
 const defaultConfig: Record<string, unknown> = {}
 
 // Set default values for required fields
 config?.fields.forEach((field) => {
 if (field.type === 'select' && field.options?.length) {
 defaultConfig[field.name] = field.options[0].value
 } else {
 defaultConfig[field.name] = ''
 }
 })

 onChange([
 ...actions,
 {
 id: generateId(),
 type,
 config: defaultConfig,
 },
 ])
 setShowAddMenu(false)
 }

 const handleUpdateAction = (id: string, config: Record<string, unknown>) => {
 onChange(
 actions.map((action) =>
 action.id === id ? { ...action, config: { ...action.config, ...config } } : action
 )
 )
 }

 const handleRemoveAction = (id: string) => {
 onChange(actions.filter((action) => action.id !== id))
 }

 const handleReorder = (fromIndex: number, toIndex: number) => {
 const newActions = [...actions]
 const [removed] = newActions.splice(fromIndex, 1)
 newActions.splice(toIndex, 0, removed)
 onChange(newActions)
 }

 return (
 <div className="space-y-4">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
 <Icon icon="solar:bolt-linear" className="w-5 h-5 text-accent-600 dark:text-accent-400" />
 </div>
 <div>
 <h4 className="text-sm font-semibold text-secondary-900 dark:text-white">Actions</h4>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 {actions.length} action{actions.length !== 1 ? 's' : ''} configured
 </p>
 </div>
 </div>

 {/* Add Action Button */}
 <div className="relative">
 <button
 onClick={() => setShowAddMenu(!showAddMenu)}
 className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
 >
 <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
 Add Action
 </button>

 {/* Action Type Menu */}
 {showAddMenu && (
 <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl z-50 overflow-hidden">
 <div className="p-2 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
 <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
 Choose Action Type
 </p>
 </div>
 <div className="p-2 max-h-80 overflow-y-auto">
 {actionConfigs.map((config) => (
 <button
 key={config.type}
 onClick={() => handleAddAction(config.type)}
 className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors group"
 >
 <div className={`p-2 rounded-lg bg-${config.color}-100 dark:bg-${config.color}-900/30 group-hover:scale-110 transition-transform`}>
 <Icon
 icon={config.icon}
 className={`w-4 h-4 text-${config.color}-600 dark:text-${config.color}-400`}
 />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 {config.label}
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 {config.fields.length} configurable field{config.fields.length !== 1 ? 's' : ''}
 </p>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Actions List */}
 <div className="space-y-3">
 {actions.map((action, index) => (
 <ActionCard
 key={action.id}
 action={action}
 index={index}
 totalActions={actions.length}
 onUpdate={(config) => handleUpdateAction(action.id, config)}
 onRemove={() => handleRemoveAction(action.id)}
 onMoveUp={() => handleReorder(index, index - 1)}
 onMoveDown={() => handleReorder(index, index + 1)}
 />
 ))}

 {actions.length === 0 && (
 <div className="flex flex-col items-center justify-center py-10 bg-surface-50 dark:bg-surface-900/50 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700">
 <Icon icon="solar:bolt-linear" className="w-10 h-10 text-secondary-300 dark:text-secondary-600 mb-3" />
 <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">No actions configured</p>
 <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
 Add actions to trigger when conditions match
 </p>
 </div>
 )}
 </div>
 </div>
 )
}

interface ActionCardProps {
 action: RuleAction
 index: number
 totalActions: number
 onUpdate: (config: Record<string, unknown>) => void
 onRemove: () => void
 onMoveUp: () => void
 onMoveDown: () => void
}

function ActionCard({
 action,
 index,
 totalActions,
 onUpdate,
 onRemove,
 onMoveUp,
 onMoveDown,
}: ActionCardProps) {
 const [isExpanded, setIsExpanded] = useState(true)
 const config = getActionConfig(action.type)

 if (!config) return null

 const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
 primary: {
 bg: 'bg-primary-50 dark:bg-primary-900/20',
 border: 'border-primary-200 dark:border-primary-800',
 icon: 'text-primary-600 dark:text-primary-400',
 },
 accent: {
 bg: 'bg-accent-50 dark:bg-accent-900/20',
 border: 'border-accent-200 dark:border-accent-800',
 icon: 'text-accent-600 dark:text-accent-400',
 },
 success: {
 bg: 'bg-success-50 dark:bg-success-900/20',
 border: 'border-success-200 dark:border-success-800',
 icon: 'text-success-600 dark:text-success-400',
 },
 warning: {
 bg: 'bg-warning-50 dark:bg-warning-900/20',
 border: 'border-warning-200 dark:border-warning-800',
 icon: 'text-warning-600 dark:text-warning-400',
 },
 danger: {
 bg: 'bg-danger-50 dark:bg-danger-900/20',
 border: 'border-danger-200 dark:border-danger-800',
 icon: 'text-danger-600 dark:text-danger-400',
 },
 info: {
 bg: 'bg-info-50 dark:bg-info-900/20',
 border: 'border-info-200 dark:border-info-800',
 icon: 'text-info-600 dark:text-info-400',
 },
 secondary: {
 bg: 'bg-secondary-50 dark:bg-secondary-900/20',
 border: 'border-secondary-200 dark:border-secondary-800',
 icon: 'text-secondary-600 dark:text-secondary-400',
 },
 }

 const colors = colorClasses[config.color] || colorClasses.secondary

 return (
 <div
 className={`rounded-xl border ${colors.border} overflow-hidden transition-all ${colors.bg}`}
 >
 {/* Card Header */}
 <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-surface-800/50">
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

 <div className={`p-2 rounded-lg ${colors.bg}`}>
 <Icon icon={config.icon} className={`w-4 h-4 ${colors.icon}`} />
 </div>

 <div>
 <h5 className="text-sm font-semibold text-secondary-900 dark:text-white">
 {config.label}
 </h5>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Step {index + 1} of {totalActions}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-1">
 {/* Reorder Buttons */}
 <button
 onClick={onMoveUp}
 disabled={index === 0}
 className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
 >
 <Icon icon="solar:arrow-up-linear" className="w-4 h-4" />
 </button>
 <button
 onClick={onMoveDown}
 disabled={index === totalActions - 1}
 className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
 >
 <Icon icon="solar:arrow-down-linear" className="w-4 h-4" />
 </button>

 {/* Delete Button */}
 <button
 onClick={onRemove}
 className="p-1.5 rounded-lg text-secondary-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-all ml-2"
 >
 <Icon icon="solar:trash-bin-2-linear" className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Card Body - Configuration Fields */}
 {isExpanded && (
 <div className="px-4 py-4 bg-white dark:bg-surface-800 border-t border-surface-100 dark:border-surface-700">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {config.fields.map((field) => (
 <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
 <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
 {field.label}
 {field.required && <span className="text-danger-500 ml-1">*</span>}
 </label>

 {field.type === 'select' ? (
 <select
 value={String(action.config[field.name] || '')}
 onChange={(e) => onUpdate({ [field.name]: e.target.value })}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 >
 {field.options?.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 ) : field.type === 'textarea' ? (
 <textarea
 value={String(action.config[field.name] || '')}
 onChange={(e) => onUpdate({ [field.name]: e.target.value })}
 placeholder={field.placeholder}
 rows={3}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
 />
 ) : field.type === 'number' ? (
 <input
 type="number"
 value={String(action.config[field.name] || '')}
 onChange={(e) => onUpdate({ [field.name]: parseFloat(e.target.value) || 0 })}
 placeholder={field.placeholder}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 ) : field.type === 'color' ? (
 <input
 type="color"
 value={String(action.config[field.name] || '#000000')}
 onChange={(e) => onUpdate({ [field.name]: e.target.value })}
 className="w-full h-10 rounded-lg cursor-pointer"
 />
 ) : (
 <input
 type="text"
 value={String(action.config[field.name] || '')}
 onChange={(e) => onUpdate({ [field.name]: e.target.value })}
 placeholder={field.placeholder}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )
}
