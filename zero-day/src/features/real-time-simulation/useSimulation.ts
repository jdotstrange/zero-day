/**
 * Real-Time Simulation Hook
 * React hook for managing simulation state and data
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { 
 StreamConfig, 
 TimeSeriesDataPoint, 
 StreamStatistics, 
 Anomaly, 
 SimulationEvent,
 AnomalyConfig,
 AlertConfig,
 Alert
} from './types'
import { 
 getSimulationEngine, 
 calculateMovingAverage, 
 calculateEMA, 
 calculateBollingerBands,
 exportToCSV,
 exportToJSON,
 generateId
} from './engine'
import { streamPresets, generateStreamId } from './config'

export interface UseSimulationState {
 // Control state
 isRunning: boolean
 tickCount: number
 
 // Stream data
 streams: StreamConfig[]
 streamData: Map<string, TimeSeriesDataPoint[]>
 statistics: Map<string, StreamStatistics>
 
 // Anomalies & Alerts
 anomalies: Anomaly[]
 alerts: Alert[]
 unacknowledgedAnomalyCount: number
 unacknowledgedAlertCount: number
}

export interface UseSimulationActions {
 // Control
 start: () => void
 stop: () => void
 reset: () => void
 
 // Stream management
 addStream: (config: StreamConfig) => void
 addStreamFromPreset: (presetId: string) => void
 removeStream: (streamId: string) => void
 updateStream: (streamId: string, updates: Partial<StreamConfig>) => void
 
 // Data access
 getStreamData: (streamId: string, limit?: number) => TimeSeriesDataPoint[]
 getMovingAverage: (streamId: string, window?: number) => number[]
 getEMA: (streamId: string, alpha?: number) => number[]
 getBollingerBands: (streamId: string, period?: number) => { upper: number[]; middle: number[]; lower: number[] }
 
 // Anomaly detection
 setAnomalyConfig: (config: Partial<AnomalyConfig>) => void
 acknowledgeAnomaly: (anomalyId: string) => void
 acknowledgeAllAnomalies: (streamId?: string) => void
 
 // Alerts
 addAlert: (config: AlertConfig) => void
 removeAlert: (alertId: string) => void
 acknowledgeAlert: (alertId: string) => void
 
 // Export
 exportData: (streamId: string, format: 'json' | 'csv') => string
}

export interface UseSimulationReturn extends UseSimulationState, UseSimulationActions {}

export function useSimulation(): UseSimulationReturn {
 const engine = useRef(getSimulationEngine())
 
 // State
 const [isRunning, setIsRunning] = useState(false)
 const [tickCount, setTickCount] = useState(0)
 const [streams, setStreams] = useState<StreamConfig[]>([])
 const [streamData, setStreamData] = useState<Map<string, TimeSeriesDataPoint[]>>(new Map())
 const [statistics, setStatistics] = useState<Map<string, StreamStatistics>>(new Map())
 const [anomalies, setAnomalies] = useState<Anomaly[]>([])
 const [alerts, setAlerts] = useState<Alert[]>([])

 // Computed values
 const unacknowledgedAnomalyCount = anomalies.filter(a => !a.acknowledged).length
 const unacknowledgedAlertCount = alerts.filter(a => !a.acknowledged).length

 // Subscribe to engine events
 useEffect(() => {
 const unsubscribe = engine.current.subscribe((event: SimulationEvent) => {
 switch (event.type) {
 case 'started':
 setIsRunning(true)
 break
 
 case 'stopped':
 setIsRunning(false)
 break
 
 case 'data':
 setTickCount(prev => prev + 1)
 setStreamData(prev => {
 const newMap = new Map(prev)
 const data = engine.current.getStreamData(event.streamId)
 newMap.set(event.streamId, [...data])
 return newMap
 })
 break
 
 case 'anomaly':
 setAnomalies(prev => [...prev.slice(-99), event.anomaly])
 break
 
 case 'statistics':
 setStatistics(prev => {
 const newMap = new Map(prev)
 newMap.set(event.streamId, event.stats)
 return newMap
 })
 break
 
 case 'error':
 console.error('Simulation error:', event.message)
 break
 }
 })

 return () => {
 unsubscribe()
 }
 }, [])

 // Sync alerts from engine
 useEffect(() => {
 const interval = setInterval(() => {
 if (isRunning) {
 const engineAlerts = engine.current.getAlerts()
 if (engineAlerts.length !== alerts.length) {
 setAlerts([...engineAlerts])
 }
 }
 }, 1000)

 return () => clearInterval(interval)
 }, [isRunning, alerts.length])

 // Control actions
 const start = useCallback(() => {
 engine.current.start()
 }, [])

 const stop = useCallback(() => {
 engine.current.stop()
 }, [])

 const reset = useCallback(() => {
 engine.current.reset()
 setIsRunning(false)
 setTickCount(0)
 setStreams([])
 setStreamData(new Map())
 setStatistics(new Map())
 setAnomalies([])
 setAlerts([])
 }, [])

 // Stream management
 const addStream = useCallback((config: StreamConfig) => {
 const finalConfig = {
 ...config,
 id: config.id || generateStreamId()
 }
 engine.current.addStream(finalConfig)
 setStreams(prev => [...prev, finalConfig])
 
 if (isRunning) {
 // Stream will auto-start if engine is running
 }
 }, [isRunning])

 const addStreamFromPreset = useCallback((presetId: string) => {
 const preset = streamPresets.find(p => p.id === presetId)
 if (!preset) return

 const config: StreamConfig = {
 ...preset.config,
 id: generateStreamId(),
 isActive: true
 }
 addStream(config)
 }, [addStream])

 const removeStream = useCallback((streamId: string) => {
 engine.current.removeStream(streamId)
 setStreams(prev => prev.filter(s => s.id !== streamId))
 setStreamData(prev => {
 const newMap = new Map(prev)
 newMap.delete(streamId)
 return newMap
 })
 setStatistics(prev => {
 const newMap = new Map(prev)
 newMap.delete(streamId)
 return newMap
 })
 setAnomalies(prev => prev.filter(a => a.streamId !== streamId))
 }, [])

 const updateStream = useCallback((streamId: string, updates: Partial<StreamConfig>) => {
 setStreams(prev => prev.map(s => 
 s.id === streamId ? { ...s, ...updates } : s
 ))
 // Note: Full stream update would require removing and re-adding
 }, [])

 // Data access
 const getStreamData = useCallback((streamId: string, limit?: number): TimeSeriesDataPoint[] => {
 const data = streamData.get(streamId) || []
 return limit ? data.slice(-limit) : data
 }, [streamData])

 const getMovingAverage = useCallback((streamId: string, window = 20): number[] => {
 const data = streamData.get(streamId) || []
 return calculateMovingAverage(data, window)
 }, [streamData])

 const getEMA = useCallback((streamId: string, alpha = 0.2): number[] => {
 const data = streamData.get(streamId) || []
 return calculateEMA(data, alpha)
 }, [streamData])

 const getBollingerBands = useCallback((
 streamId: string, 
 period = 20
 ): { upper: number[]; middle: number[]; lower: number[] } => {
 const data = streamData.get(streamId) || []
 return calculateBollingerBands(data, period)
 }, [streamData])

 // Anomaly detection
 const setAnomalyConfig = useCallback((config: Partial<AnomalyConfig>) => {
 engine.current.setAnomalyConfig(config)
 }, [])

 const acknowledgeAnomaly = useCallback((anomalyId: string) => {
 setAnomalies(prev => prev.map(a => 
 a.id === anomalyId ? { ...a, acknowledged: true } : a
 ))
 }, [])

 const acknowledgeAllAnomalies = useCallback((streamId?: string) => {
 setAnomalies(prev => prev.map(a => 
 (!streamId || a.streamId === streamId) ? { ...a, acknowledged: true } : a
 ))
 }, [])

 // Alerts
 const addAlert = useCallback((config: AlertConfig) => {
 const finalConfig = {
 ...config,
 id: config.id || generateId()
 }
 engine.current.addAlert(finalConfig)
 }, [])

 const removeAlert = useCallback((alertId: string) => {
 engine.current.removeAlert(alertId)
 setAlerts(prev => prev.filter(a => a.configId !== alertId))
 }, [])

 const acknowledgeAlert = useCallback((alertId: string) => {
 setAlerts(prev => prev.map(a => 
 a.id === alertId ? { ...a, acknowledged: true } : a
 ))
 }, [])

 // Export
 const exportData = useCallback((streamId: string, format: 'json' | 'csv'): string => {
 const data = streamData.get(streamId) || []
 return format === 'csv' ? exportToCSV(data) : exportToJSON(data)
 }, [streamData])

 return {
 // State
 isRunning,
 tickCount,
 streams,
 streamData,
 statistics,
 anomalies,
 alerts,
 unacknowledgedAnomalyCount,
 unacknowledgedAlertCount,

 // Actions
 start,
 stop,
 reset,
 addStream,
 addStreamFromPreset,
 removeStream,
 updateStream,
 getStreamData,
 getMovingAverage,
 getEMA,
 getBollingerBands,
 setAnomalyConfig,
 acknowledgeAnomaly,
 acknowledgeAllAnomalies,
 addAlert,
 removeAlert,
 acknowledgeAlert,
 exportData
 }
}

export default useSimulation
