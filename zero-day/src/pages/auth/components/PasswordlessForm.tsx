import { useState } from 'react'
import { Button, FormField, Input } from '@/components/ui'
import { useLocale } from '@/i18n'
import type { AuthUiConfig } from '@/auth/config'

interface PasswordlessFormProps {
  mode: AuthUiConfig['passwordlessMode']
  busy?: boolean
  onRequest: (email: string) => Promise<void>
  onVerify: (email: string, code: string) => Promise<void>
}

export function PasswordlessForm({ mode, busy, onRequest, onVerify }: PasswordlessFormProps) {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'sent'>('email')

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onRequest(email)
      if (mode === 'otp') {
        setStep('otp')
      } else {
        setStep('sent')
      }
    } catch {
      // Parent surfaces the error
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onVerify(email, code)
    } catch {
      // Parent surfaces the error
    }
  }

  if (step === 'sent') {
    return (
      <div className="space-y-3 rounded-xl border border-surface-200 bg-surface-50 p-4 text-body-sm text-secondary-600 dark:border-surface-700 dark:bg-surface-800/50 dark:text-secondary-300">
        <p className="font-medium text-secondary-900 dark:text-white">
          {t('auth.passwordless.magic_link_sent')}
        </p>
        <p>{t('auth.passwordless.check_email')}</p>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerify} className="space-y-5">
        <FormField label={t('auth.passwordless.code_label')} htmlFor="otp">
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            required
          />
        </FormField>
        <Button type="submit" fullWidth size="lg" disabled={busy || code.length !== 6}>
          {t('auth.passwordless.verify')}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequest} className="space-y-5">
      <FormField label={t('auth.email_address')} htmlFor="passwordless-email">
        <Input
          id="passwordless-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
      </FormField>
      <Button type="submit" fullWidth size="lg" disabled={busy}>
        {mode === 'otp' ? t('auth.passwordless.send_code') : t('auth.passwordless.send_link')}
      </Button>
    </form>
  )
}
