import { Link } from 'react-router'
import { Button, Checkbox, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'

interface CredentialsFormProps {
  email: string
  password: string
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
  busy?: boolean
}

export function CredentialsForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitLabel,
  busy,
}: CredentialsFormProps) {
  const { t } = useLocale()

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField label={t('auth.email_address')} htmlFor="email">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
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

      <Button type="submit" fullWidth size="lg" disabled={busy}>
        {submitLabel}
      </Button>
    </form>
  )
}
