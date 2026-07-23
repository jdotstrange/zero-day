import { useMemo, useState } from 'react'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Card, Checkbox, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'

type Values = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Values, t: (key: string) => string): Errors {
  const errors: Errors = {}

  if (!values.fullName.trim()) errors.fullName = t('forms.validation.errors.full_name_required')

  if (!values.email.trim()) errors.email = t('forms.validation.errors.email_required')
  else if (!emailRegex.test(values.email)) errors.email = t('forms.validation.errors.email_invalid')

  if (!values.password) errors.password = t('forms.validation.errors.password_required')
  else if (values.password.length < 8) errors.password = t('forms.validation.errors.password_min8')

  if (!values.confirmPassword) errors.confirmPassword = t('forms.validation.errors.confirm_password_required')
  else if (values.confirmPassword !== values.password) errors.confirmPassword = t('forms.validation.errors.passwords_no_match')

  if (!values.acceptTerms) errors.acceptTerms = t('forms.validation.errors.accept_terms_required')

  return errors
}

export function FormValidationPage() {
  const { t } = useLocale()
  const [values, setValues] = useState<Values>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)

  const errors = useMemo(() => validate(values, t), [values, t])

  const showError = (field: keyof Values) => {
    if (submitted) return errors[field]
    return touched[field] ? errors[field] : undefined
  }

  const setField = <K extends keyof Values>(field: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const currentErrors = validate(values, t)
    if (Object.keys(currentErrors).length > 0) {
      setSuccess(false)
      return
    }

    setSuccess(true)
    setSubmitted(false)
    setTouched({})
    setValues({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    })
  }

  const resetForm = () => {
    setValues({ fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false })
    setTouched({})
    setSubmitted(false)
    setSuccess(false)
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('nav.form_validation')}
        subtitle={t('forms.validation.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-xl">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.validation.registration_title')}</h2>
          <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
            {t('forms.validation.registration_desc')}
          </p>

          {success && (
            <div className="mt-4 rounded-xl border border-success-200 bg-success-50/60 p-4 dark:border-success-800 dark:bg-success-900/20">
              <p className="text-body-sm text-success-800 dark:text-success-200">
                {t('forms.validation.success')}
              </p>
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <FormField
              label={t('common.full_name')}
              htmlFor="val_fullName"
              required
              error={showError('fullName')}
            >
              <Input
                id="val_fullName"
                value={values.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                error={!!showError('fullName')}
                placeholder="John Doe"
              />
            </FormField>

            <FormField
              label={t('common.email')}
              htmlFor="val_email"
              required
              error={showError('email')}
            >
              <Input
                id="val_email"
                type="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                error={!!showError('email')}
                placeholder="john@example.com"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label={t('common.password')}
                htmlFor="val_password"
                required
                error={showError('password')}
              >
                <Input
                  id="val_password"
                  type="password"
                  value={values.password}
                  onChange={(e) => setField('password', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  error={!!showError('password')}
                  placeholder={t('forms.validation.password_placeholder_min8')}
                />
              </FormField>

              <FormField
                label={t('forms.validation.confirm_password')}
                htmlFor="val_confirmPassword"
                required
                error={showError('confirmPassword')}
              >
                <Input
                  id="val_confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  error={!!showError('confirmPassword')}
                  placeholder={t('forms.validation.confirm_password_placeholder')}
                />
              </FormField>
            </div>

            <FormField error={showError('acceptTerms')}>
              <label className="flex cursor-pointer select-none items-start gap-3">
                <Checkbox
                  checked={values.acceptTerms}
                  onChange={(e) => setField('acceptTerms', e.target.checked)}
                  onBlur={() => setTouched((prev) => ({ ...prev, acceptTerms: true }))}
                />
                <span className="text-body-sm text-secondary-700 dark:text-secondary-300">
                  {t('forms.validation.accept_terms_label')}
                </span>
              </label>
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={resetForm}>
                {t('common.clear')}
              </Button>
              <Button type="submit">{t('common.submit')}</Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-xl">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.validation.notes_title')}</h2>
          <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
            {t('forms.validation.notes_subtitle')}
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-700">
              <p className="text-body-sm text-secondary-700 dark:text-secondary-300">
                - {t('forms.validation.notes_item_1')}
                <br />
                - {t('forms.validation.notes_item_2')}
                <br />
                - {t('forms.validation.notes_item_3')}
              </p>
            </div>

            <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-700">
              <p className="text-body-sm text-secondary-700 dark:text-secondary-300">
                {t('forms.validation.notes_library')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FormValidationPage
