/**
 * Smart Insights - Configuration
 * Presets, icons, and display options
 */

import type { InsightCategory, InsightPriority, MetricDefinition, AnalysisConfig } from './types'

// Category display configuration
export const categoryConfig: Record<InsightCategory, {
 label: string
 icon: string
 color: string
 bgColor: string
}> = {
 trend: {
 label: 'Trend',
 icon: 'solar:graph-up-linear',
 color: 'text-blue-600',
 bgColor: 'bg-blue-100'
 },
 anomaly: {
 label: 'Anomaly',
 icon: 'solar:danger-triangle-linear',
 color: 'text-orange-600',
 bgColor: 'bg-orange-100'
 },
 correlation: {
 label: 'Correlation',
 icon: 'solar:link-linear',
 color: 'text-purple-600',
 bgColor: 'bg-purple-100'
 },
 forecast: {
 label: 'Forecast',
 icon: 'solar:graph-new-linear',
 color: 'text-cyan-600',
 bgColor: 'bg-cyan-100'
 },
 pattern: {
 label: 'Pattern',
 icon: 'solar:tuning-square-2-linear',
 color: 'text-indigo-600',
 bgColor: 'bg-indigo-100'
 },
 recommendation: {
 label: 'Recommendation',
 icon: 'solar:lightbulb-linear',
 color: 'text-amber-600',
 bgColor: 'bg-amber-100'
 },
 milestone: {
 label: 'Milestone',
 icon: 'solar:flag-linear',
 color: 'text-green-600',
 bgColor: 'bg-green-100'
 },
 warning: {
 label: 'Warning',
 icon: 'solar:shield-warning-linear',
 color: 'text-red-600',
 bgColor: 'bg-red-100'
 }
}

// Priority display configuration
export const priorityConfig: Record<InsightPriority, {
 label: string
 color: string
 bgColor: string
 borderColor: string
}> = {
 low: {
 label: 'Low',
 color: 'text-secondary-600',
 bgColor: 'bg-surface-100',
 borderColor: 'border-surface-300'
 },
 medium: {
 label: 'Medium',
 color: 'text-blue-600',
 bgColor: 'bg-blue-100',
 borderColor: 'border-blue-300'
 },
 high: {
 label: 'High',
 color: 'text-orange-600',
 bgColor: 'bg-orange-100',
 borderColor: 'border-orange-300'
 },
 critical: {
 label: 'Critical',
 color: 'text-red-600',
 bgColor: 'bg-red-100',
 borderColor: 'border-red-300'
 }
}

// Sample metric definitions
export const sampleMetrics: MetricDefinition[] = [
 {
 id: 'revenue',
 name: 'Revenue',
 category: 'Sales',
 unit: '$',
 format: 'currency',
 goodDirection: 'up',
 thresholds: {
 warning: 8000,
 critical: 5000,
 target: 15000
 }
 },
 {
 id: 'users',
 name: 'Active Users',
 category: 'Engagement',
 unit: '',
 format: 'number',
 goodDirection: 'up',
 thresholds: {
 warning: 1000,
 critical: 500,
 target: 5000
 }
 },
 {
 id: 'conversion',
 name: 'Conversion Rate',
 category: 'Sales',
 unit: '%',
 format: 'percent',
 goodDirection: 'up',
 thresholds: {
 warning: 2,
 critical: 1,
 target: 5
 }
 },
 {
 id: 'churn',
 name: 'Churn Rate',
 category: 'Retention',
 unit: '%',
 format: 'percent',
 goodDirection: 'down',
 thresholds: {
 warning: 5,
 critical: 10,
 target: 2
 }
 },
 {
 id: 'response_time',
 name: 'Response Time',
 category: 'Performance',
 unit: 'ms',
 format: 'duration',
 goodDirection: 'down',
 thresholds: {
 warning: 500,
 critical: 1000,
 target: 200
 }
 },
 {
 id: 'error_rate',
 name: 'Error Rate',
 category: 'Performance',
 unit: '%',
 format: 'percent',
 goodDirection: 'down',
 thresholds: {
 warning: 1,
 critical: 5,
 target: 0.1
 }
 },
 {
 id: 'nps',
 name: 'NPS Score',
 category: 'Customer',
 unit: '',
 format: 'number',
 goodDirection: 'up',
 thresholds: {
 warning: 30,
 critical: 0,
 target: 70
 }
 },
 {
 id: 'orders',
 name: 'Daily Orders',
 category: 'Sales',
 unit: '',
 format: 'number',
 goodDirection: 'up',
 thresholds: {
 warning: 50,
 critical: 20,
 target: 200
 }
 }
]

