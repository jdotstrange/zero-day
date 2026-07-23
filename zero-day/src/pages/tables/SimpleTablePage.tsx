import { DashboardPageHeader } from '@/components/dashboard'
import { Badge, Card } from '@/components/ui'
import { useLocale } from '@/i18n'

const tableHeadClass =
  'text-left text-xs font-semibold uppercase tracking-wide text-secondary-500 dark:text-secondary-400'

const cellClass = 'py-3 px-4 text-sm text-secondary-800 dark:text-secondary-200'

type Row = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Suspended'
}

const rows: Row[] = [
  { id: 'U-1001', name: 'Ava Johnson', email: 'ava@example.com', role: 'Admin', status: 'Active' },
  { id: 'U-1002', name: 'Noah Smith', email: 'noah@example.com', role: 'Manager', status: 'Active' },
  { id: 'U-1003', name: 'Mia Chen', email: 'mia@example.com', role: 'Editor', status: 'Invited' },
  { id: 'U-1004', name: 'Liam Brown', email: 'liam@example.com', role: 'Viewer', status: 'Suspended' },
  { id: 'U-1005', name: 'Sophia Davis', email: 'sophia@example.com', role: 'Editor', status: 'Active' },
]

function statusVariant(status: Row['status']): 'success' | 'neutral' | 'danger' {
  if (status === 'Active') return 'success'
  if (status === 'Invited') return 'neutral'
  return 'danger'
}

function statusLabel(status: Row['status'], t: (key: string) => string) {
  if (status === 'Active') return t('tables.status.active')
  if (status === 'Invited') return t('tables.status.invited')
  return t('tables.status.suspended')
}

export function SimpleTablePage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('tables.simple_table')}
        subtitle={t('tables.simple_table_desc')}
      />

      <Card className="overflow-hidden rounded-xl p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 dark:bg-surface-900/30">
              <tr>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.id')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.name')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.email')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.role')}</th>
                <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {rows.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-900/20">
                  <td className={cellClass}>{r.id}</td>
                  <td className={cellClass}>
                    <div className="font-medium text-secondary-900 dark:text-white">{r.name}</div>
                  </td>
                  <td className={cellClass}>{r.email}</td>
                  <td className={cellClass}>{r.role}</td>
                  <td className={cellClass}>
                    <Badge variant={statusVariant(r.status)}>{statusLabel(r.status, t)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default SimpleTablePage
