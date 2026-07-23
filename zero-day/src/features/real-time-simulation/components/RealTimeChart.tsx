/**
 * Real-Time Chart Component
 * Displays live-updating chart with streaming data
 */

import { useMemo } from 'react'
import { Icon } from '@/components/common'
import type { TimeSeriesDataPoint, StreamStatistics, Anomaly, StreamType } from '../types'
import { streamTypeConfig, formatValue } from '../config'

interface RealTimeChartProps {
 streamId: string
 name: string
 type: StreamType
 data: TimeSeriesDataPoint[]
 statistics?: StreamStatistics
 anomalies?: Anomaly[]
 color?: string
 showGrid?: boolean
 showAnomalies?: boolean
 showTrendLine?: boolean
 movingAverage?: number[]
 bollingerBands?: { upper: number[]; middle: number[]; lower: number[] }
 height?: number
 onRemove?: () => void
}

export function RealTimeChart({
 streamId,
 name,
 type,
 data,
 statistics,
 anomalies = [],
 color,
 showGrid = true,
 showAnomalies = true,
 // showTrendLine = false, // Reserved for future use
 movingAverage,
 bollingerBands,
 height = 250,
 onRemove
}: RealTimeChartProps) {
 const config = streamTypeConfig[type]
 const chartColor = color || config.color

 // Calculate chart dimensions
 const chartData = useMemo(() => {
 if (data.length < 2) return null

 const values = data.map(d => d.value)
 const min = Math.min(...values)
 const max = Math.max(...values)
 const range = max - min || 1
 const padding = range * 0.1

 return {
 values,
 min: min - padding,
 max: max + padding,
 range: range + padding * 2
 }
 }, [data])

 // Generate SVG path for main line
 const mainPath = useMemo(() => {
 if (!chartData || data.length < 2) return ''

 const width = 100
 const height = 100
 const { min, range } = chartData

 const points = data.map((d, i) => {
 const x = (i / (data.length - 1)) * width
 const y = height - ((d.value - min) / range) * height
 return `${x},${y}`
 })

 return `M${points.join(' L')}`
 }, [data, chartData])

 // Generate area fill path
 const areaPath = useMemo(() => {
 if (!mainPath) return ''
 return `${mainPath} L100,100 L0,100 Z`
 }, [mainPath])

 // Generate moving average path
 const maPath = useMemo(() => {
 if (!movingAverage || !chartData || movingAverage.length < 2) return ''

 const { min, range } = chartData
 const points = movingAverage.map((v, i) => {
 const x = (i / (movingAverage.length - 1)) * 100
 const y = 100 - ((v - min) / range) * 100
 return `${x},${y}`
 })

 return `M${points.join(' L')}`
 }, [movingAverage, chartData])

 // Anomaly markers
 const anomalyMarkers = useMemo(() => {
 if (!showAnomalies || !chartData || anomalies.length === 0) return []

 const { min, range } = chartData
 return anomalies
 .filter(a => a.streamId === streamId)
 .slice(-10)
 .map(anomaly => {
 // Find the data point closest to the anomaly timestamp
 const idx = data.findIndex(d => d.timestamp >= anomaly.timestamp)
 if (idx < 0) return null

 const x = (idx / (data.length - 1)) * 100
 const y = 100 - ((anomaly.value - min) / range) * 100

 return { ...anomaly, x, y }
 })
 .filter(Boolean)
 }, [anomalies, data, chartData, showAnomalies, streamId])

 const latestValue = data[data.length - 1]?.value ?? 0
 const previousValue = data[data.length - 2]?.value ?? latestValue
 const change = latestValue - previousValue
 const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0

 return (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div 
 className="p-2.5 rounded-xl"
 style={{ backgroundColor: `${chartColor}20` }}
 >
 <Icon icon={config.icon} className="w-5 h-5" style={{ color: chartColor }} />
 </div>
 <div>
 <h3 className="font-semibold text-secondary-900 dark:text-white">{name}</h3>
 <p className="text-xs text-secondary-500">{config.label}</p>
 </div>
 </div>

 <div className="flex items-center gap-4">
 {/* Live indicator */}
 <div className="flex items-center gap-1.5">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
 </span>
 <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</span>
 </div>

 {onRemove && (
 <button
 onClick={onRemove}
 className="p-1.5 text-secondary-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
 >
 <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 </div>

 {/* Value display */}
 <div className="px-5 py-4 bg-surface-50 dark:bg-surface-800/50">
 <div className="flex items-baseline gap-3">
 <span 
 className="text-3xl font-bold"
 style={{ color: chartColor }}
 >
 {formatValue(latestValue, type)}
 </span>
 <div className={`flex items-center gap-1 text-sm font-medium ${
 change >= 0 ? 'text-green-600' : 'text-red-600'
 }`}>
 <Icon 
 icon={change >= 0 ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} 
 className="w-4 h-4" 
 />
 <span>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%</span>
 </div>
 </div>
 </div>

 {/* Chart */}
 <div className="px-5 py-4" style={{ height: `${height}px` }}>
 {data.length < 2 ? (
 <div className="h-full flex items-center justify-center text-secondary-400">
 <div className="text-center">
 <Icon icon="solar:graph-linear" className="w-12 h-12 mx-auto mb-2 opacity-50" />
 <p className="text-sm">Collecting data...</p>
 </div>
 </div>
 ) : (
 <svg
 viewBox="0 0 100 100"
 preserveAspectRatio="none"
 className="w-full h-full"
 >
 {/* Grid lines */}
 {showGrid && (
 <g className="text-surface-200 dark:text-surface-700">
 {[0, 25, 50, 75, 100].map(y => (
 <line
 key={y}
 x1="0"
 y1={y}
 x2="100"
 y2={y}
 stroke="currentColor"
 strokeWidth="0.2"
 strokeDasharray="1,1"
 />
 ))}
 </g>
 )}

 {/* Bollinger Bands */}
 {bollingerBands && chartData && (
 <g opacity="0.3">
 <path
 d={`M${bollingerBands.upper.map((v, i) => {
 const x = (i / (bollingerBands.upper.length - 1)) * 100
 const y = 100 - ((v - chartData.min) / chartData.range) * 100
 return `${x},${y}`
 }).join(' L')} L${bollingerBands.lower.slice().reverse().map((v, i) => {
 const x = ((bollingerBands.lower.length - 1 - i) / (bollingerBands.lower.length - 1)) * 100
 const y = 100 - ((v - chartData.min) / chartData.range) * 100
 return `${x},${y}`
 }).join(' L')} Z`}
 fill={chartColor}
 />
 </g>
 )}

 {/* Area fill */}
 <path
 d={areaPath}
 fill={`url(#gradient-${streamId})`}
 opacity="0.4"
 />

 {/* Main line */}
 <path
 d={mainPath}
 fill="none"
 stroke={chartColor}
 strokeWidth="0.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 vectorEffect="non-scaling-stroke"
 style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
 />

 {/* Moving average line */}
 {maPath && (
 <path
 d={maPath}
 fill="none"
 stroke="#f59e0b"
 strokeWidth="0.3"
 strokeDasharray="2,1"
 vectorEffect="non-scaling-stroke"
 opacity="0.8"
 />
 )}

 {/* Anomaly markers */}
 {anomalyMarkers.map((marker) => marker && (
 <g key={marker.id}>
 <circle
 cx={marker.x}
 cy={marker.y}
 r="1.5"
 fill={marker.severity === 'critical' ? '#ef4444' : 
 marker.severity === 'high' ? '#f97316' : 
 marker.severity === 'medium' ? '#eab308' : '#3b82f6'}
 stroke="white"
 strokeWidth="0.3"
 />
 </g>
 ))}

 {/* Gradient definition */}
 <defs>
 <linearGradient id={`gradient-${streamId}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
 <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
 </linearGradient>
 </defs>
 </svg>
 )}
 </div>

 {/* Statistics */}
 {statistics && (
 <div className="px-5 py-3 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-700">
 <div className="grid grid-cols-4 gap-4 text-center">
 <div>
 <p className="text-xs text-secondary-500 mb-0.5">Min</p>
 <p className="text-sm font-semibold text-secondary-900 dark:text-white">
 {formatValue(statistics.min, type)}
 </p>
 </div>
 <div>
 <p className="text-xs text-secondary-500 mb-0.5">Max</p>
 <p className="text-sm font-semibold text-secondary-900 dark:text-white">
 {formatValue(statistics.max, type)}
 </p>
 </div>
 <div>
 <p className="text-xs text-secondary-500 mb-0.5">Mean</p>
 <p className="text-sm font-semibold text-secondary-900 dark:text-white">
 {formatValue(statistics.mean, type)}
 </p>
 </div>
 <div>
 <p className="text-xs text-secondary-500 mb-0.5">Trend</p>
 <p className={`text-sm font-semibold flex items-center justify-center gap-1 ${
 statistics.trend === 'up' ? 'text-green-600' :
 statistics.trend === 'down' ? 'text-red-600' : 'text-secondary-500'
 }`}>
 <Icon 
 icon={statistics.trend === 'up' ? 'solar:arrow-up-linear' :
 statistics.trend === 'down' ? 'solar:arrow-down-linear' : 
 'solar:minus-linear'} 
 className="w-3.5 h-3.5" 
 />
 {statistics.trend === 'stable' ? 'Stable' : statistics.trendStrength.toFixed(1)}
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}

export default RealTimeChart
