/**
 * Rule Tester Component
 * Test rules against sample data with real-time results
 */

import { useState, useMemo } from 'react'
import { Icon } from '@/components/common'
import type { Rule, RuleExecutionResult } from '../types'
import { executeRules } from '../engine'
import { getFieldsByCategory } from '../config'

interface RuleTesterProps {
 rules: Rule[]
}

// Sample test data presets
const testDataPresets = [
 {
 id: 'high-value-order',
 name: 'High Value Order',
 description: 'Order over $1,500 from EU',
 data: {
 order: {
 total: 1850,
 status: 'pending',
 items: 5,
 paymentMethod: 'credit_card',
 region: 'EU',
 },
 user: {
 name: 'John Doe',
 email: 'john@example.com',
 role: 'user',
 status: 'active',
 loginCount: 45,
 },
 product: {
 name: 'Premium Widget',
 price: 299,
 stock: 5,
 category: 'electronics',
 },
 },
 },
 {
 id: 'low-stock',
 name: 'Low Stock Product',
 description: 'Product with only 3 items left',
 data: {
 product: {
 name: 'Exclusive Item',
 price: 599,
 stock: 3,
 category: 'electronics',
 },
 user: {
 name: 'Admin User',
 email: 'admin@example.com',
 role: 'admin',
 status: 'active',
 loginCount: 150,
 },
 },
 },
 {
 id: 'vip-customer',
 name: 'VIP Customer',
 description: 'High-score qualified lead',
 data: {
 lead: {
 score: 92,
 status: 'qualified',
 value: 25000,
 source: 'referral',
 },
 user: {
 name: 'Sarah VIP',
 email: 'sarah@vip.com',
 role: 'user',
 status: 'active',
 loginCount: 200,
 },
 },
 },
 {
 id: 'inactive-user',
 name: 'Inactive User',
 description: 'User with low engagement',
 data: {
 user: {
 name: 'Ghost User',
 email: 'ghost@example.com',
 role: 'user',
 status: 'active',
 loginCount: 2,
 },
 analytics: {
 revenue: 50,
 visitors: 10,
 conversionRate: 0.5,
 bounceRate: 85,
 avgSessionDuration: 1,
 },
 },
 },
]

