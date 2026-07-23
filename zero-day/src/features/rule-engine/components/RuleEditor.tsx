/**
 * Rule Editor Component
 * Complete rule creation/editing interface with premium UI
 */

import { useState, useEffect } from 'react'
import { Icon } from '@/components/common'
import type { Rule } from '../types'
import { ConditionBuilder } from './ConditionBuilder'
import { ActionBuilder } from './ActionBuilder'
import { validateRule, createEmptyRule } from '../engine'

interface RuleEditorProps {
 rule?: Rule | null
 onSave: (rule: Rule) => void
 onCancel: () => void
 isNew?: boolean
}

export function RuleEditor({ rule, onSave, onCancel, isNew = false }: RuleEditorProps) {
 const [editedRule, setEditedRule] = useState<Rule>(rule || createEmptyRule())
 const [activeTab, setActiveTab] = useState<'conditions' | 'actions' | 'settings'>('conditions')
 const [errors, setErrors] = useState<string[]>([])
 const [isSaving, setIsSaving] = useState(false)

 useEffect(() => {
 if (rule) {
 setEditedRule(rule)
 }
 }, [rule])

 const handleSave = async () => {
 const validation = validateRule(editedRule)
 if (!validation.valid) {
 setErrors(validation.errors)
 return
 }

 setIsSaving(true)
 setErrors([])
 
 // Simulate save delay for UX
 await new Promise((resolve) => setTimeout(resolve, 300))
 
 onSave(editedRule)
 setIsSaving(false)
 }

 const tabs = [
 { id: 'conditions', label: 'Conditions', icon: 'solar:filter-linear', count: editedRule.conditionGroup.conditions.length },
 { id: 'actions', label: 'Actions', icon: 'solar:bolt-linear', count: editedRule.actions.length },
 { id: 'settings', label: 'Settings', icon: 'solar:settings-linear' },
 ] as const

 return (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl overflow-visible border border-surface-200 dark:border-surface-700">
 {/* Header */}
 <div className="px-6 py-5 bg-theme-primary">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
 <Icon icon="solar:code-linear" className="w-6 h-6 text-white" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">
 {isNew ? 'Create New Rule' : 'Edit Rule'}
 </h2>
 <p className="text-sm text-white/80">
 {isNew
 ? 'Define conditions and actions for your rule'
 : `Editing: ${editedRule.name || 'Untitled Rule'}`}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={onCancel}
 className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleSave}
 disabled={isSaving}
 className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg disabled:opacity-70"
 >
 {isSaving ? (
 <>
 <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
 Saving...
 </>
 ) : (
 <>
 <Icon icon="solar:diskette-linear" className="w-4 h-4" />
 Save Rule
 </>
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Error Banner */}
 {errors.length > 0 && (
 <div className="px-6 py-3 bg-danger-50 dark:bg-danger-900/20 border-b border-danger-200 dark:border-danger-800">
 <div className="flex items-start gap-3">
 <Icon icon="solar:danger-circle-linear" className="w-5 h-5 text-danger-500 mt-0.5" />
 <div>
 <p className="text-sm font-medium text-danger-700 dark:text-danger-300">
 Please fix the following errors:
 </p>
 <ul className="mt-1 text-sm text-danger-600 dark:text-danger-400 list-disc list-inside">
 {errors.map((error, index) => (
 <li key={index}>{error}</li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 )}

 {/* Rule Name Input */}
 <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
 <div className="flex flex-col md:flex-row md:items-center gap-4">
 <div className="flex-1">
 <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1.5 uppercase tracking-wide">
 Rule Name
 </label>
 <input
 type="text"
 value={editedRule.name}
 onChange={(e) => setEditedRule({ ...editedRule, name: e.target.value })}
 placeholder="Enter a descriptive name..."
 className="w-full px-4 py-2.5 text-base font-medium bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 </div>
 <div className="flex-1">
 <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1.5 uppercase tracking-wide">
 Description
 </label>
 <input
 type="text"
 value={editedRule.description}
 onChange={(e) => setEditedRule({ ...editedRule, description: e.target.value })}
 placeholder="What does this rule do?"
 className="w-full px-4 py-2.5 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 />
 </div>
 </div>
 </div>

 {/* Tabs */}
 <div className="px-6 border-b border-surface-200 dark:border-surface-700">
 <nav className="flex gap-1" aria-label="Rule Editor Tabs">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
 activeTab === tab.id
 ? 'border-primary-500 text-primary-600 dark:text-primary-400'
 : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200'
 }`}
 >
 <Icon icon={tab.icon} className="w-4 h-4" />
 {tab.label}
 {'count' in tab && tab.count !== undefined && (
 <span
 className={`px-2 py-0.5 text-xs rounded-full ${
 activeTab === tab.id
 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
 : 'bg-surface-100 text-secondary-500 dark:bg-surface-700 dark:text-secondary-400'
 }`}
 >
 {tab.count}
 </span>
 )}
 </button>
 ))}
 </nav>
 </div>

 {/* Tab Content */}
 <div className="p-6 min-h-[400px]">
 {activeTab === 'conditions' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
 Rule Conditions
 </h3>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">
 Define when this rule should trigger
 </p>
 </div>
 </div>
 
 <ConditionBuilder
 conditionGroup={editedRule.conditionGroup}
 onChange={(conditionGroup) => setEditedRule({ ...editedRule, conditionGroup })}
 />
 </div>
 )}

 {activeTab === 'actions' && (
 <ActionBuilder
 actions={editedRule.actions}
 onChange={(actions) => setEditedRule({ ...editedRule, actions })}
 />
 )}

 {activeTab === 'settings' && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
 Rule Settings
 </h3>
 </div>

 {/* Enable/Disable Toggle */}
 <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
 <Icon icon="solar:power-linear" className="w-5 h-5 text-success-600 dark:text-success-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 Rule Status
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Enable or disable this rule
 </p>
 </div>
 </div>
 <button
 onClick={() => setEditedRule({ ...editedRule, enabled: !editedRule.enabled })}
 className={`relative w-12 h-6 rounded-full transition-colors ${
 editedRule.enabled
 ? 'bg-success-500'
 : 'bg-surface-300 dark:bg-surface-600'
 }`}
 >
 <span
 className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
 editedRule.enabled ? 'left-7' : 'left-1'
 }`}
 />
 </button>
 </div>

 {/* Priority */}
 <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
 <Icon icon="solar:sort-from-top-to-bottom-linear" className="w-5 h-5 text-warning-600 dark:text-warning-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 Priority Level
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Higher priority rules execute first (1-10)
 </p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <input
 type="range"
 min={1}
 max={10}
 value={editedRule.priority}
 onChange={(e) =>
 setEditedRule({ ...editedRule, priority: parseInt(e.target.value) })
 }
 className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
 />
 <span className="w-12 text-center px-3 py-1.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-semibold text-secondary-900 dark:text-white">
 {editedRule.priority}
 </span>
 </div>
 </div>

 {/* Tags */}
 <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
 <Icon icon="solar:tag-linear" className="w-5 h-5 text-accent-600 dark:text-accent-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">Tags</p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Organize rules with tags
 </p>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mb-3">
 {editedRule.tags.map((tag, index) => (
 <span
 key={index}
 className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-full text-sm text-secondary-700 dark:text-secondary-300"
 >
 {tag}
 <button
 onClick={() =>
 setEditedRule({
 ...editedRule,
 tags: editedRule.tags.filter((_, i) => i !== index),
 })
 }
 className="p-0.5 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-full transition-colors"
 >
 <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5 text-secondary-400 hover:text-danger-500" />
 </button>
 </span>
 ))}
 </div>
 <div className="flex gap-2">
 <input
 type="text"
 placeholder="Add a tag..."
 className="flex-1 px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
 onKeyDown={(e) => {
 if (e.key === 'Enter' && e.currentTarget.value.trim()) {
 setEditedRule({
 ...editedRule,
 tags: [...editedRule.tags, e.currentTarget.value.trim()],
 })
 e.currentTarget.value = ''
 }
 }}
 />
 </div>
 </div>

 {/* Rule Stats (for existing rules) */}
 {!isNew && (
 <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 bg-info-100 dark:bg-info-900/30 rounded-lg">
 <Icon icon="solar:chart-2-linear" className="w-5 h-5 text-info-600 dark:text-info-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 Rule Statistics
 </p>
 </div>
 </div>
 <div className="grid grid-cols-3 gap-4">
 <div className="text-center p-3 bg-white dark:bg-surface-900 rounded-lg">
 <p className="text-2xl font-bold text-secondary-900 dark:text-white">
 {editedRule.triggerCount}
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Times Triggered
 </p>
 </div>
 <div className="text-center p-3 bg-white dark:bg-surface-900 rounded-lg">
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 {new Date(editedRule.createdAt).toLocaleDateString()}
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">Created</p>
 </div>
 <div className="text-center p-3 bg-white dark:bg-surface-900 rounded-lg">
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 {new Date(editedRule.updatedAt).toLocaleDateString()}
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Last Updated
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 )
}
