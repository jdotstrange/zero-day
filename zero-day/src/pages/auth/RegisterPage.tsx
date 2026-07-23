import { Link, useNavigate } from 'react-router'
import { Button, Checkbox, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'

export function RegisterPage() {
  const { t } = useLocale()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="heading-2 mb-2 text-secondary-900 dark:text-white">
          {t('auth.register.title')} 🚀
        </h1>
        <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('common.first_name')} htmlFor="firstName">
            <Input id="firstName" type="text" defaultValue="John" placeholder="John" required />
          </FormField>
          <FormField label={t('common.last_name')} htmlFor="lastName">
            <Input id="lastName" type="text" defaultValue="Doe" placeholder="Doe" required />
          </FormField>
        </div>

        <FormField label={t('auth.email_address')} htmlFor="email">
          <Input
            id="email"
            type="email"
            defaultValue="john@example.com"
            placeholder="name@example.com"
            required
          />
        </FormField>

        <FormField
          label={t('common.password')}
          htmlFor="password"
          hint={t('auth.register.password_hint_min8')}
        >
          <Input
            id="password"
            type="password"
            defaultValue="123456789"
            placeholder="••••••••"
            required
          />
        </FormField>

        <FormField>
          <label className="flex cursor-pointer select-none items-start gap-2">
            <Checkbox id="terms" className="mt-0.5" />
            <span className="text-body-sm leading-relaxed text-secondary-500 dark:text-secondary-400">
              {t('auth.register.agree_prefix')}{' '}
              <Link to="/terms" className="font-medium text-theme-primary hover:underline">
                {t('auth.register.terms_of_service')}
              </Link>{' '}
              {t('auth.register.and')}{' '}
              <Link to="/privacy" className="font-medium text-theme-primary hover:underline">
                {t('auth.register.privacy_policy')}
              </Link>
            </span>
          </label>
        </FormField>

        <Button type="submit" fullWidth size="lg">
          {t('auth.register.create_account')}
        </Button>
      </form>

      <div className="mt-8 text-center text-body-sm text-secondary-500 dark:text-secondary-400">
        {t('auth.register.already_have_account')}{' '}
        <Link
          to="/auth/login"
          className="font-bold text-theme-primary hover:text-theme-primary/80 hover:underline"
        >
          {t('auth.register.sign_in')}
        </Link>
      </div>
    </div>
  )
}
