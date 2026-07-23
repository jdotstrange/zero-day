/**
 * Rule Engine - React Hook
 * State management for rules with localStorage persistence
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Rule, RuleExecutionResult } from './types'
import {
 executeRules,
 validateRule,
 createEmptyRule,
 generateId,
} from './engine'
import { ruleTemplates } from './config'

const STORAGE_KEY = 'zeroday_rules'

interface UseRuleEngineOptions {
 autoSave?: boolean
}

interface RuleEngineState {
 rules: Rule[]
 executionHistory: RuleExecutionResult[]
 selectedRuleId: string | null
 isLoading: boolean
}

export function useRuleEngine(options: UseRuleEngineOptions = {}) {
 const { autoSave = true } = options

 const [state, setState] = useState<RuleEngineState>({
 rules: [],
 executionHistory: [],
 selectedRuleId: null,
 isLoading: true,
 })

 // Load rules from localStorage on mount
 useEffect(() => {
 try {
 const stored = localStorage.getItem(STORAGE_KEY)
 if (stored) {
 const parsed = JSON.parse(stored)
 setState((prev) => ({
 ...prev,
 rules: parsed,
 isLoading: false,
 }))
 } else {
 setState((prev) => ({ ...prev, isLoading: false }))
 }
 } catch (error) {
 console.error('Failed to load rules:', error)
 setState((prev) => ({ ...prev, isLoading: false }))
 }
 }, [])

 // Save rules to localStorage when they change
 useEffect(() => {
 if (autoSave && !state.isLoading) {
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state.rules))
 } catch (error) {
 console.error('Failed to save rules:', error)
 }
 }
 }, [state.rules, autoSave, state.isLoading])

 // Get selected rule
 const selectedRule = useMemo(() => {
 return state.rules.find((r) => r.id === state.selectedRuleId) ?? null
 }, [state.rules, state.selectedRuleId])

 // Add new rule
 const addRule = useCallback((rule?: Partial<Rule>) => {
 const newRule: Rule = {
 ...createEmptyRule(),
 ...rule,
 id: generateId(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 }
 setState((prev) => ({
 ...prev,
 rules: [...prev.rules, newRule],
 selectedRuleId: newRule.id,
 }))
 return newRule
 }, [])

 // Update rule
 const updateRule = useCallback((id: string, updates: Partial<Rule>) => {
 setState((prev) => ({
 ...prev,
 rules: prev.rules.map((rule) =>
 rule.id === id
 ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
 : rule
 ),
 }))
 }, [])

 // Delete rule
 const deleteRule = useCallback((id: string) => {
 setState((prev) => ({
 ...prev,
 rules: prev.rules.filter((rule) => rule.id !== id),
 selectedRuleId: prev.selectedRuleId === id ? null : prev.selectedRuleId,
 }))
 }, [])

 // Duplicate rule
 const duplicateRule = useCallback((id: string) => {
 const rule = state.rules.find((r) => r.id === id)
 if (!rule) return null

 const newRule: Rule = {
 ...JSON.parse(JSON.stringify(rule)),
 id: generateId(),
 name: `${rule.name} (Copy)`,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 triggerCount: 0,
 }

 setState((prev) => ({
 ...prev,
 rules: [...prev.rules, newRule],
 }))

 return newRule
 }, [state.rules])

 // Toggle rule enabled/disabled
 const toggleRule = useCallback((id: string) => {
 setState((prev) => ({
 ...prev,
 rules: prev.rules.map((rule) =>
 rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
 ),
 }))
 }, [])

 // Select rule
 const selectRule = useCallback((id: string | null) => {
 setState((prev) => ({ ...prev, selectedRuleId: id }))
 }, [])

 // Execute rules against data
 const execute = useCallback(
 (data: Record<string, unknown>) => {
 const results = executeRules(state.rules, data, {
 onNotification: (config) => {
 // Log notification (in real app, show toast)
 console.log('Notification:', config)
 },
 onHighlight: (config, _data) => {
 console.log('Highlight:', config)
 },
 onAddTag: (config, _data) => {
 console.log('Add Tag:', config)
 },
 })

 // Update trigger counts for matched rules
 const matchedRuleIds = results.filter((r) => r.matched).map((r) => r.ruleId)
 if (matchedRuleIds.length > 0) {
 setState((prev) => ({
 ...prev,
 rules: prev.rules.map((rule) =>
 matchedRuleIds.includes(rule.id)
 ? { ...rule, triggerCount: rule.triggerCount + 1 }
 : rule
 ),
 executionHistory: [...results, ...prev.executionHistory].slice(0, 100),
 }))
 } else {
 setState((prev) => ({
 ...prev,
 executionHistory: [...results, ...prev.executionHistory].slice(0, 100),
 }))
 }

 return results
 },
 [state.rules]
 )

 // Create rule from template
 const createFromTemplate = useCallback((templateId: string) => {
 const template = ruleTemplates.find((t) => t.id === templateId)
 if (!template) return null

 const newRule: Rule = {
 ...template.rule,
 id: generateId(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 triggerCount: 0,
 }

 setState((prev) => ({
 ...prev,
 rules: [...prev.rules, newRule],
 selectedRuleId: newRule.id,
 }))

 return newRule
 }, [])

 // Validate rule
 const validate = useCallback((rule: Partial<Rule>) => {
 return validateRule(rule)
 }, [])

 // Import rules from JSON
 const importRules = useCallback((json: string) => {
 try {
 const imported = JSON.parse(json)
 const rules = Array.isArray(imported) ? imported : [imported]
 
 // Generate new IDs for imported rules
 const newRules = rules.map((rule: Rule) => ({
 ...rule,
 id: generateId(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 triggerCount: 0,
 }))

 setState((prev) => ({
 ...prev,
 rules: [...prev.rules, ...newRules],
 }))

 return { success: true, count: newRules.length }
 } catch (error) {
 return { success: false, error: 'Invalid JSON format' }
 }
 }, [])

 // Export rules to JSON
 const exportRules = useCallback((ruleIds?: string[]) => {
 const rulesToExport = ruleIds
 ? state.rules.filter((r) => ruleIds.includes(r.id))
 : state.rules

 return JSON.stringify(rulesToExport, null, 2)
 }, [state.rules])

 // Clear all rules
 const clearAll = useCallback(() => {
 setState((prev) => ({
 ...prev,
 rules: [],
 selectedRuleId: null,
 executionHistory: [],
 }))
 }, [])

 // Clear execution history
 const clearHistory = useCallback(() => {
 setState((prev) => ({
 ...prev,
 executionHistory: [],
 }))
 }, [])

 // Reorder rules (for priority)
 const reorderRules = useCallback((startIndex: number, endIndex: number) => {
 setState((prev) => {
 const newRules = Array.from(prev.rules)
 const [removed] = newRules.splice(startIndex, 1)
 newRules.splice(endIndex, 0, removed)
 
 // Update priorities based on new order
 const updatedRules = newRules.map((rule, index) => ({
 ...rule,
 priority: newRules.length - index,
 }))

 return { ...prev, rules: updatedRules }
 })
 }, [])

 return {
 // State
 rules: state.rules,
 executionHistory: state.executionHistory,
 selectedRule,
 selectedRuleId: state.selectedRuleId,
 isLoading: state.isLoading,
 
 // Actions
 addRule,
 updateRule,
 deleteRule,
 duplicateRule,
 toggleRule,
 selectRule,
 execute,
 createFromTemplate,
 validate,
 importRules,
 exportRules,
 clearAll,
 clearHistory,
 reorderRules,
 
 // Templates
 templates: ruleTemplates,
 }
}
