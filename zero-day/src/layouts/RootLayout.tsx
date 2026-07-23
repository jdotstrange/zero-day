import { Outlet } from 'react-router'
import { ScrollToTop } from '@/routes/ScrollToTop'

/**
 * Root Layout Component
 * Wraps the entire application with common providers and global elements
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-950">
      {/* Global elements like toasts, modals can be placed here */}
      <ScrollToTop />
      <Outlet />
    </div>
  )
}