export function RuleTester({ rules }: RuleTesterProps) {
 const [testData, setTestData] = useState<Record<string, unknown>>(testDataPresets[0].data)
 const [selectedPreset, setSelectedPreset] = useState(testDataPresets[0].id)
 const [results, setResults] = useState<RuleExecutionResult[]>([])
 const [isRunning, setIsRunning] = useState(false)
 const [notifications, setNotifications] = useState<{ title: string; message: string; type: string }[]>([])
 const [jsonMode, setJsonMode] = useState(false)
 const [jsonInput, setJsonInput] = useState('')
 const [jsonError, setJsonError] = useState('')

 const fieldsByCategory = useMemo(() => getFieldsByCategory(), [])

 const handlePresetSelect = (presetId: string) => {
 const preset = testDataPresets.find((p) => p.id === presetId)
 if (preset) {
 setSelectedPreset(presetId)
 setTestData(preset.data)
 setJsonInput(JSON.stringify(preset.data, null, 2))
 setResults([])
 setNotifications([])
 }
 }

 const handleFieldChange = (path: string, value: unknown) => {
 const newData = { ...testData }
 const keys = path.split('.')
 let current: Record<string, unknown> = newData as Record<string, unknown>
 
 for (let i = 0; i < keys.length - 1; i++) {
 if (!current[keys[i]]) {
 current[keys[i]] = {}
 }
 current = current[keys[i]] as Record<string, unknown>
 }
 current[keys[keys.length - 1]] = value
 
 setTestData(newData)
 setJsonInput(JSON.stringify(newData, null, 2))
 }

 const handleJsonChange = (json: string) => {
 setJsonInput(json)
 setJsonError('')
 try {
 const parsed = JSON.parse(json)
 setTestData(parsed)
 } catch {
 setJsonError('Invalid JSON format')
 }
 }

 const handleRunTest = async () => {
 setIsRunning(true)
 setResults([])
 setNotifications([])

 // Simulate processing delay
 await new Promise((resolve) => setTimeout(resolve, 500))

 const newNotifications: typeof notifications = []
 
 const executionResults = executeRules(rules, testData, {
 onNotification: (config) => {
 newNotifications.push({
 title: String(config.title || 'Notification'),
 message: String(config.message || ''),
 type: String(config.type || 'info'),
 })
 },
 })

 setResults(executionResults)
 setNotifications(newNotifications)
 setIsRunning(false)
 }

 const matchedRules = results.filter((r) => r.matched)
 const enabledRules = rules.filter((r) => r.enabled)

 const getNestedValue = (obj: unknown, path: string): unknown => {
 return path.split('.').reduce((acc: unknown, key) => {
 if (acc && typeof acc === 'object' && key in acc) {
 return (acc as Record<string, unknown>)[key]
 }
 return undefined
 }, obj)
 }

 return (
 <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
 {/* Header */}
 <div className="px-6 py-5 bg-success-600">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
 <Icon icon="solar:test-tube-linear" className="w-6 h-6 text-white" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">Rule Tester</h2>
 <p className="text-sm text-white/80">
 Test your rules against sample data
 </p>
 </div>
 </div>

 <button
 onClick={handleRunTest}
 disabled={isRunning || enabledRules.length === 0}
 className="flex items-center gap-2 px-5 py-2.5 bg-white text-success-600 text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {isRunning ? (
 <>
 <span className="w-4 h-4 border-2 border-success-600 border-t-transparent rounded-full animate-spin" />
 Running...
 </>
 ) : (
 <>
 <Icon icon="solar:play-linear" className="w-4 h-4" />
 Run Test ({enabledRules.length} rules)
 </>
 )}
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-surface-200 dark:divide-surface-700">
 {/* Test Data Input */}
 <div className="p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">
 Test Data
 </h3>
 <div className="flex items-center gap-2">
 <button
 onClick={() => setJsonMode(!jsonMode)}
 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
 jsonMode
 ? 'bg-primary-500 text-white'
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400'
 }`}
 >
 {jsonMode ? 'Form View' : 'JSON View'}
 </button>
 </div>
 </div>

 {/* Presets */}
 <div className="mb-4">
 <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-2">
 Quick Presets
 </label>
 <div className="flex flex-wrap gap-2">
 {testDataPresets.map((preset) => (
 <button
 key={preset.id}
 onClick={() => handlePresetSelect(preset.id)}
 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
 selectedPreset === preset.id
 ? 'bg-primary-500 text-white shadow-sm'
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 title={preset.description}
 >
 {preset.name}
 </button>
 ))}
 </div>
 </div>

 {jsonMode ? (
 <div>
 <textarea
 value={jsonInput}
 onChange={(e) => handleJsonChange(e.target.value)}
 rows={15}
 className={`w-full px-4 py-3 font-mono text-sm bg-surface-50 dark:bg-surface-800 border rounded-xl focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
 jsonError
 ? 'border-danger-500'
 : 'border-surface-200 dark:border-surface-700'
 }`}
 placeholder="Enter JSON data..."
 />
 {jsonError && (
 <p className="mt-2 text-xs text-danger-500">{jsonError}</p>
 )}
 </div>
 ) : (
 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
 {Object.entries(fieldsByCategory).map(([category, fields]) => (
 <div key={category}>
 <h4 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-2">
 {category}
 </h4>
 <div className="space-y-2">
 {fields.map((field) => {
 const value = getNestedValue(testData, field.name)
 return (
 <div key={field.name} className="flex items-center gap-3">
 <label className="w-36 text-xs text-secondary-600 dark:text-secondary-400 truncate">
 {field.label}
 </label>
 {field.options ? (
 <select
 value={String(value || '')}
 onChange={(e) => handleFieldChange(field.name, e.target.value)}
 className="flex-1 px-3 py-1.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg"
 >
 <option value="">--</option>
 {field.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 ) : field.type === 'number' ? (
 <input
 type="number"
 value={value !== undefined ? Number(value) : ''}
 onChange={(e) =>
 handleFieldChange(field.name, parseFloat(e.target.value) || 0)
 }
 className="flex-1 px-3 py-1.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg"
 />
 ) : field.type === 'boolean' ? (
 <select
 value={String(value || 'false')}
 onChange={(e) =>
 handleFieldChange(field.name, e.target.value === 'true')
 }
 className="flex-1 px-3 py-1.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg"
 >
 <option value="true">True</option>
 <option value="false">False</option>
 </select>
 ) : (
 <input
 type="text"
 value={String(value || '')}
 onChange={(e) => handleFieldChange(field.name, e.target.value)}
 className="flex-1 px-3 py-1.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg"
 />
 )}
 </div>
 )
 })}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Results */}
 <div className="p-6 bg-surface-50 dark:bg-surface-800/50">
 <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">
 Execution Results
 </h3>

 {results.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 text-center">
 <div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-full mb-4">
 <Icon
 icon="solar:play-circle-linear"
 className="w-10 h-10 text-secondary-300 dark:text-secondary-600"
 />
 </div>
 <p className="text-sm text-secondary-500 dark:text-secondary-400">
 Click "Run Test" to see results
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {/* Summary */}
 <div className="grid grid-cols-2 gap-3">
 <div className="p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
 <div className="flex items-center gap-2 mb-1">
 <Icon
 icon="solar:check-circle-bold"
 className="w-5 h-5 text-success-500"
 />
 <span className="text-2xl font-bold text-success-600 dark:text-success-400">
 {matchedRules.length}
 </span>
 </div>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Rules Matched
 </p>
 </div>
 <div className="p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
 <div className="flex items-center gap-2 mb-1">
 <Icon
 icon="solar:bolt-linear"
 className="w-5 h-5 text-accent-500"
 />
 <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">
 {matchedRules.reduce((acc, r) => acc + r.triggeredActions.length, 0)}
 </span>
 </div>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 Actions Triggered
 </p>
 </div>
 </div>

 {/* Notifications */}
 {notifications.length > 0 && (
 <div className="space-y-2">
 <h4 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase">
 Notifications Triggered
 </h4>
 {notifications.map((notif, index) => (
 <div
 key={index}
 className={`p-3 rounded-lg border ${
 notif.type === 'error'
 ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
 : notif.type === 'warning'
 ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'
 : notif.type === 'success'
 ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
 : 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800'
 }`}
 >
 <p className="text-sm font-medium text-secondary-900 dark:text-white">
 {notif.title}
 </p>
 <p className="text-xs text-secondary-600 dark:text-secondary-400">
 {notif.message}
 </p>
 </div>
 ))}
 </div>
 )}

 {/* Rule Results */}
 <div className="space-y-2 max-h-[300px] overflow-y-auto">
 <h4 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase sticky top-0 bg-surface-50 dark:bg-surface-800/50 py-1">
 Rule Results
 </h4>
 {results.map((result) => (
 <div
 key={result.ruleId}
 className={`p-3 rounded-lg border ${
 result.matched
 ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
 : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700'
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <Icon
 icon={
 result.matched
 ? 'solar:check-circle-bold'
 : 'solar:close-circle-linear'
 }
 className={`w-4 h-4 ${
 result.matched
 ? 'text-success-600 dark:text-success-400'
 : 'text-secondary-400'
 }`}
 />
 <span className="text-sm font-medium text-secondary-900 dark:text-white">
 {result.ruleName || 'Unnamed Rule'}
 </span>
 </div>
 <span
 className={`px-2 py-0.5 text-xs font-medium rounded ${
 result.matched
 ? 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300'
 : 'bg-surface-100 text-secondary-500 dark:bg-surface-700 dark:text-secondary-400'
 }`}
 >
 {result.matched ? 'MATCHED' : 'NOT MATCHED'}
 </span>
 </div>

 {result.matched && result.triggeredActions.length > 0 && (
 <div className="mt-2 pt-2 border-t border-success-200 dark:border-success-800">
 <p className="text-xs text-success-700 dark:text-success-300 mb-1">
 Triggered Actions:
 </p>
 <div className="flex flex-wrap gap-1">
 {result.triggeredActions.map((action) => (
 <span
 key={action.id}
 className="px-2 py-0.5 text-xs bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-300 rounded"
 >
 {action.type}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}
