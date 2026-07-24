import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

interface EntraButtonProps {
  busy?: boolean
  onClick: () => void
}

export function EntraButton({ busy, onClick }: EntraButtonProps) {
  const { t } = useLocale()

  return (
    <Button type="button" fullWidth size="lg" disabled={busy} onClick={onClick}>
      {t('auth.sso.microsoft')}
    </Button>
  )
}
