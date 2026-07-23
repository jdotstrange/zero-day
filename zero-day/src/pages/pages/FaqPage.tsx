import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

export default function FaqPage() {
 const { t } = useLocale()
 const [searchQuery, setSearchQuery] = useState('')
 const [openIndex, setOpenIndex] = useState<number | null>(0)

 const faqsData = [
 {
 categoryKey: 'faq.category.getting_started',
 questions: [
 { questionKey: 'faq.getting_started.q1.question', answerKey: 'faq.getting_started.q1.answer' },
 { questionKey: 'faq.getting_started.q2.question', answerKey: 'faq.getting_started.q2.answer' },
 { questionKey: 'faq.getting_started.q3.question', answerKey: 'faq.getting_started.q3.answer' },
 ],
 },
 {
 categoryKey: 'faq.category.billing',
 questions: [
 { questionKey: 'faq.billing.q1.question', answerKey: 'faq.billing.q1.answer' },
 { questionKey: 'faq.billing.q2.question', answerKey: 'faq.billing.q2.answer' },
 { questionKey: 'faq.billing.q3.question', answerKey: 'faq.billing.q3.answer' },
 ],
 },
 {
 categoryKey: 'faq.category.features',
 questions: [
 { questionKey: 'faq.features.q1.question', answerKey: 'faq.features.q1.answer' },
 { questionKey: 'faq.features.q2.question', answerKey: 'faq.features.q2.answer' },
 { questionKey: 'faq.features.q3.question', answerKey: 'faq.features.q3.answer' },
 { questionKey: 'faq.features.q4.question', answerKey: 'faq.features.q4.answer' },
 ],
 },
 {
 categoryKey: 'faq.category.technical',
 questions: [
 { questionKey: 'faq.technical.q1.question', answerKey: 'faq.technical.q1.answer' },
 { questionKey: 'faq.technical.q2.question', answerKey: 'faq.technical.q2.answer' },
 { questionKey: 'faq.technical.q3.question', answerKey: 'faq.technical.q3.answer' },
 ],
 },
 ]

 const faqs = faqsData.map((category) => ({
 category: t(category.categoryKey),
 questions: category.questions.map((q) => ({
 question: t(q.questionKey),
 answer: t(q.answerKey),
 })),
 }))

 const filteredFaqs = faqs
 .map((category) => ({
 ...category,
 questions: category.questions.filter(
 (q) =>
 q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
 q.answer.toLowerCase().includes(searchQuery.toLowerCase())
 ),
 }))
 .filter((category) => category.questions.length > 0)

 return (
 <div className="space-y-6 max-w-4xl mx-auto">
 {/* Header */}
 <div className="text-center">
 <h1 className="heading-2 text-secondary-900 dark:text-white">
 {t('faq.title')}
 </h1>
 <p className="mt-2 text-body-sm text-secondary-600 dark:text-secondary-400">
 {t('faq.description')}
 </p>
 </div>

 {/* Search */}
 <div className="card rounded-xl p-4">
 <div className="relative">
 <Icon
 icon={Icons.search}
 width={20}
 height={20}
 className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
 />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder={t('faq.search_placeholder')}
 className="w-full pl-12 pr-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
 />
 </div>
 </div>

 {/* FAQ Categories */}
 {filteredFaqs.length > 0 ? (
 <div className="space-y-8">
 {filteredFaqs.map((category, categoryIndex) => (
 <div key={categoryIndex}>
 <h2 className="heading-4 text-secondary-900 dark:text-white mb-4">
 {category.category}
 </h2>
 <div className="space-y-3">
 {category.questions.map((faq, index) => {
 const globalIndex = faqs
 .slice(0, categoryIndex)
 .reduce((acc, cat) => acc + cat.questions.length, 0) + index
 const isOpen = openIndex === globalIndex

 return (
 <div
 key={index}
 className="card rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700"
 >
 <button
 onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
 className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
 >
 <h3 className="text-base font-semibold text-secondary-900 dark:text-white pr-4">
 {faq.question}
 </h3>
 <Icon
 icon={Icons.chevronDown}
 width={20}
 height={20}
 className={`text-secondary-400 flex-shrink-0 transition-transform ${
 isOpen ? 'rotate-180' : ''
 }`}
 />
 </button>
 {isOpen && (
 <div className="px-6 pb-4 pt-2">
 <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
 {faq.answer}
 </p>
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="card rounded-xl p-12 text-center">
 <p className="text-secondary-500 dark:text-secondary-400">
 {t('faq.no_results', { query: searchQuery })}
 </p>
 </div>
 )}

 {/* Still have questions? */}
 <div className="card rounded-xl p-8 text-center bg-theme-primary/10 dark:bg-theme-primary/20 border border-theme-primary/20">
 <h3 className="heading-4 text-secondary-900 dark:text-white mb-2">
 {t('faq.still_questions')}
 </h3>
 <p className="text-body text-secondary-600 dark:text-secondary-400 mb-4">
 {t('faq.still_questions_desc')}
 </p>
        <Button size="lg">{t('faq.contact_support')}</Button>
 </div>
 </div>
 )
}
