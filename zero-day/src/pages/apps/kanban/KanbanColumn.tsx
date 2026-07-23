import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Icon, Icons } from '@/components/common'
import KanbanCard from './KanbanCard'
import { type KanbanColumn as KanbanColumnType, type KanbanTask } from '@/data/kanban'
import { useLocale } from '@/i18n'

interface KanbanColumnProps {
  column: KanbanColumnType
  onAddTask: (columnId: string) => void
  onTaskClick: (task: KanbanTask) => void
}

export default function KanbanColumn({
  column,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { t } = useLocale()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-surface-100 dark:bg-surface-800 rounded-xl p-3">
      {/* Column Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {column.title}
          </h2>
          <span className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded text-secondary-500 hover:text-secondary-900 dark:hover:text-white transition-colors"
          title={t('kanban.add_task')}
        >
          <Icon icon={Icons.plus} width="16px" />
        </button>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg p-1 min-h-[200px] space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] transition-colors ${
          isOver ? 'bg-theme-primary/10 border-2 border-dashed border-theme-primary' : ''
        }`}
      >
        <SortableContext items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-32 text-secondary-400 text-xs">
            {t('kanban.drop_tasks_here')}
          </div>
        )}
        
        {isOver && column.tasks.length > 0 && (
          <div className="h-20 border-2 border-dashed border-theme-primary rounded-lg bg-theme-primary/5 flex items-center justify-center">
            <span className="text-xs text-theme-primary font-medium">{t('kanban.drop_here')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
