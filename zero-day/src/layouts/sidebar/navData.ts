import { Icons } from '@/components/common'
import type { NavGroup } from './types'

/**
 * Navigation menu configuration
 * Centralized navigation data for the sidebar
 */
export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
      { path: '/dashboard/analytics', label: 'Analytics', icon: Icons.chartLine },
      { path: '/dashboard/ecommerce', label: 'eCommerce', icon: Icons.shopping },
      { path: '/dashboard/crm', label: 'CRM', icon: Icons.briefcase },
    ],
  },
  {
    title: 'Apps',
    items: [
      { path: '/app/email', label: 'Email', icon: Icons.mail, badge: 3 },
      { path: '/app/chat', label: 'Chat', icon: Icons.message, badge: 5 },
      { path: '/app/calendar', label: 'Calendar', icon: Icons.calendar },
      { path: '/app/contacts', label: 'Contacts', icon: Icons.contacts },
      { 
        path: '/app/blog', 
        label: 'Blog', 
        icon: Icons.article,
        children: [
          { path: '/app/blog', label: 'All Posts' },
          { path: '/app/blog/create', label: 'Create Post' },
        ]
      },
      { 
        path: '/app/ecommerce/products', 
        label: 'E-commerce', 
        icon: Icons.shopping,
        children: [
          { path: '/app/ecommerce/products', label: 'Products' },
          { path: '/app/ecommerce/products/create', label: 'Add Product' },
          { path: '/app/ecommerce/checkout', label: 'Checkout' },
        ]
      },
      { path: '/app/notes', label: 'Notes', icon: Icons.note },
      { path: '/app/kanban', label: 'Kanban Board', icon: Icons.kanban },
      // Features (Complex Logic)
      { path: '/features/rule-engine', label: 'Rule Engine', icon: Icons.ruleEngine },
      { path: '/features/query-builder', label: 'Query Builder', icon: Icons.queryBuilder },
      { path: '/features/simulation', label: 'Real-Time Simulation', icon: Icons.simulation },
      { path: '/features/insights', label: 'Smart Insights', icon: Icons.insights },
      { path: '/features/workflow-builder', label: 'Workflow Builder', icon: Icons.workflowBuilder },
      { path: '/features/task-scheduler', label: 'Task Scheduler', icon: Icons.taskScheduler },
    ],
  },
  {
    title: 'Pages',
    items: [
      { path: '/pages/account-settings', label: 'Account Settings', icon: Icons.settings },
    ],
  },
]
