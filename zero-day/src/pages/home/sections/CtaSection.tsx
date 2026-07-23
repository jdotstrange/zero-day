import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

export function CtaSection() {
	const { t } = useLocale()

 return (
 <section id="cta" className="py-16 px-4 bg-white dark:bg-surface-900 scroll-mt-24">
 <div className="max-w-7xl mx-auto">
 <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-theme-primary/10 p-10 overflow-hidden relative">
 <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-theme-primary/20 blur-3xl" />
 <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

 <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
 <div className="lg:col-span-7">
 <h2 className="heading-2 text-secondary-900 dark:text-white">{t('landing.cta.title')}</h2>
 <p className="text-body text-secondary-600 dark:text-secondary-400 mt-3 max-w-2xl">
 {t('landing.cta.subtitle')}
 </p>
 <div className="mt-7 flex flex-col sm:flex-row gap-4">
 <Button asChild size="lg">
 <Link to="/auth/register">
 {t('landing.cta.primary')}
 <Icon icon={Icons.arrowRight} className="w-5 h-5" />
 </Link>
 </Button>
 <Button asChild variant="outline" size="lg">
 <Link to="/dashboard">{t('landing.cta.secondary')}</Link>
 </Button>
 </div>
 </div>

 <div className="lg:col-span-5">
 <div className="rounded-2xl bg-white/70 dark:bg-surface-900/70 border border-surface-200 dark:border-surface-800 p-6">
 <p className="text-sm font-semibold text-secondary-900 dark:text-white">{t('landing.cta.highlights.title')}</p>
 <ul className="mt-4 space-y-3 text-sm text-secondary-700 dark:text-secondary-200">
 <li className="flex items-center justify-between">
 <span>{t('landing.cta.highlights.items.forms')}</span>
 <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
 </li>
 <li className="flex items-center justify-between">
 <span>{t('landing.cta.highlights.items.tables')}</span>
 <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
 </li>
 <li className="flex items-center justify-between">
 <span>{t('landing.cta.highlights.items.charts')}</span>
 <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 )
}
