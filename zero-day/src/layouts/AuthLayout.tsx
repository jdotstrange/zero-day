import { Outlet, Link } from 'react-router'
import { Icon, Icons, Logo } from '@/components/common'
import { useLocale } from '@/i18n'

const highlights = [
  { icon: Icons.chartLine, labelKey: 'nav.analytics' },
  { icon: Icons.users, labelKey: 'nav.crm' },
  { icon: Icons.shopping, labelKey: 'nav.ecommerce_title' },
] as const

/**
 * Auth Layout Component - Side Layout
 * Split screen with branding on left, form on right
 */
export function AuthLayout() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen">
      {/* Left — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/5 bg-secondary-900 p-10 lg:flex lg:w-1/2 xl:p-12">
        <Link to="/dashboard" className="relative inline-block">
          <img src="/assets/logo/logo-dark.svg" alt={t('brand.name')} width={160} height={32} />
        </Link>

        <div className="relative max-w-md space-y-8">
          <div className="space-y-4">
            <h2 className="text-display-section text-white">
              {t('auth.side.title_prefix')}{' '}
              <span className="text-accent-brand">{t('auth.side.title_emphasis')}</span>
            </h2>
            <p className="text-lead leading-relaxed text-secondary-200/75">
              {t('auth.side.subtitle')}
            </p>
          </div>

          <ul className="space-y-3 border-l-2 border-theme-primary/50 pl-5">
            {highlights.map((item) => (
              <li key={item.labelKey} className="flex items-center gap-3 text-white/85">
                <Icon icon={item.icon} className="h-5 w-5 shrink-0 text-theme-primary" />
                <span className="text-body-sm font-medium">{t(item.labelKey)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-secondary-200/50">
          {t('footer.copyright_all_rights', { year })}
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center bg-surface-50 p-6 dark:bg-surface-950 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center lg:hidden">
            <Link to="/dashboard" className="inline-flex">
              <Logo width={140} height={28} />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

/**
 * Auth Layout Component - Centered Card Layout
 */
export function AuthCardLayout() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4 dark:bg-surface-950">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 text-center">
          <Link to="/dashboard" className="inline-flex items-center justify-center">
            <Logo width={160} height={32} />
          </Link>
        </div>

        <div className="card rounded-lg p-8 md:p-10">
          <Outlet />
        </div>

        <div className="mt-8 space-y-2 text-center">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('footer.copyright_all_rights', { year })}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="#" className="text-secondary-500 hover:text-theme-primary">
              {t('pages.privacy_policy')}
            </Link>
            <span className="text-surface-300">•</span>
            <Link to="#" className="text-secondary-500 hover:text-theme-primary">
              {t('pages.terms_of_service')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
