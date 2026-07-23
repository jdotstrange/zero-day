/**
 * Query Builder Hook
 * React hook for managing query state and operations
 */

import { useState, useCallback, useEffect } from 'react'
import type { Query, QueryFilter, QueryFilterGroup, QueryExportFormat, QueryResult } from './types'
import { 
 executeQuery, 
 exportQuery, 
 createEmptyFilter,
 createEmptyFilterGroup,
 createEmptyQuery,
 generateId,
 isFilterGroup
} from './engine'
import { queryPresets } from './config'

// localStorage key
const STORAGE_KEY = 'zeroday_saved_queries'

// Re-export engine functions for convenience
export { createEmptyFilter, createEmptyFilterGroup, createEmptyQuery }

export interface QueryBuilderState {
 query: Query
 savedQueries: Query[]
 result: QueryResult | null
 isExecuting: boolean
 lastExecutedAt: string | null
 exportedData: string | null
 exportFormat: QueryExportFormat | null
 error: string | null
}

export interface SortConfig {
 field: string
 direction: 'asc' | 'desc'
}

export interface QueryBuilderActions {
 // Query CRUD
 setQuery: (query: Query) => void
 updateQuery: (updates: Partial<Query>) => void
 resetQuery: () => void
 
 // Filter operations
 addFilter: (groupId: string) => void
 updateFilter: (filterId: string, updates: Partial<QueryFilter>) => void
 removeFilter: (filterId: string) => void
 
 // Group operations
 addGroup: (parentGroupId: string) => void
 updateGroupLogic: (groupId: string, logic: 'AND' | 'OR') => void
 removeGroup: (groupId: string) => void
 
 // Sort operations
 addSort: (config: SortConfig) => void
 removeSort: (field: string) => void
 clearSort: () => void
 
 // Pagination
 setLimit: (limit: number) => void
 setOffset: (offset: number) => void
 
 // Execution
 execute: <T extends Record<string, unknown>>(data: T[]) => void
 
 // Export
 exportAs: (format: QueryExportFormat) => void
 clearExport: () => void
 
 // Saved queries
 saveQuery: () => void
 loadQuery: (queryId: string) => void
 deleteQuery: (queryId: string) => void
 loadPreset: (presetId: string) => void
 
 // Error handling
 clearError: () => void
}

export interface UseQueryBuilderReturn extends QueryBuilderState, QueryBuilderActions {}

