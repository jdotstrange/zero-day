import { Link, useRouteError, isRouteErrorResponse } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

/**
 * 404 Not Found Page Component
 */
export function NotFoundPage() {
  const { t } = useLocale()
  const error = useRouteError()

  let errorMessage = t('errors.404_message')

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = t('errors.404_message')
    } else if (error.status === 500) {
      errorMessage = t('common.something_went_wrong')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 p-4 dark:bg-surface-950">
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-theme-primary/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-theme-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-lg animate-fade-in text-center">
        <div className="relative mb-8 inline-block">
          <div className="relative z-10 mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-surface-200 bg-surface-100 dark:border-surface-800 dark:bg-surface-900">
            <Icon icon={Icons.search} width={64} height={64} className="text-theme-primary" />
          </div>
          <div className="absolute -top-4 -right-4 rounded-xl border border-surface-100 bg-white p-3 dark:border-surface-700 dark:bg-surface-800">
            <Icon icon={Icons.help} width={24} height={24} className="text-warning-500" />
          </div>
          <div className="absolute -bottom-2 -left-4 rounded-xl border border-surface-100 bg-white p-3 dark:border-surface-700 dark:bg-surface-800">
            <Icon icon={Icons.alertTriangle} width={24} height={24} className="text-danger-500" />
          </div>
        </div>

        <h1 className="heading-1 mb-2 text-theme-primary">404</h1>
        <h2 className="heading-4 mb-4 text-secondary-900 dark:text-white">
          {t('errors.404_title')}
        </h2>
        <p className="text-body mb-8 leading-relaxed text-secondary-600 dark:text-secondary-400">
          {errorMessage}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/dashboard">
              <Icon icon={Icons.home} width={20} height={20} />
              {t('errors.go_home')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              <Icon icon={Icons.dashboard} width={20} height={20} />
              {t('header.top.dashboard')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
