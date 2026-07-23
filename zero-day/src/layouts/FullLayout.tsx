import { Outlet } from 'react-router'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Sidebar, HorizontalNav, navGroups } from './sidebar'
import { AppHeader } from './header'

/**
 * Full Layout Component
 * Admin layout with collapsible sidebar (mini/full modes)
 */
export function FullLayout() {
  const { config, toggleSidebar } = useTheme()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const isHorizontal = config.sidebarLayout === 'horizontal'
  const isCollapsed = config.sidebarCollapsed && !isHorizontal
  const isRtl = config.direction === 'rtl'

  const sidebarWidth = isHorizontal ? 0 : isCollapsed ? 80 : 260

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <AppHeader
        sidebarWidth={sidebarWidth}
        isHorizontal={isHorizontal}
        isCollapsed={isCollapsed}
        onToggleSidebar={toggleSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Horizontal Nav */}
      {isHorizontal && <HorizontalNav navGroups={navGroups} />}

      {/* Vertical Sidebar */}
      {!isHorizontal && (
        <Sidebar 
          navGroups={navGroups} 
          isCollapsed={isCollapsed} 
          width={sidebarWidth}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className="transition-all duration-300 lg:ms-0" 
        style={{ 
          marginLeft: undefined,
          paddingTop: isHorizontal ? 112 : 64 
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            main {
              margin-left: 0 !important;
              margin-right: 0 !important;
            }

            ${isRtl
              ? `html[dir="rtl"] main { margin-right: ${isHorizontal ? 0 : sidebarWidth}px !important; }`
              : `html[dir="ltr"] main { margin-left: ${isHorizontal ? 0 : sidebarWidth}px !important; }`}
          }
        `}</style>
        <div className="layout-container layout-page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
