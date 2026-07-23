import { useMemo, useState } from 'react'
import { SearchField } from '@/components/apps'
import { Icon, Icons } from '@/components/common'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Card, FormField, Input, Select } from '@/components/ui'
import { useLocale } from '@/i18n'

type Status = 'Active' | 'Invited' | 'Suspended'

type Row = {
  id: string
  name: string
  email: string
  team: string
  status: Status
  createdAt: string
}

type FormValues = {
  name: string
  email: string
  team: string
  status: Status
}

const tableHeadClass =
  'text-left text-xs font-semibold uppercase tracking-wide text-secondary-500 dark:text-secondary-400'

const cellClass = 'py-3 px-4 text-sm text-secondary-800 dark:text-secondary-200'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const seedRows: Row[] = [
  { id: 'U-2001', name: 'Ava Johnson', email: 'ava@example.com', team: 'Operations', status: 'Active', createdAt: '2025-11-12' },
  { id: 'U-2002', name: 'Noah Smith', email: 'noah@example.com', team: 'Sales', status: 'Active', createdAt: '2025-10-03' },
  { id: 'U-2003', name: 'Mia Chen', email: 'mia@example.com', team: 'Marketing', status: 'Invited', createdAt: '2025-12-01' },
  { id: 'U-2004', name: 'Liam Brown', email: 'liam@example.com', team: 'Support', status: 'Suspended', createdAt: '2025-08-20' },
]

function statusPill(status: Status) {
  if (status === 'Active') {
    return 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-200 dark:border-success-800'
  }
  if (status === 'Invited') {
    return 'bg-surface-50 text-secondary-700 border-surface-200 dark:bg-surface-900/30 dark:text-secondary-200 dark:border-surface-700'
  }
  return 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/20 dark:text-danger-200 dark:border-danger-800'
}

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function makeId() {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : null
  return uuid ? `U-${uuid.slice(0, 4).toUpperCase()}` : `U-${Date.now().toString().slice(-4)}`
}

