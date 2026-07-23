/**
 * Real-Time Simulation - Configuration
 * Stream presets and display options
 */

import type { StreamPreset, ChartDisplayConfig, StreamType } from './types'

// Stream type configurations
export const streamTypeConfig: Record<StreamType, { 
 label: string
 icon: string
 color: string
 unit: string
 defaultBase: number
 defaultVolatility: number
}> = {
 stock: {
 label: 'Stock Price',
 icon: 'solar:chart-2-linear',
 color: '#10b981',
 unit: '$',
 defaultBase: 150,
 defaultVolatility: 2.5
 },
 traffic: {
 label: 'Web Traffic',
 icon: 'solar:graph-up-linear',
 color: '#3b82f6',
 unit: 'req/s',
 defaultBase: 1000,
 defaultVolatility: 50
 },
 temperature: {
 label: 'Temperature',
 icon: 'solar:temperature-linear',
 color: '#f59e0b',
 unit: '°C',
 defaultBase: 25,
 defaultVolatility: 0.5
 },
 sales: {
 label: 'Sales',
 icon: 'solar:cart-large-2-linear',
 color: '#8b5cf6',
 unit: '$',
 defaultBase: 5000,
 defaultVolatility: 200
 },
 users: {
 label: 'Active Users',
 icon: 'solar:users-group-rounded-linear',
 color: '#06b6d4',
 unit: '',
 defaultBase: 500,
 defaultVolatility: 25
 },
 cpu: {
 label: 'CPU Usage',
 icon: 'solar:cpu-bolt-linear',
 color: '#ef4444',
 unit: '%',
 defaultBase: 45,
 defaultVolatility: 8
 },
 memory: {
 label: 'Memory Usage',
 icon: 'solar:sd-card-linear',
 color: '#ec4899',
 unit: '%',
 defaultBase: 60,
 defaultVolatility: 5
 },
 network: {
 label: 'Network I/O',
 icon: 'solar:global-linear',
 color: '#14b8a6',
 unit: 'MB/s',
 defaultBase: 100,
 defaultVolatility: 15
 },
 custom: {
 label: 'Custom Metric',
 icon: 'solar:settings-linear',
 color: '#64748b',
 unit: '',
 defaultBase: 100,
 defaultVolatility: 10
 }
}

// Preset stream configurations
export const streamPresets: StreamPreset[] = [
 {
 id: 'stock-volatile',
 name: 'Volatile Stock',
 description: 'High volatility stock with upward trend',
 icon: 'solar:chart-2-linear',
 config: {
 name: 'Volatile Stock',
 type: 'stock',
 baseValue: 150,
 volatility: 5,
 trend: 0.1,
 seasonality: { period: 50, amplitude: 3 },
 anomalyRate: 0.02,
 updateInterval: 500
 }
 },
 {
 id: 'stock-stable',
 name: 'Stable Stock',
 description: 'Low volatility blue-chip stock',
 icon: 'solar:chart-linear',
 config: {
 name: 'Stable Stock',
 type: 'stock',
 baseValue: 200,
 volatility: 1,
 trend: 0.02,
 updateInterval: 1000
 }
 },
 {
 id: 'traffic-daily',
 name: 'Web Traffic',
 description: 'Website traffic with daily patterns',
 icon: 'solar:graph-up-linear',
 config: {
 name: 'Web Traffic',
 type: 'traffic',
 baseValue: 1000,
 volatility: 100,
 trend: 0,
 seasonality: { period: 100, amplitude: 300 },
 updateInterval: 500
 }
 },
 {
 id: 'cpu-server',
 name: 'Server CPU',
 description: 'Server CPU usage with occasional spikes',
 icon: 'solar:cpu-bolt-linear',
 config: {
 name: 'Server CPU',
 type: 'cpu',
 baseValue: 45,
 volatility: 10,
 trend: 0,
 anomalyRate: 0.03,
 updateInterval: 1000
 }
 },
 {
 id: 'memory-app',
 name: 'App Memory',
 description: 'Application memory with gradual increase',
 icon: 'solar:sd-card-linear',
 config: {
 name: 'App Memory',
 type: 'memory',
 baseValue: 40,
 volatility: 3,
 trend: 0.05,
 updateInterval: 2000
 }
 },
 {
 id: 'users-realtime',
 name: 'Active Users',
 description: 'Real-time active user count',
 icon: 'solar:users-group-rounded-linear',
 config: {
 name: 'Active Users',
 type: 'users',
 baseValue: 500,
 volatility: 30,
 trend: 0,
 seasonality: { period: 80, amplitude: 100 },
 updateInterval: 1000
 }
 },
 {
 id: 'sales-ecommerce',
 name: 'E-commerce Sales',
 description: 'Real-time sales with seasonal trends',
 icon: 'solar:cart-large-2-linear',
 config: {
 name: 'E-commerce Sales',
 type: 'sales',
 baseValue: 5000,
 volatility: 500,
 trend: 0.1,
 seasonality: { period: 60, amplitude: 1000 },
 anomalyRate: 0.01,
 updateInterval: 2000
 }
 },
 {
 id: 'temperature-sensor',
 name: 'Temperature Sensor',
 description: 'IoT temperature sensor data',
 icon: 'solar:temperature-linear',
 config: {
 name: 'Temperature',
 type: 'temperature',
 baseValue: 25,
 volatility: 0.5,
 trend: 0,
 seasonality: { period: 120, amplitude: 5 },
 updateInterval: 5000
 }
 },
 {
 id: 'network-io',
 name: 'Network I/O',
 description: 'Network throughput with burst patterns',
 icon: 'solar:global-linear',
 config: {
 name: 'Network I/O',
 type: 'network',
 baseValue: 100,
 volatility: 20,
 trend: 0,
 anomalyRate: 0.02,
 updateInterval: 500
 }
 }
]

// Default chart display configuration
export const defaultChartConfig: ChartDisplayConfig = {
 showGrid: true,
 showLegend: true,
 showTooltip: true,
 animate: true,
 lineWidth: 2,
 fillOpacity: 0.1,
 showAnomalies: true,
 showTrendLine: false,
 showMovingAverage: false,
 movingAverageWindow: 20
}

// Anomaly severity colors
export const severityColors: Record<string, { bg: string; text: string; border: string }> = {
 low: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
 medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
 high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
 critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
}

// Chart color palette for multiple streams
export const chartColorPalette = [
 '#10b981', // emerald
 '#3b82f6', // blue
 '#f59e0b', // amber
 '#8b5cf6', // violet
 '#ef4444', // red
 '#06b6d4', // cyan
 '#ec4899', // pink
 '#14b8a6', // teal
 '#f97316', // orange
 '#6366f1', // indigo
]

// Get color for stream index
export function getStreamColor(index: number): string {
 return chartColorPalette[index % chartColorPalette.length]
}

// Format value with unit
export function formatValue(value: number, type: StreamType): string {
 const config = streamTypeConfig[type]
 const formatted = value.toLocaleString(undefined, { 
 minimumFractionDigits: 0,
 maximumFractionDigits: 2 
 })
 
 if (config.unit === '$') {
 return `$${formatted}`
 } else if (config.unit === '%') {
 return `${formatted}%`
 } else if (config.unit) {
 return `${formatted} ${config.unit}`
 }
 return formatted
}

// Get preset by ID
export function getPresetById(id: string): StreamPreset | undefined {
 return streamPresets.find(p => p.id === id)
}

// Generate stream ID
export function generateStreamId(): string {
 return `stream_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
