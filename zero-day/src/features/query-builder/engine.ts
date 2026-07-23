/**
 * Query Builder - Core Engine
 * Evaluates queries, generates SQL/JSON output
 */

import type {
 Query,
 QueryFilter,
 QueryFilterGroup,
 QueryExportFormat,
} from './types'

/**
 * Generate unique ID
 */
export function generateId(): string {
 return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Create empty filter
 */
export function createEmptyFilter(): QueryFilter {
 return {
 id: generateId(),
 field: '',
 fieldType: 'string',
 operator: 'eq',
 value: '',
 }
}

/**
 * Create empty filter group
 */
export function createEmptyFilterGroup(): QueryFilterGroup {
 return {
 id: generateId(),
 logic: 'AND',
 filters: [createEmptyFilter()],
 }
}

/**
 * Create empty query
 */
export function createEmptyQuery(): Query {
 return {
 id: generateId(),
 name: '',
 description: '',
 filterGroup: createEmptyFilterGroup(),
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 }
}

/**
 * Check if item is a filter group
 */
export function isFilterGroup(item: QueryFilter | QueryFilterGroup): item is QueryFilterGroup {
 return 'logic' in item && 'filters' in item
}

export function countFilters(group: QueryFilterGroup): number {
 return group.filters.reduce((count, item) => {
  if (isFilterGroup(item)) return count + countFilters(item)
  return count + 1
 }, 0)
}

/**
 * Evaluate a single filter against a data item
 */
export function evaluateFilter(filter: QueryFilter, item: Record<string, unknown>): boolean {
 const value = getNestedValue(item, filter.field)
 
 switch (filter.operator) {
 case 'eq':
 return String(value).toLowerCase() === String(filter.value).toLowerCase()
 case 'neq':
 return String(value).toLowerCase() !== String(filter.value).toLowerCase()
 case 'gt':
 return Number(value) > Number(filter.value)
 case 'gte':
 return Number(value) >= Number(filter.value)
 case 'lt':
 return Number(value) < Number(filter.value)
 case 'lte':
 return Number(value) <= Number(filter.value)
 case 'contains':
 return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
 case 'not_contains':
 return !String(value).toLowerCase().includes(String(filter.value).toLowerCase())
 case 'starts_with':
 return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
 case 'ends_with':
 return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase())
 case 'is_null':
 return value === null || value === undefined || value === ''
 case 'is_not_null':
 return value !== null && value !== undefined && value !== ''
 case 'in':
 if (Array.isArray(filter.value)) {
 return filter.value.some(v => String(v).toLowerCase() === String(value).toLowerCase())
 }
 return false
 case 'not_in':
 if (Array.isArray(filter.value)) {
 return !filter.value.some(v => String(v).toLowerCase() === String(value).toLowerCase())
 }
 return true
 case 'between':
 const num = Number(value)
 const min = Number(filter.value)
 const max = Number(filter.secondValue)
 return num >= min && num <= max
 default:
 return false
 }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
 return path.split('.').reduce((acc: unknown, key) => {
 if (acc && typeof acc === 'object' && key in acc) {
 return (acc as Record<string, unknown>)[key]
 }
 return undefined
 }, obj)
}

/**
 * Evaluate a filter group against a data item
 */
export function evaluateFilterGroup(
 group: QueryFilterGroup,
 item: Record<string, unknown>
): boolean {
 const results = group.filters.map((filter) => {
 if (isFilterGroup(filter)) {
 return evaluateFilterGroup(filter, item)
 }
 return evaluateFilter(filter, item)
 })

 return group.logic === 'AND'
 ? results.every((r) => r)
 : results.some((r) => r)
}

/**
 * Execute query against data array
 */
export function executeQuery<T extends Record<string, unknown>>(
 query: Query,
 data: T[]
): { data: T[]; total: number; filtered: number; executionTime: number } {
 const startTime = performance.now()
 
 // Filter data
 let result = data.filter((item) => evaluateFilterGroup(query.filterGroup, item))
 
 // Sort data
 if (query.sortBy && query.sortBy.length > 0) {
 result = [...result].sort((a, b) => {
 for (const sort of query.sortBy!) {
 const aVal = getNestedValue(a, sort.field)
 const bVal = getNestedValue(b, sort.field)
 
 if (aVal === bVal) continue
 
 const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
 return sort.direction === 'asc' ? comparison : -comparison
 }
 return 0
 })
 }

 const filtered = result.length

 // Apply pagination
 if (query.offset !== undefined) {
 result = result.slice(query.offset)
 }
 if (query.limit !== undefined) {
 result = result.slice(0, query.limit)
 }

 const executionTime = performance.now() - startTime

 return {
 data: result,
 total: data.length,
 filtered,
 executionTime,
 }
}

