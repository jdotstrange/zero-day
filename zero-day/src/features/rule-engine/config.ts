/**
 * Rule Engine - Configuration and Presets
 * Available fields, operators, actions, and templates
 */

import type {
 FieldDefinition,
 ActionConfig,
 RuleTemplate,
 ComparisonOperator,
} from './types'

// Operator display names and icons
export const operatorConfig: Record<
 ComparisonOperator,
 { label: string; icon: string; applicableTo: string[] }
> = {
 equals: { label: 'Equals', icon: 'solar:equal-linear', applicableTo: ['string', 'number', 'boolean', 'select'] },
 not_equals: { label: 'Not Equals', icon: 'solar:close-circle-linear', applicableTo: ['string', 'number', 'boolean', 'select'] },
 greater_than: { label: 'Greater Than', icon: 'solar:arrow-up-linear', applicableTo: ['number', 'date'] },
 less_than: { label: 'Less Than', icon: 'solar:arrow-down-linear', applicableTo: ['number', 'date'] },
 greater_than_or_equal: { label: 'Greater or Equal', icon: 'solar:arrow-up-linear', applicableTo: ['number', 'date'] },
 less_than_or_equal: { label: 'Less or Equal', icon: 'solar:arrow-down-linear', applicableTo: ['number', 'date'] },
 contains: { label: 'Contains', icon: 'solar:text-linear', applicableTo: ['string'] },
 not_contains: { label: 'Not Contains', icon: 'solar:text-cross-linear', applicableTo: ['string'] },
 starts_with: { label: 'Starts With', icon: 'solar:text-linear', applicableTo: ['string'] },
 ends_with: { label: 'Ends With', icon: 'solar:text-linear', applicableTo: ['string'] },
 is_empty: { label: 'Is Empty', icon: 'solar:ghost-linear', applicableTo: ['string', 'number', 'select'] },
 is_not_empty: { label: 'Is Not Empty', icon: 'solar:check-circle-linear', applicableTo: ['string', 'number', 'select'] },
 in_list: { label: 'In List', icon: 'solar:list-check-linear', applicableTo: ['string', 'number', 'select'] },
 not_in_list: { label: 'Not In List', icon: 'solar:list-cross-linear', applicableTo: ['string', 'number', 'select'] },
 between: { label: 'Between', icon: 'solar:slider-horizontal-linear', applicableTo: ['number', 'date'] },
}

