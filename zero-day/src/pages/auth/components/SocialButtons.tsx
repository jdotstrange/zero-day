import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

type SocialProvider = 'google' | 'apple' | 'github'

interface SocialButtonsProps {
  providers: SocialProvider[]
  showDivider?: boolean
  busy?: boolean
  onSelect: (provider: SocialProvider) => void
}

const LABEL_KEY: Record<SocialProvider, string> = {
  google: 'auth.social.google',
  apple: 'auth.social.apple',
  github: 'auth.social.github',
}

export function SocialButtons({ providers, showDivider = true, busy, onSelect }: SocialButtonsProps) {
  const { t } = useLocale()

  if (providers.length === 0) return null

  return (
    <div className="space-y-3">
      {showDivider ? (
        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
          <span className="text-body-sm text-secondary-500 dark:text-secondary-400">
            {t('auth.login.or_continue_with')}
          </span>
          <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            fullWidth
            size="lg"
            disabled={busy}
            onClick={() => onSelect(provider)}
          >
            {t(LABEL_KEY[provider])}
          </Button>
        ))}
      </div>
    </div>
  )
}
