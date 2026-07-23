/**
 * Smart Insights Hook
 * React hook for managing insights state and analysis
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { 
 Insight, 
 InsightCategory, 
 InsightPriority, 
 InsightStatus,
 TimeSeries,
 AnalysisConfig,
 MetricDefinition,
 InsightSummary
} from './types'
import { 
 generateInsights, 
 sortInsights, 
 filterInsights,
 defaultAnalysisConfig
} from './engine'
import { sampleMetrics, generateSampleData } from './config'

// localStorage keys
const DISMISSED_KEY = 'zeroday_dismissed_insights'

export interface UseInsightsState {
 insights: Insight[]
 filteredInsights: Insight[]
 summary: InsightSummary
 isAnalyzing: boolean
 lastAnalyzed: string | null
 selectedInsight: Insight | null
 config: AnalysisConfig
 
 // Filters
 categoryFilter: InsightCategory[]
 priorityFilter: InsightPriority[]
 statusFilter: InsightStatus[]
 searchQuery: string
}

export interface UseInsightsActions {
 // Analysis
 analyzeData: (series: TimeSeries, metric?: MetricDefinition) => void
 analyzeMultiple: (seriesList: TimeSeries[], metrics?: Map<string, MetricDefinition>) => void
 runDemoAnalysis: () => void
 
 // Insight management
 selectInsight: (insight: Insight | null) => void
 updateInsightStatus: (insightId: string, status: InsightStatus) => void
 dismissInsight: (insightId: string) => void
 dismissAll: (category?: InsightCategory) => void
 clearInsights: () => void
 
 // Filtering
 setCategoryFilter: (categories: InsightCategory[]) => void
 setPriorityFilter: (priorities: InsightPriority[]) => void
 setStatusFilter: (statuses: InsightStatus[]) => void
 setSearchQuery: (query: string) => void
 clearFilters: () => void
 
 // Configuration
 updateConfig: (config: Partial<AnalysisConfig>) => void
 resetConfig: () => void
 
 // Export
 exportInsights: (format: 'json' | 'csv') => string
}

export interface UseInsightsReturn extends UseInsightsState, UseInsightsActions {}

export function useInsights(initialConfig?: Partial<AnalysisConfig>): UseInsightsReturn {
 // State
 const [insights, setInsights] = useState<Insight[]>([])
 const [isAnalyzing, setIsAnalyzing] = useState(false)
 const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)
 const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
 const [config, setConfig] = useState<AnalysisConfig>({
 ...defaultAnalysisConfig,
 ...initialConfig
 })
 
 // Filters
 const [categoryFilter, setCategoryFilter] = useState<InsightCategory[]>([])
 const [priorityFilter, setPriorityFilter] = useState<InsightPriority[]>([])
 const [statusFilter, setStatusFilter] = useState<InsightStatus[]>([])
 const [searchQuery, setSearchQuery] = useState('')

 // Load dismissed insights from localStorage
 const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

 useEffect(() => {
 try {
 const stored = localStorage.getItem(DISMISSED_KEY)
 if (stored) {
 setDismissedIds(new Set(JSON.parse(stored)))
 }
 } catch (err) {
 console.error('Failed to load dismissed insights:', err)
 }
 }, [])

 // Save dismissed IDs to localStorage
 const persistDismissed = useCallback((ids: Set<string>) => {
 try {
 localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]))
 } catch (err) {
 console.error('Failed to save dismissed insights:', err)
 }
 }, [])

 // Filtered insights
 const filteredInsights = useMemo(() => {
 let result = insights.filter(i => !dismissedIds.has(i.id))

 if (statusFilter.length > 0 && !statusFilter.includes('dismissed')) {
 result = result.filter(i => statusFilter.includes(i.status))
 }

 result = filterInsights(result, {
 categories: categoryFilter.length > 0 ? categoryFilter : undefined,
 priorities: priorityFilter.length > 0 ? priorityFilter : undefined,
 search: searchQuery || undefined
 })

 return sortInsights(result)
 }, [insights, dismissedIds, categoryFilter, priorityFilter, statusFilter, searchQuery])

 // Summary
 const summary = useMemo((): InsightSummary => {
 const activeInsights = insights.filter(i => !dismissedIds.has(i.id))
 
 const byCategory = {} as Record<InsightCategory, number>
 const byPriority = {} as Record<InsightPriority, number>
 let newCount = 0
 let actionableCount = 0

 for (const insight of activeInsights) {
 byCategory[insight.category] = (byCategory[insight.category] || 0) + 1
 byPriority[insight.priority] = (byPriority[insight.priority] || 0) + 1
 if (insight.status === 'new') newCount++
 if (insight.actions && insight.actions.length > 0) actionableCount++
 }

 return {
 totalInsights: activeInsights.length,
 byCategory,
 byPriority,
 newCount,
 actionableCount,
 lastUpdated: lastAnalyzed || new Date().toISOString()
 }
 }, [insights, dismissedIds, lastAnalyzed])

 // Analysis actions
 const analyzeData = useCallback((series: TimeSeries, metric?: MetricDefinition) => {
 setIsAnalyzing(true)

 try {
 const newInsights = generateInsights(series, config, metric)
 setInsights(prev => [...prev, ...newInsights])
 setLastAnalyzed(new Date().toISOString())
 } catch (err) {
 console.error('Analysis failed:', err)
 } finally {
 setIsAnalyzing(false)
 }
 }, [config])

 const analyzeMultiple = useCallback((
 seriesList: TimeSeries[], 
 metrics?: Map<string, MetricDefinition>
 ) => {
 setIsAnalyzing(true)

 try {
 const allInsights: Insight[] = []

 for (const series of seriesList) {
 const metric = metrics?.get(series.id)
 const newInsights = generateInsights(series, config, metric)
 allInsights.push(...newInsights)
 }

 setInsights(prev => [...prev, ...allInsights])
 setLastAnalyzed(new Date().toISOString())
 } catch (err) {
 console.error('Multi-series analysis failed:', err)
 } finally {
 setIsAnalyzing(false)
 }
 }, [config])

 const runDemoAnalysis = useCallback(() => {
 setIsAnalyzing(true)
 setInsights([]) // Clear existing

 try {
 const allInsights: Insight[] = []

 // Generate sample data and analyze for each metric
 for (const metric of sampleMetrics) {
 const data = generateSampleData(
 90,
 metric.id === 'revenue' ? 10000 : 
 metric.id === 'users' ? 2000 :
 metric.id === 'conversion' ? 3 :
 metric.id === 'churn' ? 4 :
 metric.id === 'response_time' ? 300 :
 metric.id === 'error_rate' ? 0.5 :
 metric.id === 'nps' ? 45 :
 100,
 metric.id === 'revenue' ? 500 :
 metric.id === 'users' ? 100 :
 10,
 metric.goodDirection === 'up' ? 2 : -0.5
 )

 const series: TimeSeries = {
 id: metric.id,
 name: metric.name,
 data
 }

 const newInsights = generateInsights(series, config, metric)
 allInsights.push(...newInsights)
 }

 setInsights(allInsights)
 setLastAnalyzed(new Date().toISOString())
 } catch (err) {
 console.error('Demo analysis failed:', err)
 } finally {
 setIsAnalyzing(false)
 }
 }, [config])

 // Insight management
 const selectInsight = useCallback((insight: Insight | null) => {
 setSelectedInsight(insight)
 
 // Mark as viewed
 if (insight && insight.status === 'new') {
 setInsights(prev => prev.map(i => 
 i.id === insight.id ? { ...i, status: 'viewed' as InsightStatus } : i
 ))
 }
 }, [])

 const updateInsightStatus = useCallback((insightId: string, status: InsightStatus) => {
 setInsights(prev => prev.map(i => 
 i.id === insightId ? { ...i, status } : i
 ))
 }, [])

 const dismissInsight = useCallback((insightId: string) => {
 setDismissedIds(prev => {
 const newSet = new Set(prev)
 newSet.add(insightId)
 persistDismissed(newSet)
 return newSet
 })
 
 if (selectedInsight?.id === insightId) {
 setSelectedInsight(null)
 }
 }, [selectedInsight, persistDismissed])

 const dismissAll = useCallback((category?: InsightCategory) => {
 const toDisimiss = category 
 ? insights.filter(i => i.category === category).map(i => i.id)
 : insights.map(i => i.id)

 setDismissedIds(prev => {
 const newSet = new Set([...prev, ...toDisimiss])
 persistDismissed(newSet)
 return newSet
 })
 
 setSelectedInsight(null)
 }, [insights, persistDismissed])

 const clearInsights = useCallback(() => {
 setInsights([])
 setDismissedIds(new Set())
 setSelectedInsight(null)
 localStorage.removeItem(DISMISSED_KEY)
 }, [])

 // Filter actions
 const clearFilters = useCallback(() => {
 setCategoryFilter([])
 setPriorityFilter([])
 setStatusFilter([])
 setSearchQuery('')
 }, [])

 // Configuration
 const updateConfig = useCallback((updates: Partial<AnalysisConfig>) => {
 setConfig(prev => ({ ...prev, ...updates }))
 }, [])

 const resetConfig = useCallback(() => {
 setConfig(defaultAnalysisConfig)
 }, [])

 // Export
 const exportInsights = useCallback((format: 'json' | 'csv'): string => {
 if (format === 'json') {
 return JSON.stringify(filteredInsights, null, 2)
 }

 // CSV export
 const headers = [
 'ID', 'Category', 'Priority', 'Status', 'Title', 
 'Description', 'Metric', 'Value', 'Change %', 'Confidence', 'Created'
 ].join(',')

 const rows = filteredInsights.map(i => [
 i.id,
 i.category,
 i.priority,
 i.status,
 `"${i.title.replace(/"/g, '""')}"`,
 `"${i.description.replace(/"/g, '""')}"`,
 i.metric || '',
 i.value?.toString() || '',
 i.changePercent?.toString() || '',
 i.confidence.toString(),
 i.createdAt
 ].join(','))

 return [headers, ...rows].join('\n')
 }, [filteredInsights])

 return {
 // State
 insights,
 filteredInsights,
 summary,
 isAnalyzing,
 lastAnalyzed,
 selectedInsight,
 config,
 categoryFilter,
 priorityFilter,
 statusFilter,
 searchQuery,

 // Actions
 analyzeData,
 analyzeMultiple,
 runDemoAnalysis,
 selectInsight,
 updateInsightStatus,
 dismissInsight,
 dismissAll,
 clearInsights,
 setCategoryFilter,
 setPriorityFilter,
 setStatusFilter,
 setSearchQuery,
 clearFilters,
 updateConfig,
 resetConfig,
 exportInsights
 }
}

export default useInsights
