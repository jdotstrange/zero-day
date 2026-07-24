import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { authConfig, type AuthMethod } from '@/auth/config'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/i18n'
import { CredentialsForm } from './components/CredentialsForm'
import { EntraButton } from './components/EntraButton'
import { PasswordlessForm } from './components/PasswordlessForm'
import { SocialButtons } from './components/SocialButtons'

function MethodDivider() {
  return <div className="my-6 h-px bg-surface-200 dark:bg-surface-700" />
}

export function LoginPage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('john@example.com')
  const [password, setPassword] = useState('123456789')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: string } | null)?.from ?? authConfig.postLoginPath

  const methods = authConfig.methods
  const showCredentials = methods.includes('credentials')
  const showPasswordless = methods.includes('passwordless')
  const showSocial = methods.includes('social')
  const showEntra = methods.includes('entra')
  const showRegister =
    authConfig.registerEnabled && (showCredentials || showPasswordless)

  const ordered: AuthMethod[] = [
    authConfig.primary,
    ...methods.filter((m) => m !== authConfig.primary),
  ].filter((m) => methods.includes(m))

  const afterLogin = () => {
    navigate(from)
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('not configured')) {
        setError(t('auth.sso.not_configured'))
      } else {
        setError(message)
      }
      throw err
    } finally {
      setBusy(false)
    }
  }

  const renderMethod = (method: AuthMethod, isFirst: boolean) => {
    switch (method) {
      case 'credentials':
        if (!showCredentials) return null
        return (
          <CredentialsForm
            key="credentials"
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            busy={busy}
            submitLabel={t('auth.login.sign_in')}
            onSubmit={(e) => {
              e.preventDefault()
              void run(async () => {
                await signIn({ method: 'credentials', email, password })
                afterLogin()
              }).catch(() => {})
            }}
          />
        )
      case 'passwordless':
        if (!showPasswordless) return null
        return (
          <PasswordlessForm
            key="passwordless"
            mode={authConfig.passwordlessMode}
            busy={busy}
            onRequest={async (e) => {
              await run(async () => {
                await signIn({ method: 'passwordless-request', email: e })
                if (authConfig.passwordlessMode === 'magic-link') {
                  afterLogin()
                }
              })
            }}
            onVerify={async (e, code) => {
              await run(async () => {
                await signIn({ method: 'passwordless-verify', email: e, code })
                afterLogin()
              })
            }}
          />
        )
      case 'social':
        if (!showSocial) return null
        return (
          <SocialButtons
            key="social"
            providers={authConfig.socialProviders}
            showDivider={!isFirst}
            busy={busy}
            onSelect={(provider) => {
              void run(async () => {
                await signIn({ method: 'social', provider })
                afterLogin()
              }).catch(() => {})
            }}
          />
        )
      case 'entra':
        if (!showEntra) return null
        return (
          <EntraButton
            key="entra"
            busy={busy}
            onClick={() => {
              void run(async () => {
                await signIn({ method: 'entra' })
                afterLogin()
              }).catch(() => {})
            }}
          />
        )
    }
  }

  const blocks = ordered
    .map((method, i) => ({ method, node: renderMethod(method, i === 0) }))
    .filter((b) => b.node)

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

      {blocks.map((block, i) => (
        <div key={block.method}>
          {i > 0 && block.method !== 'social' ? <MethodDivider /> : null}
          {block.node}
        </div>
      ))}

      {error ? (
        <p className="mt-4 text-body-sm text-danger-600 dark:text-danger-400">{error}</p>
      ) : null}

      {showRegister ? (
        <div className="mt-8 text-center text-body-sm text-secondary-500 dark:text-secondary-400">
          {t('auth.login.no_account')}{' '}
          <Link
            to="/auth/register"
            className="font-bold text-theme-primary hover:text-theme-primary/80 hover:underline"
          >
            {t('auth.login.create_account')}
          </Link>
        </div>
      ) : null}
    </div>
  )
}