/**
 * Export query to different formats
 */
export function exportQuery(query: Query, format: QueryExportFormat): string {
 switch (format) {
 case 'json':
 return exportToJSON(query)
 case 'sql':
 return exportToSQL(query)
 case 'mongodb':
 return exportToMongoDB(query)
 case 'graphql':
 return exportToGraphQL(query)
 default:
 return exportToJSON(query)
 }
}

/**
 * Export to JSON format
 */
function exportToJSON(query: Query): string {
 return JSON.stringify(
 {
 name: query.name,
 filters: query.filterGroup,
 sort: query.sortBy,
 limit: query.limit,
 offset: query.offset,
 },
 null,
 2
 )
}

/**
 * Export to SQL WHERE clause
 */
function exportToSQL(query: Query): string {
 const where = filterGroupToSQL(query.filterGroup)
 let sql = `SELECT *\nFROM table_name`
 
 if (where) {
 sql += `\nWHERE ${where}`
 }
 
 if (query.sortBy && query.sortBy.length > 0) {
 const orderBy = query.sortBy
 .map((s) => `${s.field} ${s.direction.toUpperCase()}`)
 .join(', ')
 sql += `\nORDER BY ${orderBy}`
 }
 
 if (query.limit !== undefined) {
 sql += `\nLIMIT ${query.limit}`
 }
 
 if (query.offset !== undefined) {
 sql += `\nOFFSET ${query.offset}`
 }

 return sql
}

function filterGroupToSQL(group: QueryFilterGroup): string {
 const conditions = group.filters
 .map((filter) => {
 if (isFilterGroup(filter)) {
 const nested = filterGroupToSQL(filter)
 return nested ? `(${nested})` : ''
 }
 return filterToSQL(filter)
 })
 .filter(Boolean)

 return conditions.join(` ${group.logic} `)
}

function filterToSQL(filter: QueryFilter): string {
 const field = filter.field.replace(/\./g, '_')
 const value = typeof filter.value === 'string' ? `'${filter.value}'` : filter.value

 switch (filter.operator) {
 case 'eq':
 return `${field} = ${value}`
 case 'neq':
 return `${field} != ${value}`
 case 'gt':
 return `${field} > ${value}`
 case 'gte':
 return `${field} >= ${value}`
 case 'lt':
 return `${field} < ${value}`
 case 'lte':
 return `${field} <= ${value}`
 case 'contains':
 return `${field} LIKE '%${filter.value}%'`
 case 'not_contains':
 return `${field} NOT LIKE '%${filter.value}%'`
 case 'starts_with':
 return `${field} LIKE '${filter.value}%'`
 case 'ends_with':
 return `${field} LIKE '%${filter.value}'`
 case 'is_null':
 return `${field} IS NULL`
 case 'is_not_null':
 return `${field} IS NOT NULL`
 case 'in':
 const inValues = Array.isArray(filter.value)
 ? filter.value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(', ')
 : value
 return `${field} IN (${inValues})`
 case 'not_in':
 const notInValues = Array.isArray(filter.value)
 ? filter.value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(', ')
 : value
 return `${field} NOT IN (${notInValues})`
 case 'between':
 return `${field} BETWEEN ${filter.value} AND ${filter.secondValue}`
 default:
 return ''
 }
}

/**
 * Export to MongoDB query format
 */
function exportToMongoDB(query: Query): string {
 const filter = filterGroupToMongo(query.filterGroup)
 
 let mongoQuery = `db.collection.find(\n ${JSON.stringify(filter, null, 2)}\n)`
 
 if (query.sortBy && query.sortBy.length > 0) {
 const sort = query.sortBy.reduce((acc, s) => {
 acc[s.field] = s.direction === 'asc' ? 1 : -1
 return acc
 }, {} as Record<string, number>)
 mongoQuery += `.sort(${JSON.stringify(sort)})`
 }
 
 if (query.offset !== undefined) {
 mongoQuery += `.skip(${query.offset})`
 }
 
 if (query.limit !== undefined) {
 mongoQuery += `.limit(${query.limit})`
 }

 return mongoQuery
}

function filterGroupToMongo(group: QueryFilterGroup): Record<string, unknown> {
 const conditions = group.filters
 .map((filter) => {
 if (isFilterGroup(filter)) {
 return filterGroupToMongo(filter)
 }
 return filterToMongo(filter)
 })
 .filter((c) => Object.keys(c).length > 0)

 if (conditions.length === 0) return {}
 if (conditions.length === 1) return conditions[0]

 return group.logic === 'AND' ? { $and: conditions } : { $or: conditions }
}

