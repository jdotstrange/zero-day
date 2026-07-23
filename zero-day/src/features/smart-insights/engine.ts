/**
 * Smart Insights Engine - Core Analysis
 * Intelligent data analysis and insight generation
 */

import type {
 Insight,
 InsightCategory,
 InsightPriority,
 DataPoint,
 TimeSeries,
 TrendAnalysis,
 AnomalyResult,
 PatternResult,
 CorrelationResult,
 ForecastResult,
 Milestone,
 Recommendation,
 AnalysisConfig,
 MetricDefinition
} from './types'

/**
 * Generate unique ID
 */
export function generateId(): string {
 return `insight_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Default analysis configuration
 */
export const defaultAnalysisConfig: AnalysisConfig = {
 enableTrendDetection: true,
 enableAnomalyDetection: true,
 enablePatternDetection: true,
 enableCorrelation: true,
 enableForecast: true,
 enableMilestones: true,
 enableRecommendations: true,
 anomalySensitivity: 'medium',
 trendWindow: 30,
 forecastHorizon: 7,
 significanceThreshold: 0.05
}

/**
 * Analyze trend in time series data
 */
export function analyzeTrend(data: DataPoint[], window?: number): TrendAnalysis {
 const subset = window ? data.slice(-window) : data
 
 if (subset.length < 2) {
 return {
 direction: 'stable',
 strength: 0,
 slope: 0,
 rSquared: 0,
 changePercent: 0,
 startValue: subset[0]?.value || 0,
 endValue: subset[0]?.value || 0,
 period: {
 start: subset[0]?.timestamp || Date.now(),
 end: subset[0]?.timestamp || Date.now()
 }
 }
 }

 const n = subset.length
 const values = subset.map(d => d.value)
 const xMean = (n - 1) / 2
 const yMean = values.reduce((a, b) => a + b, 0) / n

 // Calculate slope using linear regression
 let numerator = 0
 let denominator = 0

 for (let i = 0; i < n; i++) {
 numerator += (i - xMean) * (values[i] - yMean)
 denominator += Math.pow(i - xMean, 2)
 }

 const slope = denominator === 0 ? 0 : numerator / denominator
 
 // Calculate R-squared
 const predictions = values.map((_, i) => yMean + slope * (i - xMean))
 const ssRes = values.reduce((acc, v, i) => acc + Math.pow(v - predictions[i], 2), 0)
 const ssTot = values.reduce((acc, v) => acc + Math.pow(v - yMean, 2), 0)
 const rSquared = ssTot === 0 ? 0 : Math.max(0, 1 - ssRes / ssTot)

 // Normalize slope
 const normalizedSlope = yMean !== 0 ? slope / yMean : 0
 const strength = Math.min(1, Math.abs(normalizedSlope) * rSquared * 10)

 // Determine direction
 let direction: 'up' | 'down' | 'stable' = 'stable'
 if (Math.abs(normalizedSlope) > 0.001) {
 direction = normalizedSlope > 0 ? 'up' : 'down'
 }

 const startValue = values[0]
 const endValue = values[n - 1]
 const changePercent = startValue !== 0 ? ((endValue - startValue) / startValue) * 100 : 0

 return {
 direction,
 strength: Number(strength.toFixed(3)),
 slope: Number(slope.toFixed(4)),
 rSquared: Number(rSquared.toFixed(4)),
 changePercent: Number(changePercent.toFixed(2)),
 startValue,
 endValue,
 period: {
 start: subset[0].timestamp,
 end: subset[n - 1].timestamp
 }
 }
}

/**
 * Detect anomalies in data
 */
export function detectAnomalies(
 data: DataPoint[],
 sensitivity: 'low' | 'medium' | 'high' = 'medium'
): AnomalyResult[] {
 if (data.length < 10) return []

 const values = data.map(d => d.value)
 const mean = values.reduce((a, b) => a + b, 0) / values.length
 const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
 const stdDev = Math.sqrt(variance)

 if (stdDev === 0) return []

 const thresholds = {
 low: 3.5,
 medium: 2.5,
 high: 2
 }

 const threshold = thresholds[sensitivity]
 const anomalies: AnomalyResult[] = []

 for (const point of data) {
 const zScore = Math.abs((point.value - mean) / stdDev)

 if (zScore > threshold) {
 const severity = getSeverity(zScore, sensitivity)
 const type = point.value > mean ? 'spike' : 'drop'

 anomalies.push({
 isAnomaly: true,
 point,
 expectedValue: mean,
 deviation: Number(zScore.toFixed(2)),
 severity,
 type
 })
 }
 }

 return anomalies
}

/**
 * Get severity based on Z-score
 */
function getSeverity(zScore: number, sensitivity: 'low' | 'medium' | 'high'): InsightPriority {
 const thresholds = {
 low: { medium: 4, high: 5, critical: 6 },
 medium: { medium: 3, high: 4, critical: 5 },
 high: { medium: 2.5, high: 3, critical: 4 }
 }

 const t = thresholds[sensitivity]
 if (zScore >= t.critical) return 'critical'
 if (zScore >= t.high) return 'high'
 if (zScore >= t.medium) return 'medium'
 return 'low'
}

/**
 * Detect patterns in data (seasonality)
 */
export function detectPatterns(data: DataPoint[]): PatternResult[] {
 if (data.length < 20) return []

 const patterns: PatternResult[] = []
 const values = data.map(d => d.value)
 const n = values.length

 // Test common periods
 const periodsToTest = [7, 14, 30, 60, 90]

 for (const period of periodsToTest) {
 if (n < period * 2) continue

 const autocorr = calculateAutocorrelation(values, period)
 
 if (autocorr > 0.5) {
 // Calculate amplitude
 const chunks: number[][] = []
 for (let i = 0; i < n - period; i += period) {
 chunks.push(values.slice(i, i + period))
 }

 let avgAmplitude = 0
 for (const chunk of chunks) {
 avgAmplitude += (Math.max(...chunk) - Math.min(...chunk)) / 2
 }
 avgAmplitude /= chunks.length

 patterns.push({
 type: getPeriodType(period),
 period,
 amplitude: Number(avgAmplitude.toFixed(2)),
 phase: 0,
 confidence: Number(autocorr.toFixed(2)),
 description: `${getPeriodType(period)} pattern detected with ${Math.round(autocorr * 100)}% confidence`
 })
 }
 }

 return patterns
}

/**
 * Calculate autocorrelation for a given lag
 */
function calculateAutocorrelation(values: number[], lag: number): number {
 const n = values.length
 if (lag >= n) return 0

 const mean = values.reduce((a, b) => a + b, 0) / n
 let numerator = 0
 let denominator = 0

 for (let i = 0; i < n - lag; i++) {
 numerator += (values[i] - mean) * (values[i + lag] - mean)
 }

 for (let i = 0; i < n; i++) {
 denominator += Math.pow(values[i] - mean, 2)
 }

 return denominator === 0 ? 0 : numerator / denominator
}

/**
 * Get period type name
 */
function getPeriodType(period: number): PatternResult['type'] {
 if (period <= 7) return 'weekly'
 if (period <= 14) return 'cyclical'
 if (period <= 31) return 'monthly'
 return 'seasonal'
}

/**
 * Calculate correlation between two time series
 */
export function calculateCorrelation(
 series1: DataPoint[],
 series2: DataPoint[]
): CorrelationResult | null {
 const n = Math.min(series1.length, series2.length)
 if (n < 10) return null

 const values1 = series1.slice(-n).map(d => d.value)
 const values2 = series2.slice(-n).map(d => d.value)

 const mean1 = values1.reduce((a, b) => a + b, 0) / n
 const mean2 = values2.reduce((a, b) => a + b, 0) / n

 let numerator = 0
 let denom1 = 0
 let denom2 = 0

 for (let i = 0; i < n; i++) {
 const diff1 = values1[i] - mean1
 const diff2 = values2[i] - mean2
 numerator += diff1 * diff2
 denom1 += diff1 * diff1
 denom2 += diff2 * diff2
 }

 const denominator = Math.sqrt(denom1 * denom2)
 const coefficient = denominator === 0 ? 0 : numerator / denominator

 const absCoeff = Math.abs(coefficient)
 let strength: CorrelationResult['strength'] = 'weak'
 if (absCoeff >= 0.7) strength = 'strong'
 else if (absCoeff >= 0.4) strength = 'moderate'

 return {
 series1: '',
 series2: '',
 coefficient: Number(coefficient.toFixed(3)),
 strength,
 direction: coefficient >= 0 ? 'positive' : 'negative',
 lag: 0,
 confidence: Number(absCoeff.toFixed(2))
 }
}

/**
 * Simple forecasting using exponential smoothing
 */
export function generateForecast(
 data: DataPoint[],
 horizon: number = 7
): ForecastResult {
 if (data.length < 5) {
 return {
 predictions: [],
 confidence: { upper: [], lower: [] },
 method: 'exponential_smoothing',
 accuracy: 0,
 horizon
 }
 }

 const values = data.map(d => d.value)
 const alpha = 0.3 // Smoothing factor

 // Calculate EMA
 const ema: number[] = [values[0]]
 for (let i = 1; i < values.length; i++) {
 ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1])
 }

 // Calculate trend
 const trend = analyzeTrend(data, 14)
 const trendPerPeriod = trend.slope

 // Generate predictions
 const lastValue = ema[ema.length - 1]
 const lastTimestamp = data[data.length - 1].timestamp
 const predictions: DataPoint[] = []
 const upper: number[] = []
 const lower: number[] = []

 // Calculate historical error for confidence intervals
 const errors: number[] = []
 for (let i = 1; i < values.length; i++) {
 errors.push(values[i] - ema[i - 1])
 }
 const errorStdDev = Math.sqrt(
 errors.reduce((acc, e) => acc + e * e, 0) / errors.length
 )

 for (let i = 1; i <= horizon; i++) {
 const predicted = lastValue + trendPerPeriod * i
 const uncertainty = errorStdDev * Math.sqrt(i) * 1.96

 predictions.push({
 timestamp: lastTimestamp + i * 86400000, // Daily intervals
 value: Number(predicted.toFixed(2)),
 label: `Day +${i}`
 })
 upper.push(Number((predicted + uncertainty).toFixed(2)))
 lower.push(Number((predicted - uncertainty).toFixed(2)))
 }

 // Calculate simple accuracy metric
 const accuracy = 1 - (errorStdDev / (lastValue || 1))

 return {
 predictions,
 confidence: { upper, lower },
 method: 'exponential_smoothing',
 accuracy: Math.max(0, Math.min(1, Number(accuracy.toFixed(2)))),
 horizon
 }
}

/**
 * Detect milestones in data
 */
export function detectMilestones(data: DataPoint[], metric?: MetricDefinition): Milestone[] {
 if (data.length < 2) return []

 const milestones: Milestone[] = []
 const values = data.map(d => d.value)
 const timestamps = data.map(d => d.timestamp)

 // All-time high
 const maxValue = Math.max(...values)
 const maxIndex = values.lastIndexOf(maxValue)
 if (maxIndex === values.length - 1 || maxIndex >= values.length - 3) {
 const previousMax = Math.max(...values.slice(0, -1))
 if (maxValue > previousMax) {
 milestones.push({
 type: 'all_time_high',
 value: maxValue,
 timestamp: timestamps[maxIndex],
 previousRecord: previousMax,
 description: `New all-time high of ${maxValue.toLocaleString()}`
 })
 }
 }

 // All-time low
 const minValue = Math.min(...values)
 const minIndex = values.lastIndexOf(minValue)
 if (minIndex === values.length - 1 || minIndex >= values.length - 3) {
 const previousMin = Math.min(...values.slice(0, -1))
 if (minValue < previousMin) {
 milestones.push({
 type: 'all_time_low',
 value: minValue,
 timestamp: timestamps[minIndex],
 previousRecord: previousMin,
 description: `New all-time low of ${minValue.toLocaleString()}`
 })
 }
 }

 // Threshold crossing
 if (metric?.thresholds) {
 const lastValue = values[values.length - 1]
 const prevValue = values[values.length - 2]

 if (metric.thresholds.target !== undefined) {
 if (lastValue >= metric.thresholds.target && prevValue < metric.thresholds.target) {
 milestones.push({
 type: 'threshold_crossed',
 value: lastValue,
 timestamp: timestamps[timestamps.length - 1],
 description: `Reached target of ${metric.thresholds.target.toLocaleString()}`
 })
 }
 }
 }

 // Growth milestones (doubles, triples, etc.)
 const firstValue = values[0]
 const lastValue = values[values.length - 1]
 if (firstValue > 0) {
 const growthMultiple = Math.floor(lastValue / firstValue)
 if (growthMultiple >= 2) {
 milestones.push({
 type: 'growth_milestone',
 value: lastValue,
 timestamp: timestamps[timestamps.length - 1],
 previousRecord: firstValue,
 description: `Value has ${growthMultiple}x since start`
 })
 }
 }

 return milestones
}

/**
 * Generate recommendations based on analysis
 */
export function generateRecommendations(
 series: TimeSeries,
 trend: TrendAnalysis,
 anomalies: AnomalyResult[],
 metric?: MetricDefinition
): Recommendation[] {
 const recommendations: Recommendation[] = []

 // Strong upward trend
 if (trend.direction === 'up' && trend.strength > 0.6) {
 const isPositive = metric?.goodDirection === 'up'
 
 if (isPositive) {
 recommendations.push({
 id: generateId(),
 type: 'celebrate',
 title: 'Strong Growth Detected',
 description: `${series.name} is showing strong growth of ${trend.changePercent.toFixed(1)}%`,
 reason: 'Consistent upward trend with high confidence',
 expectedImpact: 'Continued growth if trend persists',
 priority: 'medium',
 metrics: [series.id],
 actions: [
 { id: '1', label: 'View Details', icon: 'solar:eye-linear', type: 'link' },
 { id: '2', label: 'Set Alert', icon: 'solar:bell-linear', type: 'action' }
 ]
 })
 } else if (metric?.goodDirection === 'down') {
 recommendations.push({
 id: generateId(),
 type: 'investigate',
 title: 'Rising Metric Needs Attention',
 description: `${series.name} is increasing by ${trend.changePercent.toFixed(1)}% when it should be decreasing`,
 reason: 'Metric moving in undesired direction',
 expectedImpact: 'May impact performance if not addressed',
 priority: 'high',
 metrics: [series.id],
 actions: [
 { id: '1', label: 'Investigate', icon: 'solar:magnifer-linear', type: 'link' }
 ]
 })
 }
 }

 // Strong downward trend
 if (trend.direction === 'down' && trend.strength > 0.6) {
 const isNegative = metric?.goodDirection === 'up'
 
 if (isNegative) {
 recommendations.push({
 id: generateId(),
 type: 'investigate',
 title: 'Declining Metric Detected',
 description: `${series.name} has dropped ${Math.abs(trend.changePercent).toFixed(1)}%`,
 reason: 'Significant decline in key metric',
 expectedImpact: 'Potential negative impact on goals',
 priority: 'high',
 metrics: [series.id],
 actions: [
 { id: '1', label: 'Analyze Cause', icon: 'solar:magnifer-linear', type: 'link' },
 { id: '2', label: 'Compare Periods', icon: 'solar:chart-2-linear', type: 'action' }
 ]
 })
 }
 }

 // Anomaly recommendations
 const criticalAnomalies = anomalies.filter(a => a.severity === 'critical')
 if (criticalAnomalies.length > 0) {
 recommendations.push({
 id: generateId(),
 type: 'investigate',
 title: 'Critical Anomalies Detected',
 description: `${criticalAnomalies.length} critical anomalies found in ${series.name}`,
 reason: 'Unusual data patterns that require attention',
 priority: 'critical',
 metrics: [series.id],
 actions: [
 { id: '1', label: 'Review Anomalies', icon: 'solar:danger-triangle-linear', type: 'link' }
 ]
 })
 }

 // Threshold warnings
 if (metric?.thresholds?.warning !== undefined) {
 const lastValue = series.data[series.data.length - 1]?.value
 if (lastValue !== undefined && lastValue >= metric.thresholds.warning) {
 recommendations.push({
 id: generateId(),
 type: 'monitor',
 title: 'Approaching Threshold',
 description: `${series.name} is at ${lastValue.toFixed(1)}, approaching warning level`,
 reason: 'Value is nearing warning threshold',
 expectedImpact: 'May trigger alerts if continues',
 priority: lastValue >= (metric.thresholds.critical || Infinity) ? 'critical' : 'high',
 metrics: [series.id],
 actions: [
 { id: '1', label: 'Set Alert', icon: 'solar:bell-linear', type: 'action' }
 ]
 })
 }
 }

 return recommendations
}

/**
 * Generate insights from analysis results
 */
export function generateInsights(
 series: TimeSeries,
 config: AnalysisConfig = defaultAnalysisConfig,
 metric?: MetricDefinition
): Insight[] {
 const insights: Insight[] = []
 const now = new Date().toISOString()

 // Trend insights
 if (config.enableTrendDetection) {
 const trend = analyzeTrend(series.data, config.trendWindow)
 
 if (trend.direction !== 'stable' && trend.strength > 0.3) {
 const isPositive = metric?.goodDirection === trend.direction
 
 insights.push({
 id: generateId(),
 category: 'trend',
 priority: trend.strength > 0.7 ? 'high' : 'medium',
 status: 'new',
 title: `${series.name} is ${trend.direction === 'up' ? 'increasing' : 'decreasing'}`,
 description: `${Math.abs(trend.changePercent).toFixed(1)}% change over the analysis period`,
 details: `Linear trend with R² of ${(trend.rSquared * 100).toFixed(0)}%`,
 metric: series.name,
 value: trend.endValue,
 previousValue: trend.startValue,
 changePercent: trend.changePercent,
 trend: trend.direction,
 confidence: trend.rSquared,
 impact: isPositive ? 'positive' : (isPositive === false ? 'negative' : 'neutral'),
 createdAt: now
 })
 }
 }

 // Anomaly insights
 if (config.enableAnomalyDetection) {
 const anomalies = detectAnomalies(series.data, config.anomalySensitivity)
 
 for (const anomaly of anomalies.slice(-5)) {
 insights.push({
 id: generateId(),
 category: 'anomaly',
 priority: anomaly.severity,
 status: 'new',
 title: `${anomaly.type === 'spike' ? 'Spike' : 'Drop'} detected in ${series.name}`,
 description: `Value ${anomaly.point.value.toFixed(2)} is ${anomaly.deviation.toFixed(1)}σ from expected`,
 metric: series.name,
 value: anomaly.point.value,
 previousValue: anomaly.expectedValue,
 confidence: Math.min(1, anomaly.deviation / 5),
 impact: anomaly.type === 'spike' ? 
 (metric?.goodDirection === 'up' ? 'positive' : 'negative') :
 (metric?.goodDirection === 'down' ? 'positive' : 'negative'),
 createdAt: now
 })
 }
 }

 // Pattern insights
 if (config.enablePatternDetection) {
 const patterns = detectPatterns(series.data)
 
 for (const pattern of patterns) {
 insights.push({
 id: generateId(),
 category: 'pattern',
 priority: 'low',
 status: 'new',
 title: `${pattern.type} pattern found`,
 description: pattern.description,
 metric: series.name,
 confidence: pattern.confidence,
 impact: 'neutral',
 createdAt: now
 })
 }
 }

 // Milestone insights
 if (config.enableMilestones) {
 const milestones = detectMilestones(series.data, metric)
 
 for (const milestone of milestones) {
 insights.push({
 id: generateId(),
 category: 'milestone',
 priority: 'high',
 status: 'new',
 title: milestone.description,
 description: milestone.type === 'all_time_high' ? 
 'New record value achieved!' : 
 milestone.type === 'all_time_low' ?
 'New minimum value recorded' :
 'Significant milestone reached',
 metric: series.name,
 value: milestone.value,
 previousValue: milestone.previousRecord,
 confidence: 1,
 impact: milestone.type === 'all_time_high' ? 
 (metric?.goodDirection === 'up' ? 'positive' : 'negative') :
 'neutral',
 createdAt: now
 })
 }
 }

 // Forecast insights
 if (config.enableForecast) {
 const forecast = generateForecast(series.data, config.forecastHorizon)
 
 if (forecast.predictions.length > 0) {
 const lastActual = series.data[series.data.length - 1]?.value || 0
 const predictedEnd = forecast.predictions[forecast.predictions.length - 1]?.value || 0
 const expectedChange = lastActual !== 0 ? 
 ((predictedEnd - lastActual) / lastActual) * 100 : 0

 insights.push({
 id: generateId(),
 category: 'forecast',
 priority: 'medium',
 status: 'new',
 title: `${series.name} forecast: ${expectedChange >= 0 ? '+' : ''}${expectedChange.toFixed(1)}%`,
 description: `Expected to reach ${predictedEnd.toFixed(2)} in ${config.forecastHorizon} days`,
 metric: series.name,
 value: predictedEnd,
 previousValue: lastActual,
 changePercent: expectedChange,
 confidence: forecast.accuracy,
 impact: expectedChange > 0 ?
 (metric?.goodDirection === 'up' ? 'positive' : 'negative') :
 (metric?.goodDirection === 'down' ? 'positive' : 'negative'),
 createdAt: now
 })
 }
 }

 // Recommendations
 if (config.enableRecommendations) {
 const trend = analyzeTrend(series.data, config.trendWindow)
 const anomalies = detectAnomalies(series.data, config.anomalySensitivity)
 const recommendations = generateRecommendations(series, trend, anomalies, metric)
 
 for (const rec of recommendations) {
 insights.push({
 id: generateId(),
 category: 'recommendation',
 priority: rec.priority,
 status: 'new',
 title: rec.title,
 description: rec.description,
 details: rec.reason,
 metric: series.name,
 confidence: 0.8,
 impact: rec.type === 'celebrate' ? 'positive' : 
 rec.type === 'investigate' ? 'negative' : 'neutral',
 actions: rec.actions,
 createdAt: now
 })
 }
 }

 return insights
}

/**
 * Sort insights by priority and recency
 */
export function sortInsights(insights: Insight[]): Insight[] {
 const priorityOrder: Record<InsightPriority, number> = {
 critical: 0,
 high: 1,
 medium: 2,
 low: 3
 }

 return [...insights].sort((a, b) => {
 // First by priority
 const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
 if (priorityDiff !== 0) return priorityDiff
 
 // Then by date (newest first)
 return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
 })
}

/**
 * Filter insights
 */
export function filterInsights(
 insights: Insight[],
 filter: {
 categories?: InsightCategory[]
 priorities?: InsightPriority[]
 statuses?: ('new' | 'viewed' | 'actioned' | 'dismissed')[]
 search?: string
 }
): Insight[] {
 return insights.filter(insight => {
 if (filter.categories && !filter.categories.includes(insight.category)) {
 return false
 }
 if (filter.priorities && !filter.priorities.includes(insight.priority)) {
 return false
 }
 if (filter.statuses && !filter.statuses.includes(insight.status)) {
 return false
 }
 if (filter.search) {
 const searchLower = filter.search.toLowerCase()
 const matches = 
 insight.title.toLowerCase().includes(searchLower) ||
 insight.description.toLowerCase().includes(searchLower) ||
 insight.metric?.toLowerCase().includes(searchLower)
 if (!matches) return false
 }
 return true
 })
}
