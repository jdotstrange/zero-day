/**
 * Insights Dashboard Component
 * Main interface for viewing and managing smart insights
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/common'
import { Button, Card, CardHeader, CardTitle, Input } from '@/components/ui'
import { cn } from '@/components/ui/cn'
import { useInsights } from '../useInsights'
import { categoryConfig, priorityConfig } from '../config'
import type { Insight, InsightCategory, InsightPriority } from '../types'

export function InsightsDashboard() {
 const {
 filteredInsights,
 summary,
 isAnalyzing,
 lastAnalyzed,
 selectedInsight,
 categoryFilter,
 priorityFilter,
 searchQuery,
 runDemoAnalysis,
 selectInsight,
 dismissInsight,
 clearInsights,
 setCategoryFilter,
 setPriorityFilter,
 setSearchQuery,
 clearFilters,
 exportInsights
 } = useInsights()

 const [showFilters, setShowFilters] = useState(false)

 const toggleCategoryFilter = (category: InsightCategory) => {
 if (categoryFilter.includes(category)) {
 setCategoryFilter(categoryFilter.filter(c => c !== category))
 } else {
 setCategoryFilter([...categoryFilter, category])
 }
 }

 const togglePriorityFilter = (priority: InsightPriority) => {
 if (priorityFilter.includes(priority)) {
 setPriorityFilter(priorityFilter.filter(p => p !== priority))
 } else {
 setPriorityFilter([...priorityFilter, priority])
 }
 }

 const handleExport = (format: 'json' | 'csv') => {
 const data = exportInsights(format)
 const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
 const url = URL.createObjectURL(blob)
 const a = document.createElement('a')
 a.href = url
 a.download = `insights_${Date.now()}.${format}`
 a.click()
 URL.revokeObjectURL(url)
 }

 return (
 <div className="space-y-6">
 <Card padding="none" className="overflow-hidden">
 <CardHeader className="mb-0 flex-row flex-wrap items-center justify-between gap-4 border-b border-surface-200 px-6 py-4 dark:border-surface-700">
 <div>
 <CardTitle>Analysis</CardTitle>
 <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
 {lastAnalyzed
 ? `Last analyzed: ${new Date(lastAnalyzed).toLocaleString()}`
 : 'AI-powered analysis of your data'}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Button type="button" onClick={runDemoAnalysis} disabled={isAnalyzing}>
 <Icon icon={isAnalyzing ? 'solar:refresh-linear' : 'solar:magic-stick-3-linear'} className={isAnalyzing ? 'animate-spin' : ''} />
 {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
 </Button>
 <Button type="button" variant="secondary" iconOnly onClick={() => handleExport('json')} aria-label="Export JSON">
 <Icon icon="solar:download-linear" />
 </Button>
 </div>
 </CardHeader>

 <div className="grid grid-cols-2 divide-x divide-surface-200 dark:divide-surface-700 md:grid-cols-5">
 {[
 { label: 'Total Insights', value: summary.totalInsights },
 { label: 'New', value: summary.newCount, valueClass: 'text-info-600' },
 { label: 'Critical', value: summary.byPriority?.critical || 0, valueClass: 'text-danger-600' },
 { label: 'High Priority', value: summary.byPriority?.high || 0, valueClass: 'text-warning-600' },
 { label: 'Actionable', value: summary.actionableCount, valueClass: 'text-accent-600' },
 ].map((stat) => (
 <div key={stat.label} className="px-4 py-4 text-center md:px-6">
 <p className={cn('heading-3 text-secondary-900 dark:text-white', stat.valueClass)}>{stat.value}</p>
 <p className="text-body-sm text-secondary-500">{stat.label}</p>
 </div>
 ))}
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex flex-wrap items-center gap-4">
 <Input
 type="search"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search insights..."
 prefix={<Icon icon="solar:magnifer-linear" className="h-4 w-4 text-secondary-400" />}
 className="min-w-64 flex-1"
 />

 {/* Filter toggle */}
 <Button
 type="button"
 variant={showFilters || categoryFilter.length > 0 || priorityFilter.length > 0 ? 'primary' : 'secondary'}
 onClick={() => setShowFilters(!showFilters)}
 >
 <Icon icon="solar:filter-linear" />
 Filters
 {(categoryFilter.length > 0 || priorityFilter.length > 0) && (
 <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
 {categoryFilter.length + priorityFilter.length}
 </span>
 )}
 </Button>

 {(categoryFilter.length > 0 || priorityFilter.length > 0 || searchQuery) && (
 <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
 Clear filters
 </Button>
 )}

 <Button type="button" variant="ghost" size="sm" className="text-danger-600" onClick={clearInsights}>
 Clear all
 </Button>
 </div>

 {/* Filter options */}
 {showFilters && (
 <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 space-y-4">
 {/* Categories */}
 <div>
 <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Categories</p>
 <div className="flex flex-wrap gap-2">
 {Object.entries(categoryConfig).map(([key, config]) => (
 <button
 key={key}
 onClick={() => toggleCategoryFilter(key as InsightCategory)}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
 categoryFilter.includes(key as InsightCategory)
 ? `${config.bgColor} ${config.color}`
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-600'
 }`}
 >
 <Icon icon={config.icon} className="w-4 h-4" />
 {config.label}
 </button>
 ))}
 </div>
 </div>

 {/* Priorities */}
 <div>
 <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Priority</p>
 <div className="flex flex-wrap gap-2">
 {Object.entries(priorityConfig).map(([key, config]) => (
 <button
 key={key}
 onClick={() => togglePriorityFilter(key as InsightPriority)}
 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
 priorityFilter.includes(key as InsightPriority)
 ? `${config.bgColor} ${config.color}`
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-600'
 }`}
 >
 {config.label}
 </button>
 ))}
 </div>
 </div>
 </div>
 )}
 </Card>

 {/* Insights list */}
 {filteredInsights.length > 0 ? (
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
 {filteredInsights.map(insight => (
 <InsightCard
 key={insight.id}
 insight={insight}
 isSelected={selectedInsight?.id === insight.id}
 onClick={() => selectInsight(insight)}
 onDismiss={() => dismissInsight(insight.id)}
 />
 ))}
 </div>
 ) : (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 p-12 text-center">
 <div className="max-w-md mx-auto">
 <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
 <Icon icon="solar:lightbulb-linear" className="w-8 h-8 text-amber-500" />
 </div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
 No Insights Yet
 </h3>
 <p className="text-secondary-500 mb-6">
 Run the analysis to discover trends, anomalies, patterns, and 
 actionable recommendations from your data.
 </p>
 <button
 onClick={runDemoAnalysis}
 disabled={isAnalyzing}
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
 >
 <Icon icon="solar:magic-stick-3-linear" className="w-5 h-5" />
 Run Demo Analysis
 </button>
 </div>
 </div>
 )}

 {/* Insight detail modal */}
 {selectedInsight && (
 <InsightDetailModal
 insight={selectedInsight}
 onClose={() => selectInsight(null)}
 onDismiss={() => {
 dismissInsight(selectedInsight.id)
 selectInsight(null)
 }}
 />
 )}
 </div>
 )
}

