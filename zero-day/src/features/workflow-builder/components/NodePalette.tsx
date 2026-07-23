/**
 * Node Palette Component
 * Sidebar with draggable node templates
 */

import { useState } from 'react'
import { Icon } from '@/components/common'
import type { WorkflowNodeType } from '../types'
import { getTemplatesByCategory, categoryIcons } from '../config'

interface NodePaletteProps {
 onAddNode: (type: WorkflowNodeType, name?: string) => void
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
 const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
 new Set(['Triggers', 'Logic', 'Actions'])
 )
 const [searchQuery, setSearchQuery] = useState('')

 const templatesByCategory = getTemplatesByCategory()

 const toggleCategory = (category: string) => {
 setExpandedCategories(prev => {
 const next = new Set(prev)
 if (next.has(category)) {
 next.delete(category)
 } else {
 next.add(category)
 }
 return next
 })
 }

 // Filter templates by search
 const filteredCategories = Object.entries(templatesByCategory).reduce((acc, [category, templates]) => {
 if (!searchQuery) {
 acc[category] = templates
 } else {
 const filtered = templates.filter(
 t => t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
 t.description.toLowerCase().includes(searchQuery.toLowerCase())
 )
 if (filtered.length > 0) {
 acc[category] = filtered
 }
 }
 return acc
 }, {} as typeof templatesByCategory)

 return (
 <div className="flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700">
 {/* Header */}
 <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
 <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-2">
 Node Palette
 </h3>
 <div className="relative">
 <Icon
 icon="solar:magnifer-linear"
 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400"
 />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search nodes..."
 className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
 />
 </div>
 </div>

 {/* Categories */}
 <div className="flex-1 overflow-y-auto">
 {Object.entries(filteredCategories).map(([category, templates]) => (
 <div key={category} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
 {/* Category header */}
 <button
 onClick={() => toggleCategory(category)}
 className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
 >
 <div className="flex items-center gap-2">
 <Icon
 icon={categoryIcons[category] || 'solar:folder-linear'}
 className="w-4 h-4 text-secondary-500"
 />
 <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
 {category}
 </span>
 <span className="text-xs text-secondary-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
 {templates.length}
 </span>
 </div>
 <Icon
 icon={expandedCategories.has(category) ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
 className="w-4 h-4 text-secondary-400"
 />
 </button>

 {/* Templates */}
 {expandedCategories.has(category) && (
 <div className="px-2 pb-2 space-y-1">
 {templates.map((template) => (
 <button
 key={`${template.type}-${template.label}`}
 onClick={() => onAddNode(template.type, template.label)}
 className="w-full px-3 py-2 flex items-center gap-2 text-left rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
 >
 <div
 className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
 style={{ backgroundColor: `${template.color}15` }}
 >
 <Icon
 icon={template.icon}
 className="w-4 h-4"
 style={{ color: template.color }}
 />
 </div>
 <div className="min-w-0">
 <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200 truncate">
 {template.label}
 </p>
 <p className="text-xs text-secondary-400 truncate">
 {template.description}
 </p>
 </div>
 </button>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>

 {/* Help hint */}
 <div className="px-4 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
 <p className="text-xs text-secondary-400">
 Click a node to add it to the canvas, then connect nodes to build your workflow.
 </p>
 </div>
 </div>
 )
}

export default NodePalette