export function CrudTablePage() {
  const { t } = useLocale()
  const [rows, setRows] = useState<Row[]>(seedRows)
  const [query, setQuery] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    team: '',
    status: 'Active',
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      )
    })
  }, [query, rows])

  const rowToDelete = useMemo(() => {
    if (!deleteId) return null
    return rows.find((r) => r.id === deleteId) ?? null
  }, [deleteId, rows])

  const openCreate = () => {
    setIsEditMode(false)
    setEditingId(null)
    setFormValues({ name: '', email: '', team: '', status: 'Active' })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (row: Row) => {
    setIsEditMode(true)
    setEditingId(row.id)
    setFormValues({ name: row.name, email: row.email, team: row.team, status: row.status })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingId(null)
  }

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {}

    if (!values.name.trim()) errors.name = t('tables.validation.name_required')
    if (!values.email.trim()) errors.email = t('tables.validation.email_required')
    else if (!emailRegex.test(values.email)) errors.email = t('tables.validation.email_invalid')
    if (!values.team.trim()) errors.team = t('tables.validation.team_required')

    return errors
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate(formValues)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    if (isEditMode && editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, name: formValues.name, email: formValues.email, team: formValues.team, status: formValues.status }
            : r,
        ),
      )
      closeModal()
      return
    }

    const newRow: Row = {
      id: makeId(),
      name: formValues.name,
      email: formValues.email,
      team: formValues.team,
      status: formValues.status,
      createdAt: todayISO(),
    }

    setRows((prev) => [newRow, ...prev])
    closeModal()
  }

  const requestDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    setRows((prev) => prev.filter((r) => r.id !== deleteId))
    setIsDeleteOpen(false)
    setDeleteId(null)
  }

  const cancelDelete = () => {
    setIsDeleteOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title={t('tables.crud_table')}
          subtitle={t('tables.crud_table_desc')}
        />

        <Button type="button" onClick={openCreate} className="shrink-0 self-start">
          <Icon icon={Icons.plus} />
          {t('tables.add_row')}
        </Button>
      </div>

      <Card className="rounded-xl p-6">
        <SearchField
          className="max-w-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('tables.search_by_fields')}
        />

        <div className="mt-5 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-900/30">
                <tr>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.id')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.name')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.email')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.team')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.created')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.status')}</th>
                  <th className={`${tableHeadClass} py-3 px-4 text-right`}>{t('tables.column.actions')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-900/20">
                    <td className={cellClass}>{r.id}</td>
                    <td className={cellClass}>
                      <div className="font-medium text-secondary-900 dark:text-white">{r.name}</div>
                    </td>
                    <td className={cellClass}>{r.email}</td>
                    <td className={cellClass}>{r.team}</td>
                    <td className={cellClass}>{r.createdAt}</td>
                    <td className={cellClass}>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusPill(r.status)}`}>
                        {r.status === 'Active'
                          ? t('tables.status.active')
                          : r.status === 'Invited'
                            ? t('tables.status.invited')
                            : t('tables.status.suspended')}
                      </span>
                    </td>
                    <td className={`${cellClass} text-right`}>
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(r)}
                          aria-label={t('tables.aria.edit_row')}
                        >
                          <Icon icon={Icons.edit} width={18} height={18} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => requestDelete(r.id)}
                          className="text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:hover:bg-danger-900/20"
                          aria-label={t('tables.aria.delete_row')}
                        >
                          <Icon icon={Icons.trash} width={18} height={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-secondary-500 dark:text-secondary-400">
                      {t('tables.no_results')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl animate-fade-in dark:bg-surface-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4 dark:border-surface-700 dark:bg-surface-900">
              <h2 className="heading-5 text-secondary-900 dark:text-white">
                {isEditMode ? t('tables.edit_row') : t('tables.add_new_row')}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeModal}
                aria-label={t('common.close')}
              >
                <Icon icon={Icons.x} width={20} height={20} />
              </Button>
            </div>

            <form onSubmit={submitForm} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label={t('tables.field.name')}
                    htmlFor="crud_name"
                    required
                    error={formErrors.name}
                  >
                    <Input
                      id="crud_name"
                      value={formValues.name}
                      onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                      error={!!formErrors.name}
                      placeholder={t('tables.placeholder.name')}
                    />
                  </FormField>

                  <FormField
                    label={t('tables.field.email')}
                    htmlFor="crud_email"
                    required
                    error={formErrors.email}
                  >
                    <Input
                      id="crud_email"
                      type="email"
                      value={formValues.email}
                      onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))}
                      error={!!formErrors.email}
                      placeholder={t('tables.placeholder.email')}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label={t('tables.field.team')}
                    htmlFor="crud_team"
                    required
                    error={formErrors.team}
                  >
                    <Input
                      id="crud_team"
                      value={formValues.team}
                      onChange={(e) => setFormValues((v) => ({ ...v, team: e.target.value }))}
                      error={!!formErrors.team}
                      placeholder={t('tables.placeholder.team')}
                    />
                  </FormField>

                  <FormField label={t('tables.field.status')} htmlFor="crud_status">
                    <Select
                      id="crud_status"
                      value={formValues.status}
                      onChange={(e) => setFormValues((v) => ({ ...v, status: e.target.value as Status }))}
                    >
                      <option value="Active">{t('tables.status.active')}</option>
                      <option value="Invited">{t('tables.status.invited')}</option>
                      <option value="Suspended">{t('tables.status.suspended')}</option>
                    </Select>
                  </FormField>
                </div>
              </div>

              <div className="mt-6 flex gap-3 border-t border-surface-200 pt-6 dark:border-surface-700">
                <Button type="button" variant="secondary" fullWidth onClick={closeModal}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" fullWidth>
                  {isEditMode ? t('common.save') : t('create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && rowToDelete && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in dark:bg-surface-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/30">
              <Icon icon={Icons.alertTriangle} className="h-7 w-7 text-danger-600 dark:text-danger-400" />
            </div>

            <h3 className="heading-5 mb-2 text-center text-secondary-900 dark:text-white">
              {t('tables.delete_row')}
            </h3>

            <p className="mb-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
              {t('tables.delete_confirm_name', { name: rowToDelete.name })}
            </p>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" fullWidth onClick={cancelDelete}>
                {t('common.cancel')}
              </Button>
              <Button type="button" variant="danger" fullWidth onClick={confirmDelete}>
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrudTablePage
