/**
 * Query Builder - Configuration
 * Available fields, operators, and presets
 */

import type { QueryOperator, QueryFieldDefinition, QueryPreset } from './types'

// Operator display configuration
export const operatorConfig: Record<
 QueryOperator,
 { label: string; icon: string; applicableTo: string[] }
> = {
 eq: { label: 'Equals', icon: 'solar:equal-linear', applicableTo: ['string', 'number', 'boolean', 'date', 'enum'] },
 neq: { label: 'Not Equals', icon: 'solar:close-circle-linear', applicableTo: ['string', 'number', 'boolean', 'date', 'enum'] },
 gt: { label: 'Greater Than', icon: 'solar:arrow-up-linear', applicableTo: ['number', 'date'] },
 gte: { label: 'Greater or Equal', icon: 'solar:arrow-up-linear', applicableTo: ['number', 'date'] },
 lt: { label: 'Less Than', icon: 'solar:arrow-down-linear', applicableTo: ['number', 'date'] },
 lte: { label: 'Less or Equal', icon: 'solar:arrow-down-linear', applicableTo: ['number', 'date'] },
 contains: { label: 'Contains', icon: 'solar:text-linear', applicableTo: ['string'] },
 not_contains: { label: 'Not Contains', icon: 'solar:text-cross-linear', applicableTo: ['string'] },
 starts_with: { label: 'Starts With', icon: 'solar:text-linear', applicableTo: ['string'] },
 ends_with: { label: 'Ends With', icon: 'solar:text-linear', applicableTo: ['string'] },
 is_null: { label: 'Is Empty', icon: 'solar:ghost-linear', applicableTo: ['string', 'number', 'date', 'enum'] },
 is_not_null: { label: 'Is Not Empty', icon: 'solar:check-circle-linear', applicableTo: ['string', 'number', 'date', 'enum'] },
 in: { label: 'In List', icon: 'solar:list-check-linear', applicableTo: ['string', 'number', 'enum'] },
 not_in: { label: 'Not In List', icon: 'solar:list-cross-linear', applicableTo: ['string', 'number', 'enum'] },
 between: { label: 'Between', icon: 'solar:slider-horizontal-linear', applicableTo: ['number', 'date'] },
}

// Available fields for queries
export const queryFields: QueryFieldDefinition[] = [
 // User fields
 { name: 'user.id', label: 'User ID', type: 'number', category: 'Users' },
 { name: 'user.name', label: 'User Name', type: 'string', category: 'Users' },
 { name: 'user.email', label: 'Email', type: 'string', category: 'Users' },
 { name: 'user.role', label: 'Role', type: 'enum', category: 'Users', options: [
 { value: 'admin', label: 'Admin' },
 { value: 'manager', label: 'Manager' },
 { value: 'user', label: 'User' },
 { value: 'guest', label: 'Guest' },
 ]},
 { name: 'user.status', label: 'Status', type: 'enum', category: 'Users', options: [
 { value: 'active', label: 'Active' },
 { value: 'inactive', label: 'Inactive' },
 { value: 'pending', label: 'Pending' },
 { value: 'suspended', label: 'Suspended' },
 ]},
 { name: 'user.createdAt', label: 'Created Date', type: 'date', category: 'Users' },
 { name: 'user.loginCount', label: 'Login Count', type: 'number', category: 'Users' },

 // Order fields
 { name: 'order.id', label: 'Order ID', type: 'number', category: 'Orders' },
 { name: 'order.total', label: 'Order Total', type: 'number', category: 'Orders' },
 { name: 'order.status', label: 'Order Status', type: 'enum', category: 'Orders', options: [
 { value: 'pending', label: 'Pending' },
 { value: 'processing', label: 'Processing' },
 { value: 'shipped', label: 'Shipped' },
 { value: 'delivered', label: 'Delivered' },
 { value: 'cancelled', label: 'Cancelled' },
 { value: 'refunded', label: 'Refunded' },
 ]},
 { name: 'order.items', label: 'Item Count', type: 'number', category: 'Orders' },
 { name: 'order.date', label: 'Order Date', type: 'date', category: 'Orders' },
 { name: 'order.region', label: 'Region', type: 'enum', category: 'Orders', options: [
 { value: 'NA', label: 'North America' },
 { value: 'EU', label: 'Europe' },
 { value: 'APAC', label: 'Asia Pacific' },
 { value: 'LATAM', label: 'Latin America' },
 { value: 'MEA', label: 'Middle East & Africa' },
 ]},

 // Product fields
 { name: 'product.id', label: 'Product ID', type: 'number', category: 'Products' },
 { name: 'product.name', label: 'Product Name', type: 'string', category: 'Products' },
 { name: 'product.price', label: 'Price', type: 'number', category: 'Products' },
 { name: 'product.stock', label: 'Stock Level', type: 'number', category: 'Products' },
 { name: 'product.category', label: 'Category', type: 'enum', category: 'Products', options: [
 { value: 'electronics', label: 'Electronics' },
 { value: 'clothing', label: 'Clothing' },
 { value: 'home', label: 'Home & Garden' },
 { value: 'sports', label: 'Sports' },
 { value: 'books', label: 'Books' },
 ]},
 { name: 'product.rating', label: 'Rating', type: 'number', category: 'Products' },

 // Analytics fields
 { name: 'analytics.pageViews', label: 'Page Views', type: 'number', category: 'Analytics' },
 { name: 'analytics.sessions', label: 'Sessions', type: 'number', category: 'Analytics' },
 { name: 'analytics.bounceRate', label: 'Bounce Rate', type: 'number', category: 'Analytics' },
 { name: 'analytics.conversionRate', label: 'Conversion Rate', type: 'number', category: 'Analytics' },
 { name: 'analytics.revenue', label: 'Revenue', type: 'number', category: 'Analytics' },
]