// Available fields for rules (sample - can be extended)
export const availableFields: FieldDefinition[] = [
 // User fields
 { name: 'user.name', label: 'User Name', type: 'string', category: 'User' },
 { name: 'user.email', label: 'User Email', type: 'string', category: 'User' },
 { name: 'user.role', label: 'User Role', type: 'select', category: 'User', options: [
 { value: 'admin', label: 'Admin' },
 { value: 'manager', label: 'Manager' },
 { value: 'user', label: 'User' },
 { value: 'guest', label: 'Guest' },
 ]},
 { name: 'user.status', label: 'User Status', type: 'select', category: 'User', options: [
 { value: 'active', label: 'Active' },
 { value: 'inactive', label: 'Inactive' },
 { value: 'pending', label: 'Pending' },
 { value: 'suspended', label: 'Suspended' },
 ]},
 { name: 'user.loginCount', label: 'Login Count', type: 'number', category: 'User' },
 { name: 'user.lastLogin', label: 'Last Login', type: 'date', category: 'User' },

 // Order/Transaction fields
 { name: 'order.total', label: 'Order Total', type: 'number', category: 'Orders' },
 { name: 'order.status', label: 'Order Status', type: 'select', category: 'Orders', options: [
 { value: 'pending', label: 'Pending' },
 { value: 'processing', label: 'Processing' },
 { value: 'shipped', label: 'Shipped' },
 { value: 'delivered', label: 'Delivered' },
 { value: 'cancelled', label: 'Cancelled' },
 ]},
 { name: 'order.items', label: 'Order Items Count', type: 'number', category: 'Orders' },
 { name: 'order.paymentMethod', label: 'Payment Method', type: 'select', category: 'Orders', options: [
 { value: 'credit_card', label: 'Credit Card' },
 { value: 'paypal', label: 'PayPal' },
 { value: 'bank_transfer', label: 'Bank Transfer' },
 { value: 'crypto', label: 'Cryptocurrency' },
 ]},
 { name: 'order.region', label: 'Order Region', type: 'select', category: 'Orders', options: [
 { value: 'NA', label: 'North America' },
 { value: 'EU', label: 'Europe' },
 { value: 'APAC', label: 'Asia Pacific' },
 { value: 'LATAM', label: 'Latin America' },
 ]},

 // Product fields
 { name: 'product.name', label: 'Product Name', type: 'string', category: 'Products' },
 { name: 'product.price', label: 'Product Price', type: 'number', category: 'Products' },
 { name: 'product.stock', label: 'Stock Level', type: 'number', category: 'Products' },
 { name: 'product.category', label: 'Product Category', type: 'select', category: 'Products', options: [
 { value: 'electronics', label: 'Electronics' },
 { value: 'clothing', label: 'Clothing' },
 { value: 'food', label: 'Food & Beverages' },
 { value: 'home', label: 'Home & Garden' },
 ]},

 // Analytics fields
 { name: 'analytics.revenue', label: 'Revenue', type: 'number', category: 'Analytics' },
 { name: 'analytics.visitors', label: 'Visitors', type: 'number', category: 'Analytics' },
 { name: 'analytics.conversionRate', label: 'Conversion Rate (%)', type: 'number', category: 'Analytics' },
 { name: 'analytics.bounceRate', label: 'Bounce Rate (%)', type: 'number', category: 'Analytics' },
 { name: 'analytics.avgSessionDuration', label: 'Avg Session (min)', type: 'number', category: 'Analytics' },

 // CRM fields
 { name: 'lead.score', label: 'Lead Score', type: 'number', category: 'CRM' },
 { name: 'lead.status', label: 'Lead Status', type: 'select', category: 'CRM', options: [
 { value: 'new', label: 'New' },
 { value: 'contacted', label: 'Contacted' },
 { value: 'qualified', label: 'Qualified' },
 { value: 'proposal', label: 'Proposal' },
 { value: 'won', label: 'Won' },
 { value: 'lost', label: 'Lost' },
 ]},
 { name: 'lead.value', label: 'Deal Value', type: 'number', category: 'CRM' },
 { name: 'lead.source', label: 'Lead Source', type: 'select', category: 'CRM', options: [
 { value: 'organic', label: 'Organic Search' },
 { value: 'paid', label: 'Paid Ads' },
 { value: 'referral', label: 'Referral' },
 { value: 'social', label: 'Social Media' },
 { value: 'email', label: 'Email Campaign' },
 ]},
]

