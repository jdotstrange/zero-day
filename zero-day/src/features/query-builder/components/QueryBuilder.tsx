/**
 * Query Builder Component
 * Premium UI for building complex queries with nested filters
 */

import { useState, useEffect } from 'react'
import { Icon } from '@/components/common'
import type { Query, QueryFilter, QueryFilterGroup, QueryOperator, QueryExportFormat } from '../types'
import { queryFields, getOperatorsForType, getFieldsByCategory, getFieldByName, queryPresets } from '../config'
import { createEmptyFilter, createEmptyFilterGroup, createEmptyQuery, isFilterGroup, exportQuery } from '../engine'

interface QueryBuilderProps {
 query?: Query
 onChange?: (query: Query) => void
 onExecute?: (query: Query) => void
 showPreview?: boolean
}

export function QueryBuilder({ query: initialQuery, onChange, onExecute, showPreview = true }: QueryBuilderProps) {
 const [query, setQuery] = useState<Query>(initialQuery || createEmptyQuery())
 const [exportFormat, setExportFormat] = useState<QueryExportFormat>('sql')
 const [showExport, setShowExport] = useState(false)
 const [showPresets, setShowPresets] = useState(false)

 useEffect(() => {
 onChange?.(query)
 }, [query, onChange])

 const handleFilterGroupChange = (filterGroup: QueryFilterGroup) => {
 setQuery({ ...query, filterGroup, updatedAt: new Date().toISOString() })
 }

 const handleLoadPreset = (presetId: string) => {
 const preset = queryPresets.find((p) => p.id === presetId)
 if (preset) {
 setQuery({
 ...createEmptyQuery(),
 ...preset.query,
 id: query.id,
 })
 }
 setShowPresets(false)
 }

 const handleClear = () => {
 setQuery(createEmptyQuery())
 }

 const exportedQuery = exportQuery(query, exportFormat)

 return (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="px-6 py-5 bg-theme-primary">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
 <Icon icon="solar:filter-linear" className="w-6 h-6 text-white" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">Query Builder</h2>
 <p className="text-sm text-white/80">Build complex filters with nested conditions</p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setShowPresets(!showPresets)}
 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
 >
 <Icon icon="solar:bookmark-linear" className="w-4 h-4" />
 Presets
 </button>
 <button
 onClick={() => setShowExport(!showExport)}
 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
 >
 <Icon icon="solar:code-linear" className="w-4 h-4" />
 Export
 </button>
 <button
 onClick={() => onExecute?.(query)}
 className="flex items-center gap-2 px-5 py-2.5 bg-white text-accent-600 text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
 >
 <Icon icon="solar:play-linear" className="w-4 h-4" />
 Run Query
 </button>
 </div>
 </div>
 </div>

 {/* Presets Panel */}
 {showPresets && (
 <div className="px-6 py-4 bg-surface-50 dark:bg-surface-900/30 border-b border-surface-200 dark:border-surface-700">
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">
 Query Presets
 </h3>
 <button
 onClick={() => setShowPresets(false)}
 className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
 >
 <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
 </button>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {queryPresets.map((preset) => (
 <button
 key={preset.id}
 onClick={() => handleLoadPreset(preset.id)}
 className="flex items-start gap-3 p-3 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-accent-300 dark:hover:border-accent-600 transition-all text-left group"
 >
 <div className="p-2 bg-surface-100 dark:bg-surface-700 rounded-lg group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30 transition-colors">
 <Icon
 icon={preset.icon}
 className="w-5 h-5 text-secondary-500 dark:text-secondary-400 group-hover:text-accent-600 dark:group-hover:text-accent-400"
 />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
 {preset.name}
 </p>
 <p className="text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2">
 {preset.description}
 </p>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Query Name */}
 <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="flex-1">
 <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1.5 uppercase tracking-wide">
 Query Name
 </label>
 <input
 type="text"
 value={query.name}
 onChange={(e) => setQuery({ ...query, name: e.target.value })}
 placeholder="Enter a name for this query..."
 className="w-full px-4 py-2.5 text-sm font-medium bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 </div>
 <div className="flex-1">
 <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1.5 uppercase tracking-wide">
 Description
 </label>
 <input
 type="text"
 value={query.description}
 onChange={(e) => setQuery({ ...query, description: e.target.value })}
 placeholder="What does this query do?"
 className="w-full px-4 py-2.5 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 </div>
 </div>
 </div>

 {/* Filter Builder */}
 <div className="p-6">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Filters</h3>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">
 Define conditions to filter your data
 </p>
 </div>
 <button
 onClick={handleClear}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary-600 dark:text-secondary-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg transition-colors"
 >
 <Icon icon="solar:restart-linear" className="w-3.5 h-3.5" />
 Clear All
 </button>
 </div>

 <FilterGroupBuilder
 group={query.filterGroup}
 onChange={handleFilterGroupChange}
 depth={0}
 />
 </div>

 {/* Sort & Pagination */}
 <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
 <div className="flex flex-wrap items-center gap-4">
 <div className="flex items-center gap-2">
 <label className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Sort By:</label>
 <select
 value={query.sortBy?.[0]?.field || ''}
 onChange={(e) =>
 setQuery({
 ...query,
 sortBy: e.target.value
 ? [{ field: e.target.value, direction: query.sortBy?.[0]?.direction || 'asc' }]
 : undefined,
 })
 }
 className="px-3 py-1.5 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg"
 >
 <option value="">None</option>
 {queryFields.map((field) => (
 <option key={field.name} value={field.name}>
 {field.label}
 </option>
 ))}
 </select>
 {query.sortBy?.[0] && (
 <button
 onClick={() =>
 setQuery({
 ...query,
 sortBy: [
 {
 field: query.sortBy![0].field,
 direction: query.sortBy![0].direction === 'asc' ? 'desc' : 'asc',
 },
 ],
 })
 }
 className="p-1.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
 >
 <Icon
 icon={query.sortBy[0].direction === 'asc' ? 'solar:sort-from-bottom-to-top-linear' : 'solar:sort-from-top-to-bottom-linear'}
 className="w-4 h-4 text-secondary-500"
 />
 </button>
 )}
 </div>

 <div className="flex items-center gap-2">
 <label className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Limit:</label>
 <input
 type="number"
 value={query.limit || ''}
 onChange={(e) =>
 setQuery({ ...query, limit: e.target.value ? parseInt(e.target.value) : undefined })
 }
 placeholder="All"
 className="w-20 px-3 py-1.5 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg"
 />
 </div>

 <div className="flex items-center gap-2">
 <label className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Offset:</label>
 <input
 type="number"
 value={query.offset || ''}
 onChange={(e) =>
 setQuery({ ...query, offset: e.target.value ? parseInt(e.target.value) : undefined })
 }
 placeholder="0"
 className="w-20 px-3 py-1.5 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg"
 />
 </div>
 </div>
 </div>

 {/* Export Panel */}
 {showExport && showPreview && (
 <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-semibold text-secondary-900 dark:text-white">
 Query Export
 </h4>
 <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5">
 {(['sql', 'json', 'mongodb', 'graphql'] as QueryExportFormat[]).map((format) => (
 <button
 key={format}
 onClick={() => setExportFormat(format)}
 className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
 exportFormat === format
 ? 'bg-white dark:bg-surface-700 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
 }`}
 >
 {format.toUpperCase()}
 </button>
 ))}
 </div>
 </div>
 <button
 onClick={() => navigator.clipboard.writeText(exportedQuery)}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/50 transition-colors"
 >
 <Icon icon="solar:copy-linear" className="w-3.5 h-3.5" />
 Copy
 </button>
 </div>
 <pre className="p-4 bg-surface-900 dark:bg-black text-sm text-green-400 rounded-xl overflow-x-auto font-mono">
 <code>{exportedQuery}</code>
 </pre>
 </div>
 )}
 </div>
 )
}

interface FilterGroupBuilderProps {
 group: QueryFilterGroup
 onChange: (group: QueryFilterGroup) => void
 depth: number
}

function FilterGroupBuilder({ group, onChange, depth }: FilterGroupBuilderProps) {
 const fieldsByCategory = getFieldsByCategory()

 const handleLogicChange = (logic: 'AND' | 'OR') => {
 onChange({ ...group, logic })
 }

 const handleAddFilter = () => {
 onChange({
 ...group,
 filters: [...group.filters, createEmptyFilter()],
 })
 }

 const handleAddGroup = () => {
 onChange({
 ...group,
 filters: [...group.filters, createEmptyFilterGroup()],
 })
 }

 const handleRemoveItem = (id: string) => {
 onChange({
 ...group,
 filters: group.filters.filter((item) => item.id !== id),
 })
 }

 const handleFilterChange = (id: string, updates: Partial<QueryFilter>) => {
 onChange({
 ...group,
 filters: group.filters.map((item) => {
 if (isFilterGroup(item)) return item
 if (item.id !== id) return item
 return { ...item, ...updates }
 }),
 })
 }

 const handleGroupChange = (id: string, newGroup: QueryFilterGroup) => {
 onChange({
 ...group,
 filters: group.filters.map((item) => (item.id === id ? newGroup : item)),
 })
 }

 const depthColors = [
 'border-accent-500/50 bg-accent-50/30 dark:bg-accent-900/10',
 'border-primary-500/50 bg-primary-50/30 dark:bg-primary-900/10',
 'border-success-500/50 bg-success-50/30 dark:bg-success-900/10',
 'border-warning-500/50 bg-warning-50/30 dark:bg-warning-900/10',
 ]

 return (
 <div className={`relative rounded-xl border-2 border-dashed p-4 transition-all ${depthColors[depth % depthColors.length]}`}>
 {/* Group Header */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 {/* Logic Toggle */}
 <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
 <button
 onClick={() => handleLogicChange('AND')}
 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
 group.logic === 'AND'
 ? 'bg-accent-500 text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 >
 AND
 </button>
 <button
 onClick={() => handleLogicChange('OR')}
 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
 group.logic === 'OR'
 ? 'bg-primary-500 text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 >
 OR
 </button>
 </div>

 <span className="text-xs text-secondary-500 dark:text-secondary-400">
 {group.filters.length} filter{group.filters.length !== 1 ? 's' : ''}
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={handleAddFilter}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/50 transition-colors"
 >
 <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
 Filter
 </button>
 <button
 onClick={handleAddGroup}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
 >
 <Icon icon="solar:folder-add-linear" className="w-3.5 h-3.5" />
 Group
 </button>
 </div>
 </div>

 {/* Filters */}
 <div className="space-y-3">
 {group.filters.map((item, index) => (
 <div key={item.id} className="relative">
 {/* Logic Connector */}
 {index > 0 && (
 <div className="absolute -top-3 left-6 flex items-center justify-center">
 <span
 className={`px-2 py-0.5 text-[10px] font-bold rounded ${
 group.logic === 'AND'
 ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300'
 : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
 }`}
 >
 {group.logic}
 </span>
 </div>
 )}

 {isFilterGroup(item) ? (
 <div className="relative">
 <FilterGroupBuilder
 group={item}
 onChange={(newGroup) => handleGroupChange(item.id, newGroup)}
 depth={depth + 1}
 />
 <button
 onClick={() => handleRemoveItem(item.id)}
 className="absolute -top-2 -right-2 p-1 bg-danger-100 dark:bg-danger-900/50 text-danger-600 dark:text-danger-400 rounded-full hover:bg-danger-200 dark:hover:bg-danger-900 transition-colors"
 >
 <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
 </button>
 </div>
 ) : (
 <FilterRow
 filter={item}
 fieldsByCategory={fieldsByCategory}
 onChange={(updates) => handleFilterChange(item.id, updates)}
 onRemove={() => handleRemoveItem(item.id)}
 />
 )}
 </div>
 ))}

 {group.filters.length === 0 && (
 <div className="flex items-center justify-center py-8 text-secondary-400 dark:text-secondary-500">
 <div className="text-center">
 <Icon icon="solar:filter-linear" className="w-8 h-8 mx-auto mb-2 opacity-50" />
 <p className="text-sm">No filters added yet</p>
 <p className="text-xs mt-1">Click "Filter" to add your first filter</p>
 </div>
 </div>
 )}
 </div>
 </div>
 )
}

interface FilterRowProps {
 filter: QueryFilter
 fieldsByCategory: Record<string, typeof queryFields>
 onChange: (updates: Partial<QueryFilter>) => void
 onRemove: () => void
}

function FilterRow({ filter, fieldsByCategory, onChange, onRemove }: FilterRowProps) {
 const [showFieldDropdown, setShowFieldDropdown] = useState(false)

 const selectedField = getFieldByName(filter.field)
 const operators = getOperatorsForType(filter.fieldType || 'string')

 const handleFieldSelect = (field: typeof queryFields[0]) => {
 onChange({
 field: field.name,
 fieldType: field.type,
 operator: getOperatorsForType(field.type)[0]?.value || 'eq',
 value: '',
 })
 setShowFieldDropdown(false)
 }

 const needsNoValue = filter.operator === 'is_null' || filter.operator === 'is_not_null'
 const needsSecondValue = filter.operator === 'between'

 return (
 <div className="flex items-start gap-3 p-3 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm group transition-shadow">
 {/* Field Selector */}
 <div className="relative flex-1 min-w-[160px]">
 <button
 onClick={() => setShowFieldDropdown(!showFieldDropdown)}
 className="w-full flex items-center justify-between px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-600 transition-colors"
 >
 <span className={selectedField ? 'text-secondary-900 dark:text-white' : 'text-secondary-400'}>
 {selectedField?.label || 'Select field...'}
 </span>
 <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-secondary-400" />
 </button>

 {showFieldDropdown && (
 <div className="absolute z-50 top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl">
 {Object.entries(fieldsByCategory).map(([category, fields]) => (
 <div key={category}>
 <div className="px-3 py-2 text-xs font-semibold text-secondary-500 dark:text-secondary-400 bg-surface-50 dark:bg-surface-900 sticky top-0">
 {category}
 </div>
 {fields.map((field) => (
 <button
 key={field.name}
 onClick={() => handleFieldSelect(field)}
 className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-colors ${
 filter.field === field.name ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300' : 'text-secondary-700 dark:text-secondary-300'
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
 <div className="flex-1 min-w-[140px]">
 <select
 value={filter.operator}
 onChange={(e) => onChange({ operator: e.target.value as QueryOperator })}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
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
 <>
 <div className="flex-1 min-w-[140px]">
 {selectedField?.options ? (
 <select
 value={String(filter.value)}
 onChange={(e) => onChange({ value: e.target.value })}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 >
 <option value="">Select...</option>
 {selectedField.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 ) : filter.fieldType === 'number' ? (
 <input
 type="number"
 value={filter.value as number}
 onChange={(e) => onChange({ value: parseFloat(e.target.value) || 0 })}
 placeholder="Value..."
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 ) : filter.fieldType === 'date' ? (
 <input
 type="date"
 value={String(filter.value)}
 onChange={(e) => onChange({ value: e.target.value })}
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 ) : (
 <input
 type="text"
 value={String(filter.value)}
 onChange={(e) => onChange({ value: e.target.value })}
 placeholder="Value..."
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 )}
 </div>

 {needsSecondValue && (
 <>
 <span className="self-center text-xs text-secondary-500">and</span>
 <div className="flex-1 min-w-[100px]">
 <input
 type="number"
 value={filter.secondValue as number}
 onChange={(e) => onChange({ secondValue: parseFloat(e.target.value) || 0 })}
 placeholder="Max..."
 className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
 />
 </div>
 </>
 )}
 </>
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
