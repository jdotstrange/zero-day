import { Link, useNavigate } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'

export function ForgotPasswordPage() {
  const { t } = useLocale()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/auth/login')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="heading-2 mb-2 text-secondary-900 dark:text-white">
          {t('auth.forgot_password.title')} 🔒
        </h1>
        <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
          {t('auth.forgot_password.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label={t('auth.email_address')} htmlFor="email">
          <Input id="email" type="email" placeholder="name@example.com" required />
        </FormField>

        <Button type="submit" fullWidth size="lg">
          {t('auth.forgot_password.submit')}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Button asChild variant="ghost" size="sm">
          <Link to="/auth/login">
            <Icon icon={Icons.chevronLeft} width={16} height={16} />
            {t('auth.forgot_password.back_to_login')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