export function useQueryBuilder(initialQuery?: Query): UseQueryBuilderReturn {
 const [query, setQueryState] = useState<Query>(initialQuery || createEmptyQuery())
 const [savedQueries, setSavedQueries] = useState<Query[]>([])
 const [result, setResult] = useState<QueryResult | null>(null)
 const [isExecuting, setIsExecuting] = useState(false)
 const [lastExecutedAt, setLastExecutedAt] = useState<string | null>(null)
 const [exportedData, setExportedData] = useState<string | null>(null)
 const [exportFormat, setExportFormat] = useState<QueryExportFormat | null>(null)
 const [error, setError] = useState<string | null>(null)

 // Load saved queries from localStorage
 useEffect(() => {
 try {
 const stored = localStorage.getItem(STORAGE_KEY)
 if (stored) {
 setSavedQueries(JSON.parse(stored))
 }
 } catch (err) {
 console.error('Failed to load saved queries:', err)
 }
 }, [])

 // Save queries to localStorage
 const persistQueries = useCallback((queries: Query[]) => {
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(queries))
 } catch (err) {
 console.error('Failed to save queries:', err)
 }
 }, [])

 // Query operations
 const setQuery = useCallback((newQuery: Query) => {
 setQueryState(newQuery)
 setResult(null)
 setExportedData(null)
 }, [])

 const updateQuery = useCallback((updates: Partial<Query>) => {
 setQueryState(prev => ({
 ...prev,
 ...updates,
 updatedAt: new Date().toISOString()
 }))
 }, [])

 const resetQuery = useCallback(() => {
 setQueryState(createEmptyQuery())
 setResult(null)
 setExportedData(null)
 setError(null)
 }, [])

 // Helper to find and update filter in nested groups
 const findAndUpdateFilter = useCallback((
 group: QueryFilterGroup,
 filterId: string,
 updater: (filter: QueryFilter) => QueryFilter | null
 ): QueryFilterGroup => {
 const newFilters = group.filters.map(item => {
 if (!isFilterGroup(item)) {
 // It's a filter
 if (item.id === filterId) {
 return updater(item)
 }
 return item
 } else {
 // It's a group
 return findAndUpdateFilter(item, filterId, updater)
 }
 }).filter(Boolean) as (QueryFilter | QueryFilterGroup)[]

 return { ...group, filters: newFilters }
 }, [])

 // Helper to update group in nested structure
 const findAndUpdateGroup = useCallback((
 group: QueryFilterGroup,
 groupId: string,
 updater: (g: QueryFilterGroup) => QueryFilterGroup | null
 ): QueryFilterGroup | null => {
 if (group.id === groupId) {
 return updater(group)
 }

 const newFilters = group.filters.map(item => {
 if (isFilterGroup(item)) {
 return findAndUpdateGroup(item, groupId, updater)
 }
 return item
 }).filter(Boolean) as (QueryFilter | QueryFilterGroup)[]

 return { ...group, filters: newFilters }
 }, [])

 // Filter operations
 const addFilter = useCallback((groupId: string) => {
 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateGroup(
 prev.filterGroup,
 groupId,
 (group) => ({
 ...group,
 filters: [...group.filters, createEmptyFilter()]
 })
 ) || prev.filterGroup,
 updatedAt: new Date().toISOString()
 }))
 }, [findAndUpdateGroup])

 const updateFilter = useCallback((filterId: string, updates: Partial<QueryFilter>) => {
 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateFilter(
 prev.filterGroup,
 filterId,
 (filter) => ({ ...filter, ...updates })
 ),
 updatedAt: new Date().toISOString()
 }))
 }, [findAndUpdateFilter])

 const removeFilter = useCallback((filterId: string) => {
 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateFilter(
 prev.filterGroup,
 filterId,
 () => null
 ),
 updatedAt: new Date().toISOString()
 }))
 }, [findAndUpdateFilter])

 // Group operations
 const addGroup = useCallback((parentGroupId: string) => {
 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateGroup(
 prev.filterGroup,
 parentGroupId,
 (group) => ({
 ...group,
 filters: [...group.filters, createEmptyFilterGroup()]
 })
 ) || prev.filterGroup,
 updatedAt: new Date().toISOString()
 }))
 }, [findAndUpdateGroup])

 const updateGroupLogic = useCallback((groupId: string, logic: 'AND' | 'OR') => {
 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateGroup(
 prev.filterGroup,
 groupId,
 (group) => ({ ...group, logic })
 ) || prev.filterGroup,
 updatedAt: new Date().toISOString()
 }))
 }, [findAndUpdateGroup])

 const removeGroup = useCallback((groupId: string) => {
 // Cannot remove root group
 if (groupId === query.filterGroup.id) return

 setQueryState(prev => ({
 ...prev,
 filterGroup: findAndUpdateGroup(
 prev.filterGroup,
 groupId,
 () => null
 ) || prev.filterGroup,
 updatedAt: new Date().toISOString()
 }))
 }, [query.filterGroup.id, findAndUpdateGroup])

 // Sort operations
 const addSort = useCallback((config: SortConfig) => {
 setQueryState(prev => ({
 ...prev,
 sortBy: [...(prev.sortBy || []).filter(s => s.field !== config.field), config],
 updatedAt: new Date().toISOString()
 }))
 }, [])

 const removeSort = useCallback((field: string) => {
 setQueryState(prev => ({
 ...prev,
 sortBy: (prev.sortBy || []).filter(s => s.field !== field),
 updatedAt: new Date().toISOString()
 }))
 }, [])

 const clearSort = useCallback(() => {
 setQueryState(prev => ({
 ...prev,
 sortBy: [],
 updatedAt: new Date().toISOString()
 }))
 }, [])

 // Pagination
 const setLimit = useCallback((limit: number) => {
 setQueryState(prev => ({
 ...prev,
 limit
 }))
 }, [])

 const setOffset = useCallback((offset: number) => {
 setQueryState(prev => ({
 ...prev,
 offset
 }))
 }, [])

 // Execute query
 const execute = useCallback(<T extends Record<string, unknown>>(data: T[]) => {
 setIsExecuting(true)
 setError(null)

 try {
 const queryResult = executeQuery(query, data)
 setResult({
 ...queryResult,
 query
 })
 setLastExecutedAt(new Date().toISOString())
 } catch (err) {
 setError(err instanceof Error ? err.message : 'Query execution failed')
 setResult(null)
 } finally {
 setIsExecuting(false)
 }
 }, [query])

 // Export
 const exportAs = useCallback((format: QueryExportFormat) => {
 try {
 const exported = exportQuery(query, format)
 setExportedData(exported)
 setExportFormat(format)
 } catch (err) {
 setError(err instanceof Error ? err.message : 'Export failed')
 }
 }, [query])

 const clearExport = useCallback(() => {
 setExportedData(null)
 setExportFormat(null)
 }, [])

 // Save query
 const saveQuery = useCallback(() => {
 const now = new Date().toISOString()
 const queryToSave: Query = {
 ...query,
 id: query.id || generateId(),
 name: query.name || 'Untitled Query',
 updatedAt: now
 }

 setSavedQueries(prev => {
 const existingIndex = prev.findIndex(q => q.id === queryToSave.id)
 let newQueries: Query[]
 
 if (existingIndex >= 0) {
 newQueries = [...prev]
 newQueries[existingIndex] = queryToSave
 } else {
 newQueries = [...prev, queryToSave]
 }
 
 persistQueries(newQueries)
 return newQueries
 })
 
 // Update current query with saved ID
 setQueryState(queryToSave)
 }, [query, persistQueries])

 // Load query
 const loadQuery = useCallback((queryId: string) => {
 const found = savedQueries.find(q => q.id === queryId)
 if (found) {
 setQueryState(found)
 setResult(null)
 setExportedData(null)
 }
 }, [savedQueries])

 // Delete query
 const deleteQuery = useCallback((queryId: string) => {
 setSavedQueries(prev => {
 const newQueries = prev.filter(q => q.id !== queryId)
 persistQueries(newQueries)
 return newQueries
 })
 }, [persistQueries])

 // Load preset
 const loadPreset = useCallback((presetId: string) => {
 const preset = queryPresets.find(p => p.id === presetId)
 if (preset) {
 const now = new Date().toISOString()
 setQueryState({
 id: generateId(),
 name: preset.query.name,
 description: preset.query.description,
 filterGroup: preset.query.filterGroup,
 sortBy: preset.query.sortBy,
 limit: preset.query.limit,
 offset: preset.query.offset,
 createdAt: now,
 updatedAt: now
 })
 setResult(null)
 setExportedData(null)
 }
 }, [])

 // Clear error
 const clearError = useCallback(() => {
 setError(null)
 }, [])

 return {
 // State
 query,
 savedQueries,
 result,
 isExecuting,
 lastExecutedAt,
 exportedData,
 exportFormat,
 error,

 // Actions
 setQuery,
 updateQuery,
 resetQuery,
 addFilter,
 updateFilter,
 removeFilter,
 addGroup,
 updateGroupLogic,
 removeGroup,
 addSort,
 removeSort,
 clearSort,
 setLimit,
 setOffset,
 execute,
 exportAs,
 clearExport,
 saveQuery,
 loadQuery,
 deleteQuery,
 loadPreset,
 clearError
 }
}

export default useQueryBuilder
