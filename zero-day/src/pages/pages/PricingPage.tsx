import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

export default function PricingPage() {
 const { t } = useLocale()
 const [openIndex, setOpenIndex] = useState<number | null>(0)

 const plans = [
 {
 id: 'starter',
 nameKey: 'pricing.plan.starter.name',
 descriptionKey: 'pricing.plan.starter.description',
 price: '$9',
 periodKey: 'pricing.per_month',
 popular: false,
 features: [
 { key: 'pricing.feature.team_members_5', included: true },
 { key: 'pricing.feature.storage_10gb', included: true },
 { key: 'pricing.feature.analytics_basic', included: true },
 { key: 'pricing.feature.email_support', included: true },
 { key: 'pricing.feature.custom_domain', included: false },
 { key: 'pricing.feature.analytics_advanced', included: false },
 { key: 'pricing.feature.priority_support', included: false },
 { key: 'pricing.feature.api_access', included: false },
 ],
 },
 {
 id: 'professional',
 nameKey: 'pricing.plan.professional.name',
 descriptionKey: 'pricing.plan.professional.description',
 price: '$29',
 periodKey: 'pricing.per_month',
 popular: true,
 features: [
 { key: 'pricing.feature.team_members_25', included: true },
 { key: 'pricing.feature.storage_100gb', included: true },
 { key: 'pricing.feature.analytics_advanced', included: true },
 { key: 'pricing.feature.priority_email_support', included: true },
 { key: 'pricing.feature.custom_domain', included: true },
 { key: 'pricing.feature.api_access', included: true },
 { key: 'pricing.feature.phone_support_24_7', included: false },
 { key: 'pricing.feature.dedicated_manager', included: false },
 ],
 },
 {
 id: 'enterprise',
 nameKey: 'pricing.plan.enterprise.name',
 descriptionKey: 'pricing.plan.enterprise.description',
 price: '$99',
 periodKey: 'pricing.per_month',
 popular: false,
 features: [
 { key: 'pricing.feature.team_members_unlimited', included: true },
 { key: 'pricing.feature.storage_unlimited', included: true },
 { key: 'pricing.feature.analytics_reporting_advanced', included: true },
 { key: 'pricing.feature.support_phone_email_24_7', included: true },
 { key: 'pricing.feature.custom_domain_branding', included: true },
 { key: 'pricing.feature.api_access_full', included: true },
 { key: 'pricing.feature.account_manager_dedicated', included: true },
 { key: 'pricing.feature.integrations_custom', included: true },
 ],
 },
 ]

 const faqs = [
 { questionKey: 'pricing.faq.q1.question', answerKey: 'pricing.faq.q1.answer' },
 { questionKey: 'pricing.faq.q2.question', answerKey: 'pricing.faq.q2.answer' },
 { questionKey: 'pricing.faq.q3.question', answerKey: 'pricing.faq.q3.answer' },
 ]

 return (
 <div className="space-y-12">
 {/* Header */}
 <div className="text-center max-w-3xl mx-auto">
 <span className="inline-block py-1 px-3 rounded-full bg-theme-primary/10 text-theme-primary text-sm font-semibold mb-4">
 {t('pricing.title')}
 </span>
 <h1 className="heading-2 text-secondary-900 dark:text-white mb-6">
 {t('pricing.heading')}
 </h1>
 <p className="text-body-sm text-secondary-600 dark:text-secondary-400">
 {t('pricing.subtitle')}
 </p>
 </div>

 {/* Pricing Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
 {plans.map((plan) => (
 <div
 key={plan.id}
 className={`relative rounded-lg p-8 flex flex-col transition-all duration-300 ${
 plan.popular
 ? 'bg-white dark:bg-surface-900 shadow-2xl shadow-theme-primary/10 border-2 border-theme-primary scale-105 z-10'
 : 'bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 hover:border-theme-primary/30'
 }`}
 >
 {plan.popular && (
 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-theme-primary text-white px-4 py-1 rounded-full text-sm font-bold">
 {t('pricing.most_popular')}
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
 <div key={feature.key} className="flex items-center gap-3">
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
 className={`text-sm ${
 feature.included
 ? 'text-secondary-700 dark:text-secondary-300 font-medium'
 : 'text-secondary-400 dark:text-secondary-600'
 }`}
 >
 {t(feature.key)}
 </span>
 </div>
 ))}
 </div>

            <Button
              fullWidth
              size="lg"
              variant={plan.popular ? 'primary' : 'outline'}
            >
              {t('pricing.get_started')}
            </Button>
 </div>
 ))}
 </div>

 {/* FAQ Section */}
 <div className="max-w-3xl mx-auto">
 <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 text-center">
 {t('pricing.faq_title')}
 </h2>
 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <div
 key={index}
 className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
 openIndex === index
 ? 'bg-surface-50 dark:bg-surface-950 border-theme-primary/30 shadow-lg shadow-theme-primary/5'
 : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-theme-primary/20'
 }`}
 >
 <button
 onClick={() => setOpenIndex(openIndex === index ? null : index)}
 className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
 >
 <span className="text-lg font-bold text-secondary-900 dark:text-white pr-8">
 {t(faq.questionKey)}
 </span>
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
 openIndex === index
 ? 'bg-theme-primary text-white'
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-500 dark:text-secondary-400'
 }`}
 >
 {openIndex === index ? <Icon icon={Icons.minus} width={18} height={18} /> : <Icon icon={Icons.plus} width={18} height={18} />}
 </div>
 </button>
 
 <div
 className={`grid transition-[grid-template-rows] duration-300 ease-out ${
 openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
 }`}
 >
 <div className="overflow-hidden">
 <div className="px-8 pb-8 pt-0 text-secondary-600 dark:text-secondary-400 leading-relaxed">
 {t(faq.answerKey)}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