function filterToMongo(filter: QueryFilter): Record<string, unknown> {
 const field = filter.field

 switch (filter.operator) {
 case 'eq':
 return { [field]: filter.value }
 case 'neq':
 return { [field]: { $ne: filter.value } }
 case 'gt':
 return { [field]: { $gt: filter.value } }
 case 'gte':
 return { [field]: { $gte: filter.value } }
 case 'lt':
 return { [field]: { $lt: filter.value } }
 case 'lte':
 return { [field]: { $lte: filter.value } }
 case 'contains':
 return { [field]: { $regex: filter.value, $options: 'i' } }
 case 'not_contains':
 return { [field]: { $not: { $regex: filter.value, $options: 'i' } } }
 case 'starts_with':
 return { [field]: { $regex: `^${filter.value}`, $options: 'i' } }
 case 'ends_with':
 return { [field]: { $regex: `${filter.value}$`, $options: 'i' } }
 case 'is_null':
 return { [field]: null }
 case 'is_not_null':
 return { [field]: { $ne: null } }
 case 'in':
 return { [field]: { $in: filter.value } }
 case 'not_in':
 return { [field]: { $nin: filter.value } }
 case 'between':
 return { [field]: { $gte: filter.value, $lte: filter.secondValue } }
 default:
 return {}
 }
}

/**
 * Export to GraphQL query format
 */
function exportToGraphQL(query: Query): string {
 const filterArgs: string[] = []
 
 // Flatten filters for GraphQL format
 flattenFiltersForGraphQL(query.filterGroup, filterArgs)

 let graphql = `query GetData {\n data(`
 
 if (filterArgs.length > 0) {
 graphql += `\n where: { ${filterArgs.join(', ')} }`
 }
 
 if (query.sortBy && query.sortBy.length > 0) {
 const orderBy = query.sortBy
 .map((s) => `${s.field}: ${s.direction.toUpperCase()}`)
 .join(', ')
 graphql += `\n orderBy: { ${orderBy} }`
 }
 
 if (query.limit !== undefined) {
 graphql += `\n first: ${query.limit}`
 }
 
 if (query.offset !== undefined) {
 graphql += `\n skip: ${query.offset}`
 }

 graphql += `\n ) {\n id\n # ... fields\n }\n}`

 return graphql
}

function flattenFiltersForGraphQL(group: QueryFilterGroup, output: string[]): void {
 for (const filter of group.filters) {
 if (isFilterGroup(filter)) {
 flattenFiltersForGraphQL(filter, output)
 } else if (filter.field && filter.value !== '') {
 const value = typeof filter.value === 'string' ? `"${filter.value}"` : filter.value
 
 switch (filter.operator) {
 case 'eq':
 output.push(`${filter.field}: ${value}`)
 break
 case 'neq':
 output.push(`${filter.field}_not: ${value}`)
 break
 case 'gt':
 output.push(`${filter.field}_gt: ${value}`)
 break
 case 'gte':
 output.push(`${filter.field}_gte: ${value}`)
 break
 case 'lt':
 output.push(`${filter.field}_lt: ${value}`)
 break
 case 'lte':
 output.push(`${filter.field}_lte: ${value}`)
 break
 case 'contains':
 output.push(`${filter.field}_contains: ${value}`)
 break
 case 'starts_with':
 output.push(`${filter.field}_starts_with: ${value}`)
 break
 case 'ends_with':
 output.push(`${filter.field}_ends_with: ${value}`)
 break
 case 'in':
 const inArr = Array.isArray(filter.value)
 ? `[${filter.value.map((v) => (typeof v === 'string' ? `"${v}"` : v)).join(', ')}]`
 : `[${value}]`
 output.push(`${filter.field}_in: ${inArr}`)
 break
 }
 }
 }
}

/**
 * Validate query
 */
export function validateQuery(query: Partial<Query>): { valid: boolean; errors: string[] } {
 const errors: string[] = []

 if (!query.filterGroup?.filters?.length) {
 errors.push('At least one filter is required')
 }

 // Check for empty filters
 const hasEmptyFilter = checkForEmptyFilters(query.filterGroup)
 if (hasEmptyFilter) {
 errors.push('All filters must have a field selected')
 }

 return {
 valid: errors.length === 0,
 errors,
 }
}

function checkForEmptyFilters(group?: QueryFilterGroup): boolean {
 if (!group) return false
 
 for (const filter of group.filters) {
 if (isFilterGroup(filter)) {
 if (checkForEmptyFilters(filter)) return true
 } else {
 if (!filter.field) return true
 }
 }
 return false
}
