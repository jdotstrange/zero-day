import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const faqs = [
 {
 questionKey: 'landing.faq.items.free_template.question',
 answerKey: 'landing.faq.items.free_template.answer',
 },
 {
 questionKey: 'landing.faq.items.commercial_use.question',
 answerKey: 'landing.faq.items.commercial_use.answer',
 },
 {
 questionKey: 'landing.faq.items.support.question',
 answerKey: 'landing.faq.items.support.answer',
 },
 {
 questionKey: 'landing.faq.items.react_version.question',
 answerKey: 'landing.faq.items.react_version.answer',
 },
 {
 questionKey: 'landing.faq.items.typescript_required.question',
 answerKey: 'landing.faq.items.typescript_required.answer',
 },
 {
 questionKey: 'landing.faq.items.updates.question',
 answerKey: 'landing.faq.items.updates.answer',
 },
]

export function FaqSection() {
 const [openIndex, setOpenIndex] = useState<number | null>(0)
 const { t } = useLocale()

 return (
 <section id="faq" className="py-24 px-4 bg-white dark:bg-surface-900 scroll-mt-24">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-16">
 <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm mb-6">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
 </span>
 <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-300">
 {t('landing.faq.badge')}
 </span>
 </div>
 <h2 className="text-display-section text-secondary-900 dark:text-white mb-6">
 {t('landing.faq.title_prefix')} <span className="text-accent-brand">{t('landing.faq.title_emphasis')}</span>
 </h2>
 <p className="text-lead text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
 {t('landing.faq.subtitle')}
 </p>
 </div>

 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <div
 key={index}
 className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
 ? 'bg-surface-50 dark:bg-surface-950 border-theme-primary/30 shadow-lg shadow-theme-primary/5'
 : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-theme-primary/20'
 }`}
 >
 <button
 onClick={() => setOpenIndex(openIndex === index ? null : index)}
 className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
 >
 <span className="heading-5 text-secondary-900 dark:text-white pr-8">
 {t(faq.questionKey)}
 </span>
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index
 ? 'bg-theme-primary text-white'
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-500 dark:text-secondary-400'
 }`}
 >
 {openIndex === index ? <Icon icon={Icons.minus} width={18} height={18} /> : <Icon icon={Icons.plus} width={18} height={18} />}
 </div>
 </button>

 <div
 className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
 }`}
 >
 <div className="overflow-hidden">
 <div className="px-8 pb-8 pt-0 text-body text-secondary-600 dark:text-secondary-400 leading-relaxed">
 {t(faq.answerKey)}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 )
}