// Analysis presets
export const analysisPresets: { id: string; name: string; config: Partial<AnalysisConfig> }[] = [
 {
 id: 'quick',
 name: 'Quick Analysis',
 config: {
 enableTrendDetection: true,
 enableAnomalyDetection: true,
 enablePatternDetection: false,
 enableCorrelation: false,
 enableForecast: false,
 enableMilestones: true,
 enableRecommendations: false,
 trendWindow: 14,
 anomalySensitivity: 'medium'
 }
 },
 {
 id: 'comprehensive',
 name: 'Comprehensive Analysis',
 config: {
 enableTrendDetection: true,
 enableAnomalyDetection: true,
 enablePatternDetection: true,
 enableCorrelation: true,
 enableForecast: true,
 enableMilestones: true,
 enableRecommendations: true,
 trendWindow: 30,
 forecastHorizon: 14,
 anomalySensitivity: 'medium'
 }
 },
 {
 id: 'sensitive',
 name: 'High Sensitivity',
 config: {
 enableTrendDetection: true,
 enableAnomalyDetection: true,
 enablePatternDetection: true,
 enableCorrelation: false,
 enableForecast: false,
 enableMilestones: true,
 enableRecommendations: true,
 trendWindow: 7,
 anomalySensitivity: 'high'
 }
 },
 {
 id: 'forecast',
 name: 'Forecast Focus',
 config: {
 enableTrendDetection: true,
 enableAnomalyDetection: false,
 enablePatternDetection: true,
 enableCorrelation: false,
 enableForecast: true,
 enableMilestones: false,
 enableRecommendations: true,
 trendWindow: 30,
 forecastHorizon: 30
 }
 }
]

// Generate sample time series data
export function generateSampleData(
 days: number = 90,
 baseValue: number = 1000,
 volatility: number = 50,
 trend: number = 0.5,
 addAnomalies: boolean = true
): { timestamp: number; value: number }[] {
 const data: { timestamp: number; value: number }[] = []
 const now = Date.now()
 const dayMs = 24 * 60 * 60 * 1000

 let value = baseValue

 for (let i = days; i >= 0; i--) {
 // Add trend
 value += trend

 // Add seasonality (weekly pattern)
 const dayOfWeek = new Date(now - i * dayMs).getDay()
 const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.1
 
 // Add random noise
 const noise = (Math.random() - 0.5) * 2 * volatility

 // Occasional anomalies
 let anomalyFactor = 1
 if (addAnomalies && Math.random() < 0.02) {
 anomalyFactor = Math.random() > 0.5 ? 1.5 : 0.6
 }

 const finalValue = Math.max(0, (value + noise) * weekendFactor * anomalyFactor)

 data.push({
 timestamp: now - i * dayMs,
 value: Number(finalValue.toFixed(2))
 })
 }

 return data
}

// Format value based on metric definition
export function formatMetricValue(value: number, metric?: MetricDefinition): string {
 if (!metric) {
 return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
 }

 switch (metric.format) {
 case 'currency':
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: 'USD',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0
 }).format(value)
 
 case 'percent':
 return `${value.toFixed(2)}%`
 
 case 'duration':
 if (value < 1000) return `${value.toFixed(0)}ms`
 return `${(value / 1000).toFixed(2)}s`
 
 default:
 return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
 }
}

// Get metric by ID
export function getMetricById(id: string): MetricDefinition | undefined {
 return sampleMetrics.find(m => m.id === id)
}

// Get metrics by category
export function getMetricsByCategory(): Record<string, MetricDefinition[]> {
 return sampleMetrics.reduce((acc, metric) => {
 if (!acc[metric.category]) {
 acc[metric.category] = []
 }
 acc[metric.category].push(metric)
 return acc
 }, {} as Record<string, MetricDefinition[]>)
}
