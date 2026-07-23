import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Icon, Icons } from '@/components/common'
import { Button, Input } from '@/components/ui'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import TaskFormModal from './TaskFormModal'
import TaskDetailModal from './TaskDetailModal'
import { kanbanColumns, type KanbanTask, type KanbanColumn as KanbanColumnType } from '@/data/kanban'
import { useLocale } from '@/i18n'

export default function KanbanPage() {
  const { t } = useLocale()
  const [columns, setColumns] = useState<KanbanColumnType[]>(kanbanColumns)
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')

  // Task Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<KanbanTask | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = findTask(active.id as string)
    setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumnByTaskId(activeId)
    const overColumn = findColumnByTaskId(overId) || findColumnById(overId)

    if (!activeColumn || !overColumn) return

    if (activeColumn.id === overColumn.id) {
      // Reordering within the same column
      const activeIndex = activeColumn.tasks.findIndex((t) => t.id === activeId)
      const overIndex = activeColumn.tasks.findIndex((t) => t.id === overId)

      if (activeIndex !== overIndex) {
        setColumns((cols) =>
          cols.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: arrayMove(col.tasks, activeIndex, overIndex),
              }
            }
            return col
          })
        )
      }
    } else {
      // Moving to a different column
      const activeTask = activeColumn.tasks.find((t) => t.id === activeId)
      if (!activeTask) return

      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== activeId),
            }
          }
          if (col.id === overColumn.id) {
            return {
              ...col,
              tasks: [...col.tasks, activeTask],
            }
          }
          return col
        })
      )
    }
  }

  const findTask = (taskId: string): KanbanTask | null => {
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === taskId)
      if (task) return task
    }
    return null
  }

  const findColumnByTaskId = (taskId: string): KanbanColumnType | null => {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId)) || null
  }

  const findColumnById = (columnId: string): KanbanColumnType | null => {
    return columns.find((col) => col.id === columnId) || null
  }

  const handleAddTask = (columnId: string) => {
    setIsEditMode(false)
    setSelectedTask(null)
    setSelectedColumnId(columnId)
    setIsFormModalOpen(true)
  }

  const handleTaskClick = (task: KanbanTask) => {
    setDetailTask(task)
    setIsDetailModalOpen(true)
  }

  const handleTaskSubmit = (taskData: Partial<KanbanTask>) => {
    if (isEditMode && selectedTask) {
      // Update existing task
      setColumns((cols) =>
        cols.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) => (t.id === selectedTask.id ? { ...t, ...taskData } : t)),
        }))
      )
    } else {
      // Add new task
      const newTask: KanbanTask = {
        id: `task-${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        assignees: taskData.assignees || [],
        tags: taskData.tags || [],
        dueDate: taskData.dueDate,
        comments: 0,
      }

      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === selectedColumnId) {
            return {
              ...col,
              tasks: [...col.tasks, newTask],
            }
          }
          return col
        })
      )
    }

    setIsFormModalOpen(false)
  }

  // Add new column
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: KanbanColumnType = {
        id: `column-${Date.now()}`,
        title: newColumnTitle.trim(),
        color: 'bg-secondary-500',
        tasks: [],
      }
      setColumns([...columns, newColumn])
      setNewColumnTitle('')
      setIsAddingColumn(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900 dark:text-white">{t('kanban.title')}</h1>
          <p className="text-body-sm text-secondary-600 dark:text-secondary-400 mt-1">
            {t('kanban.description')}
          </p>
        </div>
      </div>



      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
            />
          ))}
          
          {/* Add New List */}
          {isAddingColumn ? (
            <div className="flex flex-col w-80 flex-shrink-0">
              <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3">
                <Input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn()
                    if (e.key === 'Escape') {
                      setIsAddingColumn(false)
                      setNewColumnTitle('')
                    }
                  }}
                  placeholder={t('kanban.column_title_placeholder')}
                  autoFocus
                  className="mb-2"
                />
                <div className="flex items-center gap-2">
                  <Button type="button" size="sm" onClick={handleAddColumn}>
                    {t('kanban.add_column')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle('')
                    }}
                    className="px-1.5"
                  >
                    <Icon icon={Icons.x} width="18px" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-80 flex-shrink-0">
              <button
                onClick={() => setIsAddingColumn(true)}
                className="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl p-3 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-900 dark:group-hover:text-white">
                  <Icon icon={Icons.plus} width="18px" />
                  <span className="text-sm font-medium">{t('kanban.add_another_list')}</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <KanbanCard 
                task={activeTask} 
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Form Modal */}
      {isFormModalOpen && (
        <TaskFormModal
          isOpen={isFormModalOpen}
          isEditMode={isEditMode}
          task={selectedTask}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleTaskSubmit}
        />
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        task={detailTask}
        listName={detailTask ? findColumnByTaskId(detailTask.id)?.title : undefined}
        onClose={() => setIsDetailModalOpen(false)}
      />

    </div>
  )
}
