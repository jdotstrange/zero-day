/**
 * Query Builder Types
 * Defines the structure for query filters and groups
 */

// Comparison operators for queries
export type QueryOperator =
 | 'eq'
 | 'neq'
 | 'gt'
 | 'gte'
 | 'lt'
 | 'lte'
 | 'contains'
 | 'not_contains'
 | 'starts_with'
 | 'ends_with'
 | 'is_null'
 | 'is_not_null'
 | 'in'
 | 'not_in'
 | 'between'

// Logical operators
export type QueryLogicalOperator = 'AND' | 'OR'

// Field types
export type QueryFieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum'

// Single filter condition
export interface QueryFilter {
 id: string
 field: string
 fieldType: QueryFieldType
 operator: QueryOperator
 value: unknown
 secondValue?: unknown // For 'between' operator
}

// Filter group (allows nesting)
export interface QueryFilterGroup {
 id: string
 logic: QueryLogicalOperator
 filters: (QueryFilter | QueryFilterGroup)[]
}

// Complete query definition
export interface Query {
 id: string
 name: string
 description: string
 filterGroup: QueryFilterGroup
 sortBy?: { field: string; direction: 'asc' | 'desc' }[]
 limit?: number
 offset?: number
 createdAt: string
 updatedAt: string
}

// Query preset for saving/loading
export interface QueryPreset {
 id: string
 name: string
 description: string
 category: string
 icon: string
 query: Omit<Query, 'id' | 'createdAt' | 'updatedAt'>
}

// Query field definition (for UI)
export interface QueryFieldDefinition {
 name: string
 label: string
 type: QueryFieldType
 category: string
 options?: { value: string; label: string }[]
 description?: string
}

// Query export format
export type QueryExportFormat = 'json' | 'sql' | 'mongodb' | 'graphql'

// Query result
export interface QueryResult<T = unknown> {
 data: T[]
 total: number
 filtered: number
 executionTime: number
 query: Query
}
