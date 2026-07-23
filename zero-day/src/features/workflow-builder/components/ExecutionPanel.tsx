/**
 * Execution Panel Component
 * Shows workflow execution logs and results
 */

import { useState } from 'react'
import { Icon } from '@/components/common'
import type { ExecutionLogEntry, ExecutionResult } from '../types'
import { nodeTypeColors, nodeTypeIcons } from '../config'

interface ExecutionPanelProps {
 isExecuting: boolean
 logs: ExecutionLogEntry[]
 result: ExecutionResult | null
 onClearLogs: () => void
 onClose: () => void
}

export function ExecutionPanel({
 isExecuting,
 logs,
 result,
 onClearLogs,
 onClose,
}: ExecutionPanelProps) {
 const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
 const [viewMode, setViewMode] = useState<'logs' | 'result'>('logs')

 const getStatusColor = (status: ExecutionLogEntry['status']) => {
 switch (status) {
 case 'success': return 'text-green-500'
 case 'failed': return 'text-red-500'
 case 'running': return 'text-blue-500'
 case 'pending': return 'text-secondary-400'
 case 'skipped': return 'text-yellow-500'
 default: return 'text-secondary-400'
 }
 }

 const getStatusIcon = (status: ExecutionLogEntry['status']) => {
 switch (status) {
 case 'success': return 'solar:check-circle-linear'
 case 'failed': return 'solar:close-circle-linear'
 case 'running': return 'solar:refresh-linear'
 case 'pending': return 'solar:clock-circle-linear'
 case 'skipped': return 'solar:skip-next-linear'
 default: return 'solar:question-circle-linear'
 }
 }

 return (
 <div className="flex flex-col h-full bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700">
 {/* Header */}
 <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Icon icon="solar:play-circle-linear" className="w-5 h-5 text-primary-500" />
 <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">
 Execution
 </h3>
 {isExecuting && (
 <span className="flex items-center gap-1 text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
 <Icon icon="solar:refresh-linear" className="w-3 h-3 animate-spin" />
 Running
 </span>
 )}
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={onClearLogs}
 className="p-1.5 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
 title="Clear logs"
 >
 <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
 </button>
 <button
 onClick={onClose}
 className="p-1.5 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
 >
 <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* View toggle */}
 <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
 <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5">
 <button
 onClick={() => setViewMode('logs')}
 className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
 viewMode === 'logs'
 ? 'bg-white dark:bg-surface-700 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
 }`}
 >
 Logs ({logs.length})
 </button>
 <button
 onClick={() => setViewMode('result')}
 className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
 viewMode === 'result'
 ? 'bg-white dark:bg-surface-700 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
 }`}
 >
 Result
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto">
 {viewMode === 'logs' ? (
 <div className="p-2 space-y-1">
 {logs.length === 0 ? (
 <div className="text-center py-8">
 <Icon icon="solar:document-text-linear" className="w-8 h-8 mx-auto text-secondary-300 mb-2" />
 <p className="text-sm text-secondary-400">No execution logs yet</p>
 <p className="text-xs text-secondary-400 mt-1">Run the workflow to see logs here</p>
 </div>
 ) : (
 logs.map((log, index) => (
 <div
 key={log.id}
 className={`rounded-lg border ${
 expandedLogId === log.id
 ? 'border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/10'
 : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
 }`}
 >
 <button
 onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
 className="w-full px-3 py-2 flex items-center gap-2 text-left"
 >
 <span className="text-xs text-secondary-400 w-5">{index + 1}</span>
 <Icon
 icon={getStatusIcon(log.status)}
 className={`w-4 h-4 shrink-0 ${getStatusColor(log.status)} ${log.status === 'running' ? 'animate-spin' : ''}`}
 />
 <Icon
 icon={nodeTypeIcons[log.nodeType]}
 className="w-4 h-4 shrink-0"
 style={{ color: nodeTypeColors[log.nodeType] }}
 />
 <span className="flex-1 text-sm font-medium text-secondary-800 dark:text-secondary-200 truncate">
 {log.nodeName}
 </span>
 {log.duration !== undefined && (
 <span className="text-xs text-secondary-400 shrink-0">
 {log.duration}ms
 </span>
 )}
 <Icon
 icon={expandedLogId === log.id ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
 className="w-3 h-3 text-secondary-400"
 />
 </button>

 {expandedLogId === log.id && (
 <div className="px-3 pb-3 space-y-2">
 {log.error && (
 <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
 <p className="text-xs font-medium text-red-600 dark:text-red-400">Error</p>
 <p className="text-xs text-red-500 mt-0.5">{log.error}</p>
 </div>
 )}
 
 <div>
 <p className="text-xs font-medium text-secondary-500 mb-1">Input</p>
 <pre className="text-xs bg-surface-100 dark:bg-surface-800 p-2 rounded overflow-x-auto">
 {JSON.stringify(log.input, null, 2)}
 </pre>
 </div>
 
 {log.output !== undefined && (
 <div>
 <p className="text-xs font-medium text-secondary-500 mb-1">Output</p>
 <pre className="text-xs bg-surface-100 dark:bg-surface-800 p-2 rounded overflow-x-auto">
 {JSON.stringify(log.output, null, 2)}
 </pre>
 </div>
 )}
 </div>
 )}
 </div>
 ))
 )}
 </div>
 ) : (
 <div className="p-4">
 {result ? (
 <div className="space-y-4">
 {/* Status */}
 <div className={`p-3 rounded-xl ${
 result.status === 'success'
 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
 : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
 }`}>
 <div className="flex items-center gap-2">
 <Icon
 icon={result.status === 'success' ? 'solar:check-circle-linear' : 'solar:close-circle-linear'}
 className={`w-5 h-5 ${result.status === 'success' ? 'text-green-500' : 'text-red-500'}`}
 />
 <span className={`text-sm font-semibold ${
 result.status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
 }`}>
 {result.status === 'success' ? 'Execution Successful' : 'Execution Failed'}
 </span>
 </div>
 {result.error && (
 <p className="text-sm text-red-600 dark:text-red-400 mt-1">{result.error}</p>
 )}
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 gap-3">
 <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
 <p className="text-xs text-secondary-400">Duration</p>
 <p className="text-lg font-semibold text-secondary-900 dark:text-white">
 {result.duration}ms
 </p>
 </div>
 <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
 <p className="text-xs text-secondary-400">Nodes Executed</p>
 <p className="text-lg font-semibold text-secondary-900 dark:text-white">
 {result.nodesExecuted}
 </p>
 </div>
 </div>

 {/* Output */}
 <div>
 <p className="text-xs font-medium text-secondary-500 mb-1">Final Output</p>
 <pre className="text-xs bg-surface-100 dark:bg-surface-800 p-3 rounded-lg overflow-x-auto max-h-48">
 {JSON.stringify(result.output, null, 2)}
 </pre>
 </div>
 </div>
 ) : (
 <div className="text-center py-8">
 <Icon icon="solar:chart-2-linear" className="w-8 h-8 mx-auto text-secondary-300 mb-2" />
 <p className="text-sm text-secondary-400">No execution result</p>
 <p className="text-xs text-secondary-400 mt-1">Run the workflow to see results</p>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 )
}

export default ExecutionPanel