// Insight Card Component
interface InsightCardProps {
 insight: Insight
 isSelected: boolean
 onClick: () => void
 onDismiss: () => void
}

function InsightCard({ insight, isSelected, onClick, onDismiss }: InsightCardProps) {
 const catConfig = categoryConfig[insight.category]
 const priConfig = priorityConfig[insight.priority]

 return (
 <div
 className={`card rounded-xl border transition-all cursor-pointer ${
 isSelected 
 ? 'border-amber-500 ring-2 ring-amber-200' 
 : 'border-surface-200 dark:border-surface-700 hover:border-amber-300'
 }`}
 onClick={onClick}
 >
 <div className="p-4">
 {/* Header */}
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-2">
 <div className={`p-1.5 rounded-lg ${catConfig.bgColor}`}>
 <Icon icon={catConfig.icon} className={`w-4 h-4 ${catConfig.color}`} />
 </div>
 <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priConfig.bgColor} ${priConfig.color}`}>
 {priConfig.label}
 </span>
 {insight.status === 'new' && (
 <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
 New
 </span>
 )}
 </div>
 
 <button
 onClick={(e) => {
 e.stopPropagation()
 onDismiss()
 }}
 className="p-1 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
 </button>
 </div>

 {/* Content */}
 <h5 className="font-semibold text-secondary-900 dark:text-white mb-1 line-clamp-2">
 {insight.title}
 </h5>
 <p className="text-sm text-secondary-500 line-clamp-2 mb-3">
 {insight.description}
 </p>

 {/* Footer */}
 <div className="flex items-center justify-between text-xs">
 {insight.metric && (
 <span className="px-2 py-1 bg-surface-100 dark:bg-surface-800 text-secondary-600 rounded-md">
 {insight.metric}
 </span>
 )}
 
 <div className="flex items-center gap-2 text-secondary-400">
 {insight.changePercent !== undefined && (
 <span className={`flex items-center gap-0.5 ${
 insight.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
 }`}>
 <Icon 
 icon={insight.changePercent >= 0 ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} 
 className="w-3 h-3" 
 />
 {Math.abs(insight.changePercent).toFixed(1)}%
 </span>
 )}
 
 <span className="flex items-center gap-1">
 <Icon icon="solar:shield-check-linear" className="w-3 h-3" />
 {Math.round(insight.confidence * 100)}%
 </span>
 </div>
 </div>
 </div>
 </div>
 )
}

// Insight Detail Modal
interface InsightDetailModalProps {
 insight: Insight
 onClose: () => void
 onDismiss: () => void
}

function InsightDetailModal({ insight, onClose, onDismiss }: InsightDetailModalProps) {
 const catConfig = categoryConfig[insight.category]
 const priConfig = priorityConfig[insight.priority]

 return createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={onClose}
 />
 <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
 {/* Header */}
 <div className={`px-6 py-4 ${catConfig.bgColor}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white/30 rounded-lg">
 <Icon icon={catConfig.icon} className={`w-5 h-5 ${catConfig.color}`} />
 </div>
 <div>
 <span className="text-sm font-medium opacity-70">{catConfig.label}</span>
 <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${priConfig.bgColor} ${priConfig.color}`}>
 {priConfig.label}
 </span>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="p-6">
 <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
 {insight.title}
 </h2>
 <p className="text-secondary-600 dark:text-secondary-400 mb-4">
 {insight.description}
 </p>

 {insight.details && (
 <p className="text-sm text-secondary-500 mb-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
 {insight.details}
 </p>
 )}

 {/* Metrics */}
 <div className="grid grid-cols-3 gap-4 mb-6">
 {insight.value !== undefined && (
 <div className="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <p className="text-lg font-bold text-secondary-900 dark:text-white">
 {insight.value.toLocaleString()}
 </p>
 <p className="text-xs text-secondary-500">Current</p>
 </div>
 )}
 {insight.changePercent !== undefined && (
 <div className="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <p className={`text-lg font-bold ${
 insight.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
 }`}>
 {insight.changePercent >= 0 ? '+' : ''}{insight.changePercent.toFixed(1)}%
 </p>
 <p className="text-xs text-secondary-500">Change</p>
 </div>
 )}
 <div className="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
 <p className="text-lg font-bold text-secondary-900 dark:text-white">
 {Math.round(insight.confidence * 100)}%
 </p>
 <p className="text-xs text-secondary-500">Confidence</p>
 </div>
 </div>

 {/* Actions */}
 {insight.actions && insight.actions.length > 0 && (
 <div className="space-y-2 mb-6">
 <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
 Suggested Actions
 </p>
 <div className="flex flex-wrap gap-2">
 {insight.actions.map(action => (
 <button
 key={action.id}
 className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
 >
 <Icon icon={action.icon} className="w-4 h-4" />
 {action.label}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <span className="text-xs text-secondary-400">
 {new Date(insight.createdAt).toLocaleString()}
 </span>
 <div className="flex items-center gap-2">
 <button
 onClick={onDismiss}
 className="px-4 py-2 text-sm text-secondary-600 hover:text-secondary-800 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
 >
 Dismiss
 </button>
 <button
 onClick={onClose}
 className="px-4 py-2 text-sm bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
 >
 Got it
 </button>
 </div>
 </div>
 </div>
 </div>,
 document.body
 )
}

export default InsightsDashboard
