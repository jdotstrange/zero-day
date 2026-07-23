import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

const plans = [
 {
 nameKey: 'landing.pricing.plans.starter.name',
 price: '$9',
 periodKey: 'landing.pricing.period.per_month',
 descriptionKey: 'landing.pricing.plans.starter.description',
 features: [
 { nameKey: 'landing.pricing.features.team_members_5', included: true },
 { nameKey: 'landing.pricing.features.storage_10gb', included: true },
 { nameKey: 'landing.pricing.features.basic_analytics', included: true },
 { nameKey: 'landing.pricing.features.email_support', included: true },
 { nameKey: 'landing.pricing.features.custom_domain', included: false },
 { nameKey: 'landing.pricing.features.advanced_analytics', included: false },
 { nameKey: 'landing.pricing.features.priority_support', included: false },
 { nameKey: 'landing.pricing.features.api_access', included: false },
 ],
 ctaKey: 'landing.pricing.cta.get_started',
 popular: false,
 },
 {
 nameKey: 'landing.pricing.plans.professional.name',
 price: '$29',
 periodKey: 'landing.pricing.period.per_month',
 descriptionKey: 'landing.pricing.plans.professional.description',
 features: [
 { nameKey: 'landing.pricing.features.team_members_25', included: true },
 { nameKey: 'landing.pricing.features.storage_100gb', included: true },
 { nameKey: 'landing.pricing.features.advanced_analytics', included: true },
 { nameKey: 'landing.pricing.features.priority_email_support', included: true },
 { nameKey: 'landing.pricing.features.custom_domain', included: true },
 { nameKey: 'landing.pricing.features.api_access', included: true },
 { nameKey: 'landing.pricing.features.phone_support_24_7', included: false },
 { nameKey: 'landing.pricing.features.dedicated_manager', included: false },
 ],
 ctaKey: 'landing.pricing.cta.get_started',
 popular: true,
 },
 {
 nameKey: 'landing.pricing.plans.enterprise.name',
 price: '$99',
 periodKey: 'landing.pricing.period.per_month',
 descriptionKey: 'landing.pricing.plans.enterprise.description',
 features: [
 { nameKey: 'landing.pricing.features.team_members_unlimited', included: true },
 { nameKey: 'landing.pricing.features.storage_unlimited', included: true },
 { nameKey: 'landing.pricing.features.advanced_reporting', included: true },
 { nameKey: 'landing.pricing.features.support_24_7_phone_email', included: true },
 { nameKey: 'landing.pricing.features.custom_branding', included: true },
 { nameKey: 'landing.pricing.features.api_access_full', included: true },
 { nameKey: 'landing.pricing.features.dedicated_account_manager', included: true },
 { nameKey: 'landing.pricing.features.custom_integrations', included: true },
 ],
 ctaKey: 'landing.pricing.cta.get_started',
 popular: false,
 },
]

export function PricingSection() {
 const { t } = useLocale()

 return (
 <section id="pricing" className="py-24 px-4 bg-surface-50 dark:bg-surface-950 scroll-mt-24 relative overflow-hidden">
 <div className="max-w-7xl mx-auto relative z-10">
 <div className="text-center mb-20">
 <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm mb-6">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
 </span>
 <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-300">
 {t('landing.pricing.badge')}
 </span>
 </div>
 <h2 className="text-display-section text-secondary-900 dark:text-white mb-6">
 {t('landing.pricing.title_prefix')} <span className="text-accent-brand">{t('landing.pricing.title_emphasis')}</span>
 </h2>
 <p className="text-lead text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
 {t('landing.pricing.subtitle')}
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
 {plans.map((plan) => (
 <div
 key={plan.nameKey}
 className={`relative rounded-lg p-8 flex flex-col transition-all duration-300 ${plan.popular
 ? 'bg-white dark:bg-surface-900 shadow-2xl shadow-theme-primary/10 border-2 border-theme-primary scale-105 z-10'
 : 'bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 hover:border-theme-primary/30'
 }`}
 >
 {plan.popular && (
 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-theme-primary text-white px-4 py-1 rounded-full text-sm font-bold">
 {t('landing.pricing.most_popular')}
 </div>
 )}

 <div className="mb-8">
 <h3 className="heading-5 text-secondary-900 dark:text-white mb-2">{t(plan.nameKey)}</h3>
 <p className="text-body-sm text-secondary-500 dark:text-secondary-400 h-10">{t(plan.descriptionKey)}</p>
 </div>

 <div className="mb-8">
 <div className="flex items-baseline">
 <span className="text-display-price text-secondary-900 dark:text-white tracking-tight">
 {plan.price}
 </span>
 <span className="text-body-sm text-secondary-500 dark:text-secondary-400 ml-2">{t(plan.periodKey)}</span>
 </div>
 </div>

 <div className="flex-grow space-y-4 mb-8">
 {plan.features.map((feature) => (
 <div key={feature.nameKey} className="flex items-center gap-3">
 {feature.included ? (
 <div className="w-6 h-6 rounded-full bg-theme-primary/10 flex items-center justify-center flex-shrink-0">
 <Icon icon={Icons.check} className="w-4 h-4 text-theme-primary" />
 </div>
 ) : (
 <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center flex-shrink-0">
 <Icon icon={Icons.x} className="w-4 h-4 text-secondary-400 dark:text-secondary-600" />
 </div>
 )}
 <span
 className={`text-sm ${feature.included
 ? 'text-secondary-700 dark:text-secondary-300 font-medium'
 : 'text-secondary-400 dark:text-secondary-600'
 }`}
 >
 {t(feature.nameKey)}
 </span>
 </div>
 ))}
 </div>

 <Button
 fullWidth
 size="lg"
 variant={plan.popular ? 'primary' : 'outline'}
 >
 {t(plan.ctaKey)}
 </Button>
 </div>
 ))}
 </div>
 </div>
 </section>
 )
}
