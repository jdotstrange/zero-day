/**
 * Smart Insights Engine - Types
 * Defines the structure for intelligent data insights
 */

// Insight categories
export type InsightCategory = 
 | 'trend'
 | 'anomaly'
 | 'correlation'
 | 'forecast'
 | 'pattern'
 | 'recommendation'
 | 'milestone'
 | 'warning'

// Insight priority levels
export type InsightPriority = 'low' | 'medium' | 'high' | 'critical'

// Insight status
export type InsightStatus = 'new' | 'viewed' | 'actioned' | 'dismissed'

// Core insight structure
export interface Insight {
 id: string
 category: InsightCategory
 priority: InsightPriority
 status: InsightStatus
 title: string
 description: string
 details?: string
 metric?: string
 value?: number
 previousValue?: number
 changePercent?: number
 trend?: 'up' | 'down' | 'stable'
 confidence: number // 0-1 confidence score
 impact?: 'positive' | 'negative' | 'neutral'
 actions?: InsightAction[]
 relatedMetrics?: string[]
 createdAt: string
 expiresAt?: string
 metadata?: Record<string, unknown>
}

// Actions that can be taken on an insight
export interface InsightAction {
 id: string
 label: string
 icon: string
 type: 'link' | 'action' | 'filter' | 'export'
 payload?: unknown
}

// Data point for analysis
export interface DataPoint {
 timestamp: number
 value: number
 label?: string
}

// Time series for analysis
export interface TimeSeries {
 id: string
 name: string
 data: DataPoint[]
 metadata?: Record<string, unknown>
}

// Trend analysis result
export interface TrendAnalysis {
 direction: 'up' | 'down' | 'stable'
 strength: number // 0-1
 slope: number
 rSquared: number
 changePercent: number
 startValue: number
 endValue: number
 period: {
 start: number
 end: number
 }
}

// Anomaly detection result
export interface AnomalyResult {
 isAnomaly: boolean
 point: DataPoint
 expectedValue: number
 deviation: number
 severity: InsightPriority
 type: 'spike' | 'drop' | 'outlier' | 'pattern_break'
}

// Pattern detection result
export interface PatternResult {
 type: 'seasonal' | 'cyclical' | 'weekly' | 'daily' | 'monthly' | 'recurring'
 period: number
 amplitude: number
 phase: number
 confidence: number
 description: string
}

// Correlation result
export interface CorrelationResult {
 series1: string
 series2: string
 coefficient: number // -1 to 1
 strength: 'weak' | 'moderate' | 'strong'
 direction: 'positive' | 'negative'
 lag: number // time lag for best correlation
 confidence: number
}

// Forecast result
export interface ForecastResult {
 predictions: DataPoint[]
 confidence: {
 upper: number[]
 lower: number[]
 }
 method: string
 accuracy: number
 horizon: number
}

// Milestone detection
export interface Milestone {
 type: 'all_time_high' | 'all_time_low' | 'threshold_crossed' | 'growth_milestone' | 'record_streak'
 value: number
 timestamp: number
 previousRecord?: number
 description: string
}

// Recommendation types
export interface Recommendation {
 id: string
 type: 'optimize' | 'investigate' | 'scale' | 'reduce' | 'monitor' | 'celebrate'
 title: string
 description: string
 reason: string
 expectedImpact?: string
 priority: InsightPriority
 metrics: string[]
 actions: InsightAction[]
}

// Analysis configuration
export interface AnalysisConfig {
 enableTrendDetection: boolean
 enableAnomalyDetection: boolean
 enablePatternDetection: boolean
 enableCorrelation: boolean
 enableForecast: boolean
 enableMilestones: boolean
 enableRecommendations: boolean
 anomalySensitivity: 'low' | 'medium' | 'high'
 trendWindow: number
 forecastHorizon: number
 significanceThreshold: number
}

// Metric definition for analysis
export interface MetricDefinition {
 id: string
 name: string
 category: string
 unit: string
 format: 'number' | 'currency' | 'percent' | 'duration'
 goodDirection: 'up' | 'down' | 'stable'
 thresholds?: {
 warning?: number
 critical?: number
 target?: number
 }
}

// Dashboard insight summary
export interface InsightSummary {
 totalInsights: number
 byCategory: Record<InsightCategory, number>
 byPriority: Record<InsightPriority, number>
 newCount: number
 actionableCount: number
 lastUpdated: string
}

// Insight filter options
export interface InsightFilter {
 categories?: InsightCategory[]
 priorities?: InsightPriority[]
 statuses?: InsightStatus[]
 metrics?: string[]
 dateRange?: {
 start: string
 end: string
 }
 searchQuery?: string
}
