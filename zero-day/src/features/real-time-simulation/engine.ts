/**
 * Real-Time Simulation - Core Engine
 * Generates realistic data streams with statistical properties
 */

import type {
 StreamConfig,
 StreamState,
 TimeSeriesDataPoint,
 StreamStatistics,
 RollingWindow,
 Anomaly,
 AnomalyConfig,
 SimulationEvent,
 SimulationListener,
 AlertConfig,
 Alert
} from './types'

/**
 * Generate unique ID
 */
export function generateId(): string {
 return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Box-Muller transform for normally distributed random numbers
 */
export function normalRandom(mean = 0, stdDev = 1): number {
 const u1 = Math.random()
 const u2 = Math.random()
 const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
 return mean + stdDev * z
}

/**
 * Create empty rolling window
 */
export function createRollingWindow(size: number): RollingWindow {
 return {
 size,
 data: [],
 sum: 0,
 sumSquares: 0
 }
}

/**
 * Add value to rolling window
 */
export function addToRollingWindow(window: RollingWindow, value: number): RollingWindow {
 const newData = [...window.data, value]
 let newSum = window.sum + value
 let newSumSquares = window.sumSquares + value * value

 // Remove oldest if exceeding size
 if (newData.length > window.size) {
 const removed = newData.shift()!
 newSum -= removed
 newSumSquares -= removed * removed
 }

 return {
 size: window.size,
 data: newData,
 sum: newSum,
 sumSquares: newSumSquares
 }
}

/**
 * Calculate statistics from rolling window
 */
export function calculateWindowStats(window: RollingWindow): { mean: number; stdDev: number } {
 if (window.data.length === 0) {
 return { mean: 0, stdDev: 0 }
 }

 const mean = window.sum / window.data.length
 const variance = window.sumSquares / window.data.length - mean * mean
 const stdDev = Math.sqrt(Math.max(0, variance))

 return { mean, stdDev }
}

/**
 * Generate next data point for a stream
 */
export function generateDataPoint(
 config: StreamConfig,
 lastValue: number,
 tickIndex: number
): TimeSeriesDataPoint {
 const timestamp = Date.now()
 
 // Apply trend
 const trendComponent = config.trend * 0.01

 // Apply seasonality
 let seasonalComponent = 0
 if (config.seasonality) {
 const { period, amplitude, phase = 0 } = config.seasonality
 seasonalComponent = amplitude * Math.sin((2 * Math.PI * tickIndex) / period + phase)
 }

 // Apply random volatility (mean-reverting towards base)
 const randomComponent = normalRandom(0, config.volatility)
 const meanReversionStrength = 0.05
 const meanReversion = (config.baseValue - lastValue) * meanReversionStrength

 // Calculate new value
 let newValue = lastValue + 
 lastValue * trendComponent + 
 seasonalComponent + 
 randomComponent + 
 meanReversion

 // Add occasional anomalies
 if (config.anomalyRate && Math.random() < config.anomalyRate) {
 const anomalyMultiplier = Math.random() > 0.5 ? 
 (1 + 2 * Math.random()) : 
 (1 - 0.5 * Math.random())
 newValue = lastValue * anomalyMultiplier
 }

 // Ensure non-negative for certain types
 if (['cpu', 'memory', 'users', 'traffic'].includes(config.type)) {
 newValue = Math.max(0, newValue)
 }

 return {
 timestamp,
 value: Number(newValue.toFixed(4)),
 label: formatTimestamp(timestamp)
 }
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: number): string {
 const date = new Date(timestamp)
 return date.toLocaleTimeString('en-US', { 
 hour12: false,
 hour: '2-digit',
 minute: '2-digit',
 second: '2-digit'
 })
}

/**
 * Detect anomaly using Z-score
 */
export function detectAnomalyZScore(
 value: number,
 window: RollingWindow,
 sensitivity: 'low' | 'medium' | 'high'
): { isAnomaly: boolean; deviation: number; severity: Anomaly['severity'] } {
 const { mean, stdDev } = calculateWindowStats(window)
 
 if (stdDev === 0 || window.data.length < 10) {
 return { isAnomaly: false, deviation: 0, severity: 'low' }
 }

 const zScore = Math.abs((value - mean) / stdDev)
 
 const thresholds = {
 low: { detect: 3.5, medium: 4, high: 5, critical: 6 },
 medium: { detect: 2.5, medium: 3, high: 4, critical: 5 },
 high: { detect: 2, medium: 2.5, high: 3, critical: 4 }
 }

 const threshold = thresholds[sensitivity]
 
 if (zScore < threshold.detect) {
 return { isAnomaly: false, deviation: zScore, severity: 'low' }
 }

 let severity: Anomaly['severity'] = 'low'
 if (zScore >= threshold.critical) severity = 'critical'
 else if (zScore >= threshold.high) severity = 'high'
 else if (zScore >= threshold.medium) severity = 'medium'

 return { isAnomaly: true, deviation: zScore, severity }
}

/**
 * Detect anomaly using MAD (Median Absolute Deviation)
 */
export function detectAnomalyMAD(
 value: number,
 window: RollingWindow,
 sensitivity: 'low' | 'medium' | 'high'
): { isAnomaly: boolean; deviation: number; severity: Anomaly['severity'] } {
 if (window.data.length < 10) {
 return { isAnomaly: false, deviation: 0, severity: 'low' }
 }

 const sorted = [...window.data].sort((a, b) => a - b)
 const median = sorted[Math.floor(sorted.length / 2)]
 const deviations = sorted.map(v => Math.abs(v - median))
 deviations.sort((a, b) => a - b)
 const mad = deviations[Math.floor(deviations.length / 2)]

 if (mad === 0) {
 return { isAnomaly: false, deviation: 0, severity: 'low' }
 }

 const modifiedZScore = 0.6745 * Math.abs(value - median) / mad

 const thresholds = {
 low: { detect: 3.5, medium: 4.5, high: 5.5, critical: 7 },
 medium: { detect: 3, medium: 4, high: 5, critical: 6 },
 high: { detect: 2.5, medium: 3, high: 4, critical: 5 }
 }

 const threshold = thresholds[sensitivity]
 
 if (modifiedZScore < threshold.detect) {
 return { isAnomaly: false, deviation: modifiedZScore, severity: 'low' }
 }

 let severity: Anomaly['severity'] = 'low'
 if (modifiedZScore >= threshold.critical) severity = 'critical'
 else if (modifiedZScore >= threshold.high) severity = 'high'
 else if (modifiedZScore >= threshold.medium) severity = 'medium'

 return { isAnomaly: true, deviation: modifiedZScore, severity }
}

/**
 * Detect anomaly based on configuration
 */
export function detectAnomaly(
 value: number,
 expectedValue: number,
 window: RollingWindow,
 config: AnomalyConfig
): Anomaly | null {
 if (!config.enabled || window.data.length < config.windowSize / 2) {
 return null
 }

 const result = config.method === 'mad' 
 ? detectAnomalyMAD(value, window, config.sensitivity)
 : detectAnomalyZScore(value, window, config.sensitivity)

 if (!result.isAnomaly) {
 return null
 }

 const type: Anomaly['type'] = value > expectedValue ? 'spike' : 'drop'

 return {
 id: generateId(),
 streamId: '',
 timestamp: Date.now(),
 value,
 expectedValue,
 deviation: result.deviation,
 severity: result.severity,
 type,
 acknowledged: false
 }
}

/**
 * Calculate comprehensive statistics for a data stream
 */
export function calculateStatistics(data: TimeSeriesDataPoint[]): StreamStatistics {
 if (data.length === 0) {
 return {
 count: 0,
 mean: 0,
 median: 0,
 stdDev: 0,
 min: 0,
 max: 0,
 sum: 0,
 variance: 0,
 skewness: 0,
 trend: 'stable',
 trendStrength: 0,
 anomalyCount: 0,
 lastUpdated: Date.now()
 }
 }

 const values = data.map(d => d.value)
 const n = values.length
 const sum = values.reduce((a, b) => a + b, 0)
 const mean = sum / n
 
 const sortedValues = [...values].sort((a, b) => a - b)
 const median = n % 2 === 0
 ? (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2
 : sortedValues[Math.floor(n / 2)]

 const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n
 const stdDev = Math.sqrt(variance)

 // Skewness
 const m3 = values.reduce((acc, v) => acc + Math.pow((v - mean) / stdDev, 3), 0) / n
 const skewness = stdDev === 0 ? 0 : m3

 // Trend calculation using linear regression
 const { trend, trendStrength } = calculateTrend(values)

 return {
 count: n,
 mean: Number(mean.toFixed(4)),
 median: Number(median.toFixed(4)),
 stdDev: Number(stdDev.toFixed(4)),
 min: Number(Math.min(...values).toFixed(4)),
 max: Number(Math.max(...values).toFixed(4)),
 sum: Number(sum.toFixed(4)),
 variance: Number(variance.toFixed(4)),
 skewness: Number(skewness.toFixed(4)),
 trend,
 trendStrength: Number(trendStrength.toFixed(4)),
 anomalyCount: 0,
 lastUpdated: Date.now()
 }
}

/**
 * Calculate trend using linear regression
 */
export function calculateTrend(values: number[]): { trend: 'up' | 'down' | 'stable'; trendStrength: number } {
 const n = values.length
 if (n < 2) return { trend: 'stable', trendStrength: 0 }

 const xMean = (n - 1) / 2
 const yMean = values.reduce((a, b) => a + b, 0) / n

 let numerator = 0
 let denominator = 0

 for (let i = 0; i < n; i++) {
 numerator += (i - xMean) * (values[i] - yMean)
 denominator += Math.pow(i - xMean, 2)
 }

 const slope = denominator === 0 ? 0 : numerator / denominator
 const normalizedSlope = slope / yMean

 // Calculate R-squared
 const predictions = values.map((_, i) => yMean + slope * (i - xMean))
 const ssRes = values.reduce((acc, v, i) => acc + Math.pow(v - predictions[i], 2), 0)
 const ssTot = values.reduce((acc, v) => acc + Math.pow(v - yMean, 2), 0)
 const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot

 const trendStrength = Math.abs(normalizedSlope) * rSquared

 if (Math.abs(normalizedSlope) < 0.001) {
 return { trend: 'stable', trendStrength: 0 }
 }

 return {
 trend: normalizedSlope > 0 ? 'up' : 'down',
 trendStrength: Math.min(1, trendStrength * 100)
 }
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data: TimeSeriesDataPoint[], window: number): number[] {
 const result: number[] = []
 
 for (let i = 0; i < data.length; i++) {
 const start = Math.max(0, i - window + 1)
 const windowData = data.slice(start, i + 1)
 const avg = windowData.reduce((sum, d) => sum + d.value, 0) / windowData.length
 result.push(Number(avg.toFixed(4)))
 }
 
 return result
}

/**
 * Calculate exponential moving average
 */
export function calculateEMA(data: TimeSeriesDataPoint[], alpha = 0.2): number[] {
 if (data.length === 0) return []
 
 const result: number[] = [data[0].value]
 
 for (let i = 1; i < data.length; i++) {
 const ema = alpha * data[i].value + (1 - alpha) * result[i - 1]
 result.push(Number(ema.toFixed(4)))
 }
 
 return result
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(
 data: TimeSeriesDataPoint[],
 period = 20,
 multiplier = 2
): { upper: number[]; middle: number[]; lower: number[] } {
 const upper: number[] = []
 const middle: number[] = []
 const lower: number[] = []

 for (let i = 0; i < data.length; i++) {
 const start = Math.max(0, i - period + 1)
 const windowData = data.slice(start, i + 1).map(d => d.value)
 
 const mean = windowData.reduce((a, b) => a + b, 0) / windowData.length
 const variance = windowData.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / windowData.length
 const stdDev = Math.sqrt(variance)

 middle.push(Number(mean.toFixed(4)))
 upper.push(Number((mean + multiplier * stdDev).toFixed(4)))
 lower.push(Number((mean - multiplier * stdDev).toFixed(4)))
 }

 return { upper, middle, lower }
}

/**
 * Check alert conditions
 */
export function checkAlert(
 config: AlertConfig,
 currentValue: number,
 previousValue: number,
 hasAnomaly: boolean
): Alert | null {
 if (!config.enabled) return null

 // Check cooldown
 if (config.lastTriggered) {
 const elapsed = Date.now() - config.lastTriggered
 if (elapsed < config.cooldown) return null
 }

 let triggered = false

 switch (config.condition) {
 case 'above':
 triggered = currentValue > config.threshold
 break
 case 'below':
 triggered = currentValue < config.threshold
 break
 case 'change_percent':
 const changePercent = previousValue !== 0 
 ? Math.abs((currentValue - previousValue) / previousValue * 100)
 : 0
 triggered = changePercent > config.threshold
 break
 case 'anomaly':
 triggered = hasAnomaly
 break
 }

 if (!triggered) return null

 return {
 id: generateId(),
 configId: config.id,
 streamId: config.streamId,
 timestamp: Date.now(),
 value: currentValue,
 threshold: config.threshold,
 message: config.message.replace('{value}', currentValue.toFixed(2)),
 acknowledged: false
 }
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: TimeSeriesDataPoint[]): string {
 const headers = 'timestamp,datetime,value,label\n'
 const rows = data.map(d => {
 const datetime = new Date(d.timestamp).toISOString()
 return `${d.timestamp},${datetime},${d.value},${d.label || ''}`
 }).join('\n')
 return headers + rows
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: TimeSeriesDataPoint[]): string {
 return JSON.stringify(data, null, 2)
}

/**
 * Simulation Engine Class
 */
export class SimulationEngine {
 private streams: Map<string, StreamState> = new Map()
 private listeners: Set<SimulationListener> = new Set()
 private intervals: Map<string, ReturnType<typeof setInterval>> = new Map()
 private isRunning = false
 private startedAt: number | null = null
 private tickCount = 0
 private anomalyConfig: AnomalyConfig = {
 enabled: true,
 sensitivity: 'medium',
 method: 'zscore',
 windowSize: 50
 }
 private alertConfigs: Map<string, AlertConfig> = new Map()
 private alerts: Alert[] = []
 private maxDataPoints = 500

 /**
 * Add a data stream
 */
 addStream(config: StreamConfig): void {
 const state: StreamState = {
 config,
 data: [],
 statistics: calculateStatistics([]),
 rollingWindow: createRollingWindow(this.anomalyConfig.windowSize),
 anomalies: [],
 lastValue: config.baseValue
 }
 this.streams.set(config.id, state)
 }

 /**
 * Remove a data stream
 */
 removeStream(streamId: string): void {
 this.stopStream(streamId)
 this.streams.delete(streamId)
 }

 /**
 * Start all active streams
 */
 start(): void {
 if (this.isRunning) return

 this.isRunning = true
 this.startedAt = Date.now()
 this.emit({ type: 'started' })

 for (const [streamId, state] of this.streams) {
 if (state.config.isActive) {
 this.startStream(streamId)
 }
 }
 }

 /**
 * Stop all streams
 */
 stop(): void {
 if (!this.isRunning) return

 for (const streamId of this.streams.keys()) {
 this.stopStream(streamId)
 }

 this.isRunning = false
 this.emit({ type: 'stopped' })
 }

 /**
 * Start a specific stream
 */
 private startStream(streamId: string): void {
 const state = this.streams.get(streamId)
 if (!state) return

 // Clear existing interval
 this.stopStream(streamId)

 const interval = setInterval(() => {
 this.tick(streamId)
 }, state.config.updateInterval)

 this.intervals.set(streamId, interval)
 }

 /**
 * Stop a specific stream
 */
 private stopStream(streamId: string): void {
 const interval = this.intervals.get(streamId)
 if (interval) {
 clearInterval(interval)
 this.intervals.delete(streamId)
 }
 }

 /**
 * Process one tick for a stream
 */
 private tick(streamId: string): void {
 const state = this.streams.get(streamId)
 if (!state) return

 this.tickCount++

 // Generate new data point
 const point = generateDataPoint(state.config, state.lastValue, this.tickCount)

 // Update rolling window
 const newWindow = addToRollingWindow(state.rollingWindow, point.value)
 const { mean } = calculateWindowStats(newWindow)

 // Detect anomalies
 const anomaly = detectAnomaly(point.value, mean, newWindow, this.anomalyConfig)
 if (anomaly) {
 anomaly.streamId = streamId
 state.anomalies.push(anomaly)
 
 // Keep only recent anomalies
 if (state.anomalies.length > 100) {
 state.anomalies = state.anomalies.slice(-100)
 }
 
 this.emit({ type: 'anomaly', anomaly })
 }

 // Check alerts
 for (const alertConfig of this.alertConfigs.values()) {
 if (alertConfig.streamId === streamId) {
 const alert = checkAlert(alertConfig, point.value, state.lastValue, !!anomaly)
 if (alert) {
 alertConfig.lastTriggered = Date.now()
 this.alerts.push(alert)
 }
 }
 }

 // Update state
 state.data.push(point)
 if (state.data.length > this.maxDataPoints) {
 state.data = state.data.slice(-this.maxDataPoints)
 }
 state.lastValue = point.value
 state.rollingWindow = newWindow

 // Calculate statistics periodically
 if (this.tickCount % 10 === 0) {
 state.statistics = {
 ...calculateStatistics(state.data),
 anomalyCount: state.anomalies.length
 }
 this.emit({ type: 'statistics', streamId, stats: state.statistics })
 }

 // Emit data event
 this.emit({ type: 'data', streamId, point })
 }

 /**
 * Add event listener
 */
 subscribe(listener: SimulationListener): () => void {
 this.listeners.add(listener)
 return () => this.listeners.delete(listener)
 }

 /**
 * Emit event to all listeners
 */
 private emit(event: SimulationEvent): void {
 for (const listener of this.listeners) {
 try {
 listener(event)
 } catch (err) {
 console.error('Listener error:', err)
 }
 }
 }

 /**
 * Get stream data
 */
 getStreamData(streamId: string): TimeSeriesDataPoint[] {
 return this.streams.get(streamId)?.data || []
 }

 /**
 * Get stream statistics
 */
 getStreamStatistics(streamId: string): StreamStatistics | null {
 return this.streams.get(streamId)?.statistics || null
 }

 /**
 * Get all streams
 */
 getStreams(): StreamConfig[] {
 return Array.from(this.streams.values()).map(s => s.config)
 }

 /**
 * Get anomalies
 */
 getAnomalies(streamId?: string): Anomaly[] {
 if (streamId) {
 return this.streams.get(streamId)?.anomalies || []
 }
 return Array.from(this.streams.values()).flatMap(s => s.anomalies)
 }

 /**
 * Get alerts
 */
 getAlerts(): Alert[] {
 return this.alerts
 }

 /**
 * Add alert configuration
 */
 addAlert(config: AlertConfig): void {
 this.alertConfigs.set(config.id, config)
 }

 /**
 * Remove alert configuration
 */
 removeAlert(alertId: string): void {
 this.alertConfigs.delete(alertId)
 }

 /**
 * Set anomaly detection config
 */
 setAnomalyConfig(config: Partial<AnomalyConfig>): void {
 this.anomalyConfig = { ...this.anomalyConfig, ...config }
 }

 /**
 * Get simulation state
 */
 getState(): {
 isRunning: boolean
 startedAt: number | null
 tickCount: number
 streamCount: number
 } {
 return {
 isRunning: this.isRunning,
 startedAt: this.startedAt,
 tickCount: this.tickCount,
 streamCount: this.streams.size
 }
 }

 /**
 * Reset simulation
 */
 reset(): void {
 this.stop()
 this.streams.clear()
 this.alerts = []
 this.tickCount = 0
 this.startedAt = null
 }
}

// Singleton instance
let engineInstance: SimulationEngine | null = null

export function getSimulationEngine(): SimulationEngine {
 if (!engineInstance) {
 engineInstance = new SimulationEngine()
 }
 return engineInstance
}

export function resetSimulationEngine(): void {
 if (engineInstance) {
 engineInstance.reset()
 engineInstance = null
 }
}
