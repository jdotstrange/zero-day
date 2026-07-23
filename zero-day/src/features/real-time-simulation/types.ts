/**
 * Real-Time Simulation - Types
 * Defines the structure for real-time data simulation
 */

// Data point for time series
export interface TimeSeriesDataPoint {
 timestamp: number
 value: number
 label?: string
 metadata?: Record<string, unknown>
}

// Stream configuration
export interface StreamConfig {
 id: string
 name: string
 type: StreamType
 baseValue: number
 volatility: number
 trend: number
 seasonality?: SeasonalityConfig
 anomalyRate?: number
 updateInterval: number
 isActive: boolean
}

// Types of data streams
export type StreamType = 
 | 'stock'
 | 'traffic'
 | 'temperature'
 | 'sales'
 | 'users'
 | 'cpu'
 | 'memory'
 | 'network'
 | 'custom'

// Seasonality configuration
export interface SeasonalityConfig {
 period: number // in data points
 amplitude: number
 phase?: number
}

// Anomaly detection configuration
export interface AnomalyConfig {
 enabled: boolean
 sensitivity: 'low' | 'medium' | 'high'
 method: 'zscore' | 'mad' | 'iqr'
 windowSize: number
}

// Detected anomaly
export interface Anomaly {
 id: string
 streamId: string
 timestamp: number
 value: number
 expectedValue: number
 deviation: number
 severity: 'low' | 'medium' | 'high' | 'critical'
 type: 'spike' | 'drop' | 'outlier' | 'trend_break'
 acknowledged: boolean
}

// Statistics for a data stream
export interface StreamStatistics {
 count: number
 mean: number
 median: number
 stdDev: number
 min: number
 max: number
 sum: number
 variance: number
 skewness: number
 trend: 'up' | 'down' | 'stable'
 trendStrength: number
 anomalyCount: number
 lastUpdated: number
}

// Rolling window data
export interface RollingWindow {
 size: number
 data: number[]
 sum: number
 sumSquares: number
}

// Simulation state
export interface SimulationState {
 isRunning: boolean
 startedAt: number | null
 elapsedTime: number
 tickCount: number
 streams: Map<string, StreamState>
}

// Individual stream state
export interface StreamState {
 config: StreamConfig
 data: TimeSeriesDataPoint[]
 statistics: StreamStatistics
 rollingWindow: RollingWindow
 anomalies: Anomaly[]
 lastValue: number
}

// Simulation events
export type SimulationEvent = 
 | { type: 'data'; streamId: string; point: TimeSeriesDataPoint }
 | { type: 'anomaly'; anomaly: Anomaly }
 | { type: 'statistics'; streamId: string; stats: StreamStatistics }
 | { type: 'started' }
 | { type: 'stopped' }
 | { type: 'error'; message: string }

// Simulation listener
export type SimulationListener = (event: SimulationEvent) => void

// Alert configuration
export interface AlertConfig {
 id: string
 streamId: string
 condition: 'above' | 'below' | 'change_percent' | 'anomaly'
 threshold: number
 message: string
 enabled: boolean
 cooldown: number
 lastTriggered?: number
}

// Alert event
export interface Alert {
 id: string
 configId: string
 streamId: string
 timestamp: number
 value: number
 threshold: number
 message: string
 acknowledged: boolean
}

// Preset configurations
export interface StreamPreset {
 id: string
 name: string
 description: string
 icon: string
 config: Omit<StreamConfig, 'id' | 'isActive'>
}

// Export format for data
export type ExportFormat = 'json' | 'csv' | 'parquet'

// Chart display options
export interface ChartDisplayConfig {
 showGrid: boolean
 showLegend: boolean
 showTooltip: boolean
 animate: boolean
 lineWidth: number
 fillOpacity: number
 showAnomalies: boolean
 showTrendLine: boolean
 showMovingAverage: boolean
 movingAverageWindow: number
}
