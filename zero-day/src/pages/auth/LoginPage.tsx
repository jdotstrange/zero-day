import { Link, useNavigate } from 'react-router'
import { Button, Checkbox, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'

export function LoginPage() {
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
          {t('auth.login.title')} 👋
        </h1>
        <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          label={
            <div className="flex w-full items-center justify-between gap-2">
              <span>{t('common.password')}</span>
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-theme-primary hover:text-theme-primary/80"
              >
                {t('auth.login.forgot_password')}
              </Link>
            </div>
          }
          htmlFor="password"
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
          <label className="flex cursor-pointer select-none items-center gap-2">
            <Checkbox id="remember" />
            <span className="text-body-sm text-secondary-500 dark:text-secondary-400">
              {t('auth.login.remember_me_30')}
            </span>
          </label>
        </FormField>

        <Button type="submit" fullWidth size="lg">
          {t('auth.login.sign_in')}
        </Button>
      </form>

      <div className="mt-8 text-center text-body-sm text-secondary-500 dark:text-secondary-400">
        {t('auth.login.no_account')}{' '}
        <Link
          to="/auth/register"
          className="font-bold text-theme-primary hover:text-theme-primary/80 hover:underline"
        >
          {t('auth.login.create_account')}
        </Link>
      </div>
    </div>
  )
}
