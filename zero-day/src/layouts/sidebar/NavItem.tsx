import { Link, useLocation } from 'react-router'
import { Icon, Icons } from '@/components/common'
import type { NavItem as NavItemType } from './types'
import { NavSubItem } from './NavSubItem'
import { useLocale } from '@/i18n'
import { navLinkClasses } from './navClasses'
import { cn } from '@/components/ui/cn'

const NAV_ITEM_KEY_BY_LABEL: Record<string, string> = {
  Overview: 'nav.overview',
  Analytics: 'nav.analytics',
  eCommerce: 'nav.ecommerce',
  CRM: 'nav.crm',
  Email: 'nav.email',
  Chat: 'nav.chat',
  Calendar: 'nav.calendar',
  Contacts: 'nav.contacts',
  Blog: 'nav.blog',
  'All Posts': 'nav.blog_all_posts',
  'Create Post': 'nav.blog_create_post',
  'E-commerce': 'nav.ecommerce_title',
  Products: 'nav.ecommerce_products',
  'Add Product': 'nav.ecommerce_add_product',
  Checkout: 'nav.ecommerce_checkout',
  Notes: 'nav.notes',
  'Kanban Board': 'nav.kanban_board',
  Login: 'nav.login',
  'Side Login': 'nav.login_side',
  'Card Login': 'nav.login_card',
  Register: 'nav.register',
  'Side Register': 'nav.register_side',
  'Card Register': 'nav.register_card',
  'Forgot Password': 'nav.forgot_password',
  Pricing: 'nav.pricing',
  'Account Settings': 'nav.account_settings',
  Gallery: 'nav.gallery',
  FAQ: 'nav.faq',
  'Form Layout': 'nav.form_layout',
  'Form Validation': 'nav.form_validation',
  Editor: 'nav.editor',
  'Simple Table': 'nav.simple_table',
  'Data Table': 'nav.data_table',
  'CRUD Table': 'nav.crud_table',
  Line: 'nav.chart_line',
  Area: 'nav.chart_area',
  Columns: 'nav.chart_columns',
  'Pie & Doughnut': 'nav.chart_pie_doughnut',
  Radar: 'nav.chart_radar',
  Candlestick: 'nav.chart_candlestick',
  'Rule Engine': 'nav.rule_engine',
  'Query Builder': 'nav.query_builder',
  'Real-Time Simulation': 'nav.simulation',
  'Smart Insights': 'nav.smart_insights',
  'Workflow Builder': 'nav.workflow_builder',
  'Task Scheduler': 'nav.task_scheduler',
  New: 'common.new',
}

interface NavItemProps {
  item: NavItemType
  isCollapsed: boolean
  isExpanded: boolean
  onToggle: () => void
}

export function NavItem({ item, isCollapsed, isExpanded, onToggle }: NavItemProps) {
  const location = useLocation()
  const { t } = useLocale()

  const label = NAV_ITEM_KEY_BY_LABEL[item.label] ? t(NAV_ITEM_KEY_BY_LABEL[item.label]) : item.label

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const isParentActive = () => {
    if (item.children) {
      return item.children.some(
        (child) =>
          location.pathname === child.path ||
          location.pathname.startsWith(`${child.path}/`),
      )
    }
    return isActive(item.path)
  }

  const active = isParentActive()

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(navLinkClasses(active, isCollapsed), 'w-full')}
          title={isCollapsed ? label : undefined}
        >
          <Icon icon={item.icon} className="h-5 w-5 shrink-0" />

          {!isCollapsed && (
            <>
              <span className="flex-1 text-start">{label}</span>
              <Icon
                icon={Icons.chevronDown}
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </>
          )}

          {isCollapsed && (
            <div className="absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-surface-900 px-2 py-1 text-xs text-white opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100 dark:bg-surface-700">
              {label}
            </div>
          )}
        </button>

        {!isCollapsed && isExpanded && (
          <div className="mt-1 ms-4 space-y-1 border-s border-surface-200 ps-4 dark:border-surface-700">
            {item.children.map((child) => (
              <NavSubItem key={child.path} item={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={navLinkClasses(isActive(item.path), isCollapsed)}
      title={isCollapsed ? label : undefined}
    >
      <Icon icon={item.icon} className="h-5 w-5 shrink-0" />

      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
          {item.badge && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                isActive(item.path)
                  ? 'bg-white/20 text-white'
                  : typeof item.badge === 'number'
                    ? 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400'
                    : 'bg-theme-primary-light text-theme-primary',
              )}
            >
              {typeof item.badge === 'string' && NAV_ITEM_KEY_BY_LABEL[item.badge]
                ? t(NAV_ITEM_KEY_BY_LABEL[item.badge])
                : item.badge}
            </span>
          )}
        </>
      )}

      {isCollapsed && (
        <div className="absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-surface-900 px-2 py-1 text-xs text-white opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100 dark:bg-surface-700">
          {label}
          {item.badge && (
            <span className="ms-1 rounded bg-white/20 px-1.5 py-0.5 text-ui-2xs">
              {typeof item.badge === 'string' && NAV_ITEM_KEY_BY_LABEL[item.badge]
                ? t(NAV_ITEM_KEY_BY_LABEL[item.badge])
                : item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
