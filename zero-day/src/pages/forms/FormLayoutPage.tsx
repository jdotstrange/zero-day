import { useState } from 'react'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Card, Checkbox, FormField, Input, Select, Textarea } from '@/components/ui'
import { useLocale } from '@/i18n'

export function FormLayoutPage() {
  const { t } = useLocale()
  const [lastSubmit, setLastSubmit] = useState<string | null>(null)
  const [subscribe, setSubscribe] = useState(false)

  const handleSubmit = () => (e: React.FormEvent) => {
    e.preventDefault()
    setLastSubmit(t('forms.submitted'))
    window.setTimeout(() => setLastSubmit(null), 2500)
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('nav.form_layout')}
        subtitle={t('forms.layout.subtitle')}
      />

      {lastSubmit && (
        <Card className="rounded-xl border border-success-200 bg-success-50/60 p-4 dark:border-success-800 dark:bg-success-900/20">
          <p className="text-body-sm text-success-800 dark:text-success-200">{lastSubmit}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-xl">
          <div className="mb-5">
            <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.layout.stacked_title')}</h2>
            <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
              {t('forms.layout.stacked_desc')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit()}>
            <FormField label={t('common.full_name')} htmlFor="stacked_fullName">
              <Input id="stacked_fullName" placeholder="John Doe" />
            </FormField>

            <FormField label={t('common.email')} htmlFor="stacked_email">
              <Input id="stacked_email" type="email" placeholder="john@example.com" />
            </FormField>

            <FormField label={t('common.company')} htmlFor="stacked_company">
              <Input id="stacked_company" placeholder="0-Day Inc." />
            </FormField>

            <FormField label={t('common.message')} htmlFor="stacked_message">
              <Textarea
                id="stacked_message"
                rows={4}
                placeholder={t('forms.layout.message_placeholder')}
              />
            </FormField>

            <FormField>
              <label className="flex cursor-pointer select-none items-start gap-3">
                <Checkbox
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
                <span className="text-body-sm text-secondary-700 dark:text-secondary-300">
                  {t('forms.layout.subscribe_updates')}
                </span>
              </label>
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="secondary">
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.submit')}</Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-xl">
          <div className="mb-5">
            <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.layout.two_column_title')}</h2>
            <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
              {t('forms.layout.two_column_desc')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit()}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('common.first_name')} htmlFor="two_firstName">
                <Input id="two_firstName" placeholder="John" />
              </FormField>
              <FormField label={t('common.last_name')} htmlFor="two_lastName">
                <Input id="two_lastName" placeholder="Doe" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label={t('common.email')} htmlFor="two_email">
                <Input id="two_email" type="email" placeholder="john@example.com" />
              </FormField>
              <FormField label={t('common.phone')} htmlFor="two_phone">
                <Input id="two_phone" placeholder="+1 (555) 123-4567" />
              </FormField>
            </div>

            <FormField label={t('common.address')} htmlFor="two_address">
              <Input id="two_address" placeholder="123 Main St" />
            </FormField>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label={t('common.city')} htmlFor="two_city">
                <Input id="two_city" placeholder="San Francisco" />
              </FormField>
              <FormField label={t('common.state')} htmlFor="two_state">
                <Input id="two_state" placeholder="CA" />
              </FormField>
              <FormField label={t('common.zip')} htmlFor="two_zip">
                <Input id="two_zip" placeholder="94105" />
              </FormField>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="secondary">
                {t('common.reset')}
              </Button>
              <Button type="submit">{t('common.save_changes')}</Button>
            </div>
          </form>
        </Card>
      </div>

      <Card className="rounded-xl">
        <div className="mb-5">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.layout.inline_title')}</h2>
          <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
            {t('forms.layout.inline_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit()} className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <FormField label={t('common.search')} htmlFor="inline_search" className="flex-1">
            <Input id="inline_search" placeholder={t('forms.layout.inline_search_placeholder')} />
          </FormField>

          <FormField label={t('common.status')} htmlFor="inline_status" className="w-full lg:w-56">
            <Select id="inline_status" defaultValue="all">
              <option value="all">{t('common.all')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="paused">{t('common.paused')}</option>
              <option value="archived">{t('common.archived')}</option>
            </Select>
          </FormField>

          <FormField label={t('common.sort')} htmlFor="inline_sort" className="w-full lg:w-56">
            <Select id="inline_sort" defaultValue="newest">
              <option value="newest">{t('common.sort_newest')}</option>
              <option value="oldest">{t('common.sort_oldest')}</option>
              <option value="az">{t('common.sort_az')}</option>
              <option value="za">{t('common.sort_za')}</option>
            </Select>
          </FormField>

          <Button type="submit">{t('common.apply')}</Button>
        </form>
      </Card>
    </div>
  )
}

export default FormLayoutPage