// Get operators for a field type
export function getOperatorsForType(fieldType: string): { value: QueryOperator; label: string }[] {
 return Object.entries(operatorConfig)
 .filter(([, config]) => config.applicableTo.includes(fieldType))
 .map(([value, config]) => ({
 value: value as QueryOperator,
 label: config.label,
 }))
}

// Get field by name
export function getFieldByName(name: string): QueryFieldDefinition | undefined {
 return queryFields.find((f) => f.name === name)
}

// Group fields by category
export function getFieldsByCategory(): Record<string, QueryFieldDefinition[]> {
 return queryFields.reduce((acc, field) => {
 if (!acc[field.category]) {
 acc[field.category] = []
 }
 acc[field.category].push(field)
 return acc
 }, {} as Record<string, QueryFieldDefinition[]>)
}

// Query presets
export const queryPresets: QueryPreset[] = [
 {
 id: 'active-users',
 name: 'Active Users',
 description: 'Find all active users',
 category: 'Users',
 icon: 'solar:users-group-rounded-linear',
 query: {
 name: 'Active Users',
 description: 'All users with active status',
 filterGroup: {
 id: 'fg1',
 logic: 'AND',
 filters: [
 { id: 'f1', field: 'user.status', fieldType: 'enum', operator: 'eq', value: 'active' },
 ],
 },
 },
 },
 {
 id: 'high-value-orders',
 name: 'High Value Orders',
 description: 'Orders over $1,000',
 category: 'Orders',
 icon: 'solar:cart-large-2-linear',
 query: {
 name: 'High Value Orders',
 description: 'Orders with total over $1,000',
 filterGroup: {
 id: 'fg1',
 logic: 'AND',
 filters: [
 { id: 'f1', field: 'order.total', fieldType: 'number', operator: 'gt', value: 1000 },
 { id: 'f2', field: 'order.status', fieldType: 'enum', operator: 'neq', value: 'cancelled' },
 ],
 },
 sortBy: [{ field: 'order.total', direction: 'desc' }],
 },
 },
 {
 id: 'low-stock',
 name: 'Low Stock Products',
 description: 'Products with stock below 10',
 category: 'Products',
 icon: 'solar:box-linear',
 query: {
 name: 'Low Stock Alert',
 description: 'Products running low on inventory',
 filterGroup: {
 id: 'fg1',
 logic: 'AND',
 filters: [
 { id: 'f1', field: 'product.stock', fieldType: 'number', operator: 'lt', value: 10 },
 ],
 },
 sortBy: [{ field: 'product.stock', direction: 'asc' }],
 },
 },
 {
 id: 'eu-orders',
 name: 'European Orders',
 description: 'All orders from EU region',
 category: 'Orders',
 icon: 'solar:globe-linear',
 query: {
 name: 'EU Orders',
 description: 'Orders from European region',
 filterGroup: {
 id: 'fg1',
 logic: 'AND',
 filters: [
 { id: 'f1', field: 'order.region', fieldType: 'enum', operator: 'eq', value: 'EU' },
 ],
 },
 },
 },
 {
 id: 'recent-signups',
 name: 'Recent Signups',
 description: 'Users who signed up in the last 30 days',
 category: 'Users',
 icon: 'solar:user-plus-rounded-linear',
 query: {
 name: 'Recent Signups',
 description: 'New users from last 30 days',
 filterGroup: {
 id: 'fg1',
 logic: 'AND',
 filters: [
 { id: 'f1', field: 'user.loginCount', fieldType: 'number', operator: 'lte', value: 5 },
 { id: 'f2', field: 'user.status', fieldType: 'enum', operator: 'eq', value: 'active' },
 ],
 },
 sortBy: [{ field: 'user.createdAt', direction: 'desc' }],
 limit: 50,
 },
 },
]
