import { useState, useEffect } from 'react'
import { Icon, Icons } from '@/components/common'
import { Button, FormField, Input, Select, Textarea } from '@/components/ui'
import { type KanbanTask } from '@/data/kanban'
import { useLocale } from '@/i18n'

interface TaskFormModalProps {
  isOpen: boolean
  isEditMode: boolean
  task: KanbanTask | null
  onClose: () => void
  onSubmit: (taskData: Partial<KanbanTask>) => void
}

const emptyFormData = {
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  tags: '',
  dueDate: '',
}

export default function TaskFormModal({ isOpen, isEditMode, task, onClose, onSubmit }: TaskFormModalProps) {
  const { t } = useLocale()
  const [formData, setFormData] = useState(emptyFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (task && isEditMode) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags.join(', '),
        dueDate: task.dueDate || '',
      })
    } else {
      setFormData(emptyFormData)
    }
    setFormErrors({})
  }, [task, isEditMode, isOpen])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = t('kanban.validation.title_required')
    }

    if (!formData.description.trim()) {
      errors.description = t('kanban.validation.description_required')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const taskData: Partial<KanbanTask> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      dueDate: formData.dueDate || undefined,
      assignees: task?.assignees || [],
    }

    onSubmit(taskData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="card relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4 dark:border-surface-700 dark:bg-surface-900">
          <h2 className="heading-4 text-secondary-900 dark:text-white">
            {isEditMode ? t('kanban.edit_task') : t('kanban.new_task')}
          </h2>
          <Button type="button" variant="ghost" size="sm" iconOnly onClick={onClose} aria-label={t('common.close')}>
            <Icon icon={Icons.x} width="20px" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <FormField label={t('kanban.task_title')} required error={formErrors.title}>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                placeholder={t('kanban.task_title_placeholder')}
              />
            </FormField>

            <FormField label={t('kanban.task_description')} required error={formErrors.description}>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!formErrors.description}
                rows={4}
                placeholder={t('kanban.description_placeholder')}
              />
            </FormField>

            <FormField label={t('kanban.priority')}>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">{t('kanban.low')}</option>
                <option value="medium">{t('kanban.medium')}</option>
                <option value="high">{t('kanban.high')}</option>
              </Select>
            </FormField>

            <FormField label={t('kanban.tags')}>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={t('kanban.tags_placeholder')}
              />
            </FormField>

            <FormField label={t('kanban.due_date')}>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="mt-6 flex gap-3 border-t border-surface-200 pt-6 dark:border-surface-700">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" fullWidth>
              {isEditMode ? t('kanban.update_task') : t('kanban.save_task')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
