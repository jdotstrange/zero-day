import type { NavGroup as NavGroupType } from './types'
import { NavItem } from './NavItem'
import { useLocale } from '@/i18n'

const NAV_GROUP_KEY_BY_TITLE: Record<string, string> = {
  Dashboards: 'nav.dashboards',
  Apps: 'nav.apps',
  Authentication: 'nav.authentication',
  Pages: 'nav.pages',
  From: 'nav.forms',
  Table: 'nav.table',
  Charts: 'nav.charts',
}

interface NavGroupProps {
  group: NavGroupType
  isCollapsed: boolean
  expandedMenus: string[]
  onToggleMenu: (path: string) => void
}

/**
 * Navigation Group Component
 * Renders a group of navigation items with an optional title
 */
export function NavGroup({ group, isCollapsed, expandedMenus, onToggleMenu }: NavGroupProps) {
  const { t } = useLocale()
  const title = NAV_GROUP_KEY_BY_TITLE[group.title] ? t(NAV_GROUP_KEY_BY_TITLE[group.title]) : group.title

  return (
    <div className="mb-4">
      {/* Group Title */}
      {!isCollapsed && (
        <p className="nav-group-title">{title}</p>
      )}
      
      <div className={isCollapsed ? 'space-y-1 px-2' : 'space-y-1 px-3'}>
        {group.items.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
            isExpanded={expandedMenus.includes(item.path)}
            onToggle={() => onToggleMenu(item.path)}
          />
        ))}
      </div>
    </div>
  )
}
