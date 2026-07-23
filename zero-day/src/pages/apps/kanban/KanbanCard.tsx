import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon, Icons } from '@/components/common'
import { type KanbanTask, priorityColors } from '@/data/kanban'
import { useLocale } from '@/i18n'

interface KanbanCardProps {
  task: KanbanTask
  onClick: () => void
}

export default function KanbanCard({ task, onClick }: KanbanCardProps) {
  const { t, locale } = useLocale()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const priorityColor = priorityColors[task.priority]
  const priorityLabel = t(`kanban.${task.priority}`)

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: t('kanban.overdue_days', { days: Math.abs(diffDays) }), className: 'text-danger-600' }
    } else if (diffDays === 0) {
      return { text: t('kanban.today'), className: 'text-warning-600' }
    } else if (diffDays === 1) {
      return { text: t('kanban.tomorrow'), className: 'text-info-600' }
    } else if (diffDays <= 7) {
      return { text: t('kanban.days_left', { days: diffDays }), className: 'text-secondary-600 dark:text-secondary-400' }
    }
    return {
      text: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date),
      className: 'text-secondary-600 dark:text-secondary-400',
    }
  }

  const dueDate = formatDate(task.dueDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="card group relative rounded-lg p-3 transition-colors hover:border-surface-300 dark:hover:border-surface-600"
    >
      {/* Priority */}
      <div className="flex items-start justify-end mb-2">
        <div className={`px-2 py-0.5 rounded-full text-ui-xs font-medium ${priorityColor.bg} ${priorityColor.text} flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityColor.dot}`} />
          {priorityLabel}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-medium text-secondary-900 dark:text-white mb-1 line-clamp-2">
        {task.title}
      </h3>
      <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-surface-100 dark:bg-surface-700 text-secondary-600 dark:text-secondary-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Checklist Progress */}
      {task.checklist && (
        <div className="mb-2">
          <div className="flex items-center gap-1 text-xs text-secondary-600 dark:text-secondary-400 mb-1">
            <Icon icon={Icons.checklist} width="12px" />
            <span>
              {task.checklist.completed}/{task.checklist.total}
            </span>
          </div>
          <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-1">
            <div
              className="bg-theme-primary rounded-full h-1 transition-all"
              style={{
                width: `${(task.checklist.completed / task.checklist.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-2">
        <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 flex-wrap">
          {dueDate && (
            <div className={`flex items-center gap-1 ${dueDate.className}`}>
              <Icon icon={Icons.calendar} width="13px" />
              <span className="text-ui-xs">{dueDate.text}</span>
            </div>
          )}
          {task.attachments && (
            <div className="flex items-center gap-1">
              <Icon icon={Icons.paperclip} width="13px" />
              <span className="text-ui-xs">{task.attachments}</span>
            </div>
          )}
          {task.comments && (
            <div className="flex items-center gap-1">
              <Icon icon={Icons.message} width="13px" />
              <span className="text-ui-xs">{task.comments}</span>
            </div>
          )}
        </div>

        {/* Actions - show on hover */}
        <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          
        </div>
      </div>

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <div className="flex items-center -space-x-1 mt-2">
          {task.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-surface-800"
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 border-2 border-white dark:border-surface-800 flex items-center justify-center text-ui-2xs font-medium text-secondary-600 dark:text-secondary-400">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
