import { useState } from 'react'
import { Link } from 'react-router'
import { Icon, Icons, Logo } from '@/components/common'
import type { NavGroup as NavGroupType } from './types'
import { NavGroup } from './NavGroup'
import { navLinkClasses } from './navClasses'
import { useLocale } from '@/i18n'
import { useTheme } from '@/hooks/useTheme'

interface SidebarProps {
  navGroups: NavGroupType[]
  isCollapsed: boolean
  width: number
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

/**
 * Sidebar Component
 * Main vertical navigation sidebar
 */
export function Sidebar({ navGroups, isCollapsed, width, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { t } = useLocale()
  const { config } = useTheme()
  const isRtl = config.direction === 'rtl'

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1025] lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside 
        className={`fixed top-0 bottom-0 bg-white dark:bg-surface-900 border-e border-surface-200 dark:border-surface-800 flex flex-col z-[1030] transition-all duration-300 ${
          isRtl ? 'right-0' : 'left-0'
        } ${
          isMobileOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
        }`}
        style={{ width }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-surface-200 dark:border-surface-800 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            {isCollapsed ? (
              <Logo showText={false} height={32} />
            ) : (
              <Logo width={120} height={24} />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
          <div onClick={onMobileClose}>
            {navGroups.map((group, groupIndex) => (
              <NavGroup
                key={`${group.title}-${groupIndex}`}
                group={group}
                isCollapsed={isCollapsed}
                expandedMenus={expandedMenus}
                onToggleMenu={toggleMenu}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-surface-200 dark:border-surface-800">
          <Link
            to="/auth/login"
            onClick={onMobileClose}
            className={navLinkClasses(false, isCollapsed)}
            title={isCollapsed ? t('common.logout') : undefined}
          >
            <Icon icon={Icons.logout} className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{t('common.logout')}</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
