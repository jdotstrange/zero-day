import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useTheme } from '@/hooks'
import { useLocale } from '@/i18n'

const demos = [
 {
 titleKey: 'landing.demos.items.overview_light.title',
 descriptionKey: 'landing.demos.items.overview_light.desc',
 to: '/dashboard',
 image: '/assets/landing/demos/main-light.png',
 mode: 'light',
 icon: Icons.dashboard,
 color: 'text-blue-500',
 bg: 'bg-blue-500/10',
 },
 {
 titleKey: 'landing.demos.items.overview_dark.title',
 descriptionKey: 'landing.demos.items.overview_dark.desc',
 to: '/dashboard',
 image: '/assets/landing/demos/main-dark.png',
 mode: 'dark',
 icon: Icons.dashboard,
 color: 'text-blue-500',
 bg: 'bg-blue-500/10',
 },
 {
 titleKey: 'landing.demos.items.analytics.title',
 descriptionKey: 'landing.demos.items.analytics.desc',
 to: '/dashboard/analytics',
 image: '/assets/landing/demos/analytics.png',
 mode: 'light',
 icon: Icons.chartBar,
 color: 'text-cyan-500',
 bg: 'bg-cyan-500/10',
 },
 {
 titleKey: 'landing.demos.items.ecommerce.title',
 descriptionKey: 'landing.demos.items.ecommerce.desc',
 to: '/dashboard/ecommerce',
 image: '/assets/landing/demos/e-commerce.png',
 mode: 'light',
 icon: Icons.shopping,
 color: 'text-purple-500',
 bg: 'bg-purple-500/10',
 },
 {
 titleKey: 'landing.demos.items.crm.title',
 descriptionKey: 'landing.demos.items.crm.desc',
 to: '/dashboard/crm',
 image: '/assets/landing/demos/crm.png',
 mode: 'light',
 icon: Icons.users,
 color: 'text-orange-500',
 bg: 'bg-orange-500/10',
 },
 {
 titleKey: 'landing.demos.items.calendar.title',
 descriptionKey: 'landing.demos.items.calendar.desc',
 to: '/app/calendar',
 image: '/assets/landing/demos/calendar.png',
 mode: 'light',
 icon: Icons.calendar,
 color: 'text-pink-500',
 bg: 'bg-pink-500/10',
 },
] as const

export function DemosSection() {
 const { setMode } = useTheme()
 const { t } = useLocale()

 return (
 <section id="demos" className="py-24 px-4 bg-surface-50 dark:bg-surface-950 scroll-mt-24 relative overflow-hidden">
 {/* Background decoration */}
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

 <div className="max-w-7xl mx-auto relative z-10">
 <div className="flex items-end justify-between gap-6 flex-wrap mb-16">
 <div>
 <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm mb-6">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
 </span>
 <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-300">
 {t('landing.demos.badge')}
 </span>
 </div>
 <h2 className="text-display-section text-secondary-900 dark:text-white">
 {t('landing.demos.title_prefix')} <span className="text-accent-brand">{t('landing.demos.title_emphasis')}</span>
 </h2>
 <p className="text-lead text-secondary-600 dark:text-secondary-400 mt-4 max-w-2xl">
 {t('landing.demos.subtitle')}
 </p>
 </div>
          <Button asChild variant="outline">
            <Link to="/dashboard" className="flex items-center gap-2">
              {t('landing.demos.open_dashboard')}
              <Icon icon={Icons.arrowRight} className="w-4 h-4" />
            </Link>
          </Button>
        </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
 {demos.map((d) => (
 <Link
 key={d.titleKey}
 to={d.to}
 onPointerDown={() => setMode(d.mode)}
 onClick={() => setMode(d.mode)}
 className="group relative rounded-lg overflow-hidden border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 transition-all duration-500"
 >
 {/* Image Container */}
 <div className="relative overflow-hidden bg-surface-100 dark:bg-surface-900 group-hover:opacity-100 transition-opacity h-[310px]">
 {/* Placeholder or Image */}
 <div className="absolute inset-0 bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-secondary-300 dark:text-secondary-700">
 <Icon icon={d.icon} className="w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110" />
 </div>
 <img
 src={d.image}
 alt={t(d.titleKey)}
 className="absolute inset-0 w-full h-full object-cover object-top"
 loading="lazy"
 />

 {/* Overlay on hover */}
 <div className="absolute inset-0 bg-secondary-900/0 group-hover:bg-secondary-900/5 transition-colors duration-300" />
 </div>

 <div className="p-5">
 <div className="flex items-start gap-3">
 <div className={`w-10 h-10 rounded-xl ${d.bg} flex items-center justify-center ${d.color} flex-shrink-0`}>
 <Icon icon={d.icon} width={20} height={20} />
 </div>
 <div className="flex-1">
 <h3 className="font-bold text-secondary-900 dark:text-white group-hover:text-theme-primary transition-colors text-base">
 {t(d.titleKey)}
 </h3>
 <p className="text-body text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
 {t(d.descriptionKey)}
 </p>
 </div>
 </div>

 <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
 <span className="text-ui-xs font-bold text-secondary-400 uppercase tracking-wider">{t('landing.demos.view_demo')}</span>
 <div className="w-7 h-7 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-secondary-500 group-hover:bg-theme-primary group-hover:text-white transition-all duration-300">
 <Icon icon={Icons.arrowRight} width={12} height={12} />
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </div>
 </section>
 )
}
