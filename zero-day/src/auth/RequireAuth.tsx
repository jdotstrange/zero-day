import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

/**
 * Protects admin routes. Unauthenticated visitors are sent to /auth/login
 * with the intended location in state.from for post-login return.
 */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