// Action configurations
export const actionConfigs: ActionConfig[] = [
 {
 type: 'highlight',
 label: 'Highlight Row',
 icon: 'solar:palette-linear',
 color: 'primary',
 fields: [
 { name: 'color', label: 'Highlight Color', type: 'select', required: true, options: [
 { value: 'primary', label: 'Primary' },
 { value: 'success', label: 'Success (Green)' },
 { value: 'warning', label: 'Warning (Yellow)' },
 { value: 'danger', label: 'Danger (Red)' },
 { value: 'info', label: 'Info (Blue)' },
 ]},
 { name: 'style', label: 'Style', type: 'select', options: [
 { value: 'background', label: 'Background' },
 { value: 'border', label: 'Border' },
 { value: 'badge', label: 'Badge' },
 ]},
 ],
 },
 {
 type: 'add_tag',
 label: 'Add Tag',
 icon: 'solar:tag-linear',
 color: 'accent',
 fields: [
 { name: 'tag', label: 'Tag Name', type: 'text', required: true, placeholder: 'e.g., VIP, Urgent' },
 { name: 'color', label: 'Tag Color', type: 'select', options: [
 { value: 'primary', label: 'Primary' },
 { value: 'success', label: 'Success' },
 { value: 'warning', label: 'Warning' },
 { value: 'danger', label: 'Danger' },
 { value: 'info', label: 'Info' },
 ]},
 ],
 },
 {
 type: 'show_notification',
 label: 'Show Notification',
 icon: 'solar:bell-linear',
 color: 'warning',
 fields: [
 { name: 'title', label: 'Notification Title', type: 'text', required: true, placeholder: 'Alert!' },
 { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Notification message...' },
 { name: 'type', label: 'Notification Type', type: 'select', options: [
 { value: 'info', label: 'Info' },
 { value: 'success', label: 'Success' },
 { value: 'warning', label: 'Warning' },
 { value: 'error', label: 'Error' },
 ]},
 ],
 },
 {
 type: 'update_status',
 label: 'Update Status',
 icon: 'solar:refresh-circle-linear',
 color: 'success',
 fields: [
 { name: 'field', label: 'Status Field', type: 'text', required: true, placeholder: 'e.g., order.status' },
 { name: 'value', label: 'New Value', type: 'text', required: true, placeholder: 'e.g., approved' },
 ],
 },
 {
 type: 'set_field',
 label: 'Set Field Value',
 icon: 'solar:pen-linear',
 color: 'info',
 fields: [
 { name: 'field', label: 'Field Name', type: 'text', required: true, placeholder: 'e.g., user.priority' },
 { name: 'value', label: 'Value', type: 'text', required: true, placeholder: 'New value' },
 ],
 },
 {
 type: 'calculate_field',
 label: 'Calculate Field',
 icon: 'solar:calculator-linear',
 color: 'secondary',
 fields: [
 { name: 'targetField', label: 'Target Field', type: 'text', required: true },
 { name: 'formula', label: 'Formula', type: 'text', required: true, placeholder: 'e.g., order.total * 0.1' },
 ],
 },
 {
 type: 'send_email',
 label: 'Send Email (Demo)',
 icon: 'solar:letter-linear',
 color: 'danger',
 fields: [
 { name: 'to', label: 'Recipient', type: 'text', required: true, placeholder: 'email@example.com' },
 { name: 'subject', label: 'Subject', type: 'text', required: true },
 { name: 'template', label: 'Email Template', type: 'select', options: [
 { value: 'alert', label: 'Alert Template' },
 { value: 'notification', label: 'Notification Template' },
 { value: 'report', label: 'Report Template' },
 ]},
 ],
 },
]

// Rule templates for quick creation
export const ruleTemplates: RuleTemplate[] = [
 {
 id: 'high-value-order',
 name: 'High Value Order Alert',
 description: 'Notify when order total exceeds threshold',
 category: 'E-commerce',
 icon: 'solar:cart-large-2-linear',
 rule: {
 name: 'High Value Order',
 description: 'Trigger alert for orders over $1,000',
 enabled: true,
 priority: 10,
 conditionGroup: {
 id: 'cg1',
 logicalOperator: 'AND',
 conditions: [
 {
 id: 'c1',
 field: 'order.total',
 fieldType: 'number',
 operator: 'greater_than',
 value: 1000,
 },
 ],
 },
 actions: [
 {
 id: 'a1',
 type: 'highlight',
 config: { color: 'success', style: 'background' },
 },
 {
 id: 'a2',
 type: 'add_tag',
 config: { tag: 'VIP Order', color: 'success' },
 },
 ],
 tags: ['ecommerce', 'high-value'],
 },
 },
 {
 id: 'low-stock',
 name: 'Low Stock Warning',
 description: 'Alert when product stock is running low',
 category: 'Inventory',
 icon: 'solar:box-linear',
 rule: {
 name: 'Low Stock Alert',
 description: 'Highlight products with stock below 10 units',
 enabled: true,
 priority: 8,
 conditionGroup: {
 id: 'cg1',
 logicalOperator: 'AND',
 conditions: [
 {
 id: 'c1',
 field: 'product.stock',
 fieldType: 'number',
 operator: 'less_than',
 value: 10,
 },
 ],
 },
 actions: [
 {
 id: 'a1',
 type: 'highlight',
 config: { color: 'warning', style: 'background' },
 },
 {
 id: 'a2',
 type: 'show_notification',
 config: { title: 'Low Stock', message: 'Product stock is running low!', type: 'warning' },
 },
 ],
 tags: ['inventory', 'alert'],
 },
 },
 {
 id: 'vip-customer',
 name: 'VIP Customer Detection',
 description: 'Identify and tag high-value customers',
 category: 'CRM',
 icon: 'solar:star-linear',
 rule: {
 name: 'VIP Customer',
 description: 'Tag customers with lead score above 80',
 enabled: true,
 priority: 7,
 conditionGroup: {
 id: 'cg1',
 logicalOperator: 'AND',
 conditions: [
 {
 id: 'c1',
 field: 'lead.score',
 fieldType: 'number',
 operator: 'greater_than_or_equal',
 value: 80,
 },
 {
 id: 'c2',
 field: 'lead.status',
 fieldType: 'select',
 operator: 'in_list',
 value: ['qualified', 'proposal', 'won'],
 },
 ],
 },
 actions: [
 {
 id: 'a1',
 type: 'add_tag',
 config: { tag: 'VIP', color: 'primary' },
 },
 {
 id: 'a2',
 type: 'highlight',
 config: { color: 'primary', style: 'border' },
 },
 ],
 tags: ['crm', 'vip'],
 },
 },
 {
 id: 'inactive-user',
 name: 'Inactive User Alert',
 description: 'Detect users who haven\'t logged in recently',
 category: 'User Management',
 icon: 'solar:user-cross-linear',
 rule: {
 name: 'Inactive User',
 description: 'Flag users with low login count',
 enabled: true,
 priority: 5,
 conditionGroup: {
 id: 'cg1',
 logicalOperator: 'AND',
 conditions: [
 {
 id: 'c1',
 field: 'user.loginCount',
 fieldType: 'number',
 operator: 'less_than',
 value: 5,
 },
 {
 id: 'c2',
 field: 'user.status',
 fieldType: 'select',
 operator: 'equals',
 value: 'active',
 },
 ],
 },
 actions: [
 {
 id: 'a1',
 type: 'add_tag',
 config: { tag: 'At Risk', color: 'warning' },
 },
 ],
 tags: ['users', 'engagement'],
 },
 },
 {
 id: 'regional-order',
 name: 'Regional Order Processing',
 description: 'Apply rules based on order region',
 category: 'E-commerce',
 icon: 'solar:globe-linear',
 rule: {
 name: 'EU Region Order',
 description: 'Tag orders from EU region for special processing',
 enabled: true,
 priority: 6,
 conditionGroup: {
 id: 'cg1',
 logicalOperator: 'AND',
 conditions: [
 {
 id: 'c1',
 field: 'order.region',
 fieldType: 'select',
 operator: 'equals',
 value: 'EU',
 },
 {
 id: 'c2',
 field: 'order.total',
 fieldType: 'number',
 operator: 'greater_than',
 value: 500,
 },
 ],
 },
 actions: [
 {
 id: 'a1',
 type: 'add_tag',
 config: { tag: 'EU Priority', color: 'info' },
 },
 {
 id: 'a2',
 type: 'update_status',
 config: { field: 'order.processingQueue', value: 'priority' },
 },
 ],
 tags: ['ecommerce', 'regional'],
 },
 },
]

// Get operators for a field type
export function getOperatorsForFieldType(fieldType: string): { value: ComparisonOperator; label: string }[] {
 return Object.entries(operatorConfig)
 .filter(([, config]) => config.applicableTo.includes(fieldType))
 .map(([value, config]) => ({
 value: value as ComparisonOperator,
 label: config.label,
 }))
}

// Get field by name
export function getFieldByName(name: string): FieldDefinition | undefined {
 return availableFields.find((f) => f.name === name)
}

// Get action config by type
export function getActionConfig(type: string): ActionConfig | undefined {
 return actionConfigs.find((a) => a.type === type)
}

// Group fields by category
export function getFieldsByCategory(): Record<string, FieldDefinition[]> {
 return availableFields.reduce((acc, field) => {
 if (!acc[field.category]) {
 acc[field.category] = []
 }
 acc[field.category].push(field)
 return acc
 }, {} as Record<string, FieldDefinition[]>)
}
