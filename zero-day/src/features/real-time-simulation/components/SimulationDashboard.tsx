/**
 * Simulation Dashboard Component
 * Main interface for managing real-time data simulations
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/common'
import { Button, Card, CardHeader, CardTitle } from '@/components/ui'
import { cn } from '@/components/ui/cn'
import { useSimulation } from '../useSimulation'
import { RealTimeChart } from './RealTimeChart'
import { streamPresets, streamTypeConfig, getStreamColor } from '../config'

export function SimulationDashboard() {
 const {
 isRunning,
 tickCount,
 streams,
 streamData,
 statistics,
 anomalies,
 unacknowledgedAnomalyCount,
 start,
 stop,
 reset,
 addStreamFromPreset,
 removeStream,
 getMovingAverage,
 getBollingerBands,
 acknowledgeAllAnomalies
 } = useSimulation()

 const [showAddStream, setShowAddStream] = useState(false)
 const [showAnomalies, setShowAnomalies] = useState(false)
 const [chartOptions, setChartOptions] = useState({
 showMovingAverage: false,
 showBollingerBands: false
 })

 const handleAddPreset = (presetId: string) => {
 addStreamFromPreset(presetId)
 setShowAddStream(false)
 }

 return (
 <div className="space-y-6">
 <Card padding="none" className="overflow-hidden">
 <CardHeader className="mb-0 flex-row flex-wrap items-center justify-between gap-4 border-b border-surface-200 px-6 py-4 dark:border-surface-700">
 <div>
 <CardTitle>Stream controls</CardTitle>
 <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
 {isRunning
 ? `Running • ${tickCount.toLocaleString()} ticks • ${streams.length} streams`
 : 'Configure and start data streams'}
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 {unacknowledgedAnomalyCount > 0 && (
 <Button type="button" variant="danger" size="sm" onClick={() => setShowAnomalies(!showAnomalies)}>
 <Icon icon="solar:danger-triangle-linear" />
 {unacknowledgedAnomalyCount} Anomalies
 </Button>
 )}

 <div className="flex items-center gap-1 rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
 <Button
 type="button"
 size="sm"
 variant={chartOptions.showMovingAverage ? 'primary' : 'ghost'}
 onClick={() => setChartOptions((prev) => ({ ...prev, showMovingAverage: !prev.showMovingAverage }))}
 >
 MA
 </Button>
 <Button
 type="button"
 size="sm"
 variant={chartOptions.showBollingerBands ? 'primary' : 'ghost'}
 onClick={() => setChartOptions((prev) => ({ ...prev, showBollingerBands: !prev.showBollingerBands }))}
 >
 BB
 </Button>
 </div>

 {isRunning ? (
 <Button type="button" variant="danger" onClick={stop}>
 <Icon icon="solar:pause-linear" />
 Stop
 </Button>
 ) : (
 <Button type="button" onClick={start} disabled={streams.length === 0}>
 <Icon icon="solar:play-linear" />
 Start
 </Button>
 )}

 <Button type="button" variant="ghost" iconOnly onClick={reset} aria-label="Reset">
 <Icon icon="solar:refresh-linear" />
 </Button>
 </div>
 </CardHeader>

 <div className="grid grid-cols-2 divide-x divide-surface-200 dark:divide-surface-700 md:grid-cols-4">
 {[
 { label: 'Active Streams', value: String(streams.length) },
 { label: 'Data Points', value: tickCount.toLocaleString() },
 { label: 'Anomalies Detected', value: String(anomalies.length) },
 {
 label: 'Status',
 value: isRunning ? 'Active' : 'Stopped',
 valueClass: isRunning ? 'text-success-600' : 'text-secondary-400',
 },
 ].map((stat) => (
 <div key={stat.label} className="px-6 py-4 text-center">
 <p className={cn('heading-3 text-secondary-900 dark:text-white', stat.valueClass)}>{stat.value}</p>
 <p className="text-body-sm text-secondary-500">{stat.label}</p>
 </div>
 ))}
 </div>
 </Card>

 {/* Anomaly panel */}
 {showAnomalies && anomalies.length > 0 && (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
 <Icon icon="solar:danger-triangle-linear" className="w-5 h-5 text-red-500" />
 Recent Anomalies
 </h3>
 <button
 onClick={() => acknowledgeAllAnomalies()}
 className="text-sm text-primary-600 hover:text-primary-700 font-medium"
 >
 Acknowledge All
 </button>
 </div>
 <div className="max-h-64 overflow-y-auto">
 {anomalies.slice(-20).reverse().map(anomaly => (
 <div
 key={anomaly.id}
 className={`px-5 py-3 border-b border-surface-100 dark:border-surface-800 last:border-0 flex items-center justify-between ${
 anomaly.acknowledged ? 'opacity-50' : ''
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`p-1.5 rounded-lg ${
 anomaly.severity === 'critical' ? 'bg-red-100 text-red-600' :
 anomaly.severity === 'high' ? 'bg-orange-100 text-orange-600' :
 anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
 'bg-blue-100 text-blue-600'
 }`}>
 <Icon 
 icon={anomaly.type === 'spike' ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'}
 className="w-4 h-4"
 />
 </div>
 <div>
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 {anomaly.type === 'spike' ? 'Spike' : 'Drop'} Detected
 </p>
 <p className="text-xs text-secondary-500">
 Value: {anomaly.value.toFixed(2)} | Deviation: {anomaly.deviation.toFixed(2)}σ
 </p>
 </div>
 </div>
 <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
 anomaly.severity === 'critical' ? 'bg-red-100 text-red-700' :
 anomaly.severity === 'high' ? 'bg-orange-100 text-orange-700' :
 anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
 'bg-blue-100 text-blue-700'
 }`}>
 {anomaly.severity.toUpperCase()}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Stream charts */}
 {streams.length > 0 ? (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {streams.map((stream, index) => (
 <RealTimeChart
 key={stream.id}
 streamId={stream.id}
 name={stream.name}
 type={stream.type}
 data={streamData.get(stream.id) || []}
 statistics={statistics.get(stream.id)}
 anomalies={anomalies}
 color={getStreamColor(index)}
 movingAverage={chartOptions.showMovingAverage ? getMovingAverage(stream.id, 20) : undefined}
 bollingerBands={chartOptions.showBollingerBands ? getBollingerBands(stream.id, 20) : undefined}
 onRemove={() => removeStream(stream.id)}
 />
 ))}
 </div>
 ) : (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 p-12 text-center">
 <div className="max-w-md mx-auto">
 <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
 <Icon icon="solar:chart-2-linear" className="w-8 h-8 text-primary-500" />
 </div>
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
 No Data Streams
 </h3>
 <p className="text-secondary-500 mb-6">
 Add a data stream to start visualizing real-time data with live updates, 
 anomaly detection, and statistical analysis.
 </p>
 <button
 onClick={() => setShowAddStream(true)}
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
 >
 <Icon icon="solar:add-circle-linear" className="w-5 h-5" />
 Add Your First Stream
 </button>
 </div>
 </div>
 )}

 {/* Add stream button (floating) */}
 {streams.length > 0 && !showAddStream && (
 <button
 onClick={() => setShowAddStream(true)}
 className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-theme-primary text-white font-semibold rounded-xl border border-surface-200 dark:border-surface-700 hover:opacity-90 transition-opacity"
 >
 <Icon icon="solar:add-circle-linear" className="w-5 h-5" />
 Add Stream
 </button>
 )}

 {/* Add stream modal */}
 {showAddStream &&
 createPortal(
 <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={() => setShowAddStream(false)}
 />
 <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fade-in">
 <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
 Add Data Stream
 </h3>
 <button
 onClick={() => setShowAddStream(false)}
 className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
 >
 <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
 </button>
 </div>
 
 <div className="p-6 max-h-96 overflow-y-auto">
 <p className="text-sm text-secondary-500 mb-4">
 Choose a preset to quickly add a pre-configured data stream:
 </p>
 <div className="grid grid-cols-2 gap-3">
 {streamPresets.map(preset => {
 const typeConfig = streamTypeConfig[preset.config.type]
 return (
 <button
 key={preset.id}
 onClick={() => handleAddPreset(preset.id)}
 className="flex items-start gap-3 p-4 text-left rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all group"
 >
 <div 
 className="p-2.5 rounded-xl shrink-0"
 style={{ backgroundColor: `${typeConfig.color}20` }}
 >
 <Icon 
 icon={preset.icon} 
 className="w-5 h-5" 
 style={{ color: typeConfig.color }}
 />
 </div>
 <div>
 <h5 className="font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
 {preset.name}
 </h5>
 <p className="text-xs text-secondary-500 mt-0.5">
 {preset.description}
 </p>
 </div>
 </button>
 )
 })}
 </div>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 )
}

export default SimulationDashboard
