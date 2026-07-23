import { Icon, Icons } from '@/components/common'
import { Button, Checkbox, FormField, Textarea } from '@/components/ui'
import type { KanbanTask } from '@/data/kanban'
import { priorityColors } from '@/data/kanban'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/i18n'

interface TaskDetailModalProps {
  isOpen: boolean
  task: KanbanTask | null
  listName?: string
  onClose: () => void
}

export default function TaskDetailModal({ isOpen, task, listName, onClose }: TaskDetailModalProps) {
  const { t } = useLocale()
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Mock state for interactions (UI purpose only)
  const [description, setDescription] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)

  // Sync description when task changes
  useEffect(() => {
    if (task) {
      setDescription(task.description)
    }
  }, [task])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !task) return null

  const priorityColor = priorityColors[task.priority]

  return (
    <div className="fixed inset-0 z-[1050] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative w-full max-w-4xl bg-surface-50 dark:bg-surface-900 rounded-xl shadow-2xl animate-fade-in flex flex-col md:flex-row overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full"
            aria-label={t('common.close')}
          >
            <Icon icon={Icons.x} width="20px" />
          </Button>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 space-y-8">
            
            {/* Header / Title */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Icon icon={Icons.deviceDesktop} width="24px" className="text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white leading-tight">
                  {task.title}
                </h2>
                <div className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                  <span>
                    {t('kanban.task_detail.in_list')}{' '}
                    <span className="underline decoration-secondary-300 dark:decoration-secondary-600">
                      {listName || t('kanban.task_detail.unknown_list')}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-3 space-y-8">
                
                {/* Meta Data Row (Members, Labels, Priority) */}
                <div className="flex flex-wrap gap-6">
                  
                  {/* Members */}
                  {task.assignees.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        {t('kanban.task_detail.sidebar.members')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {task.assignees.map(member => (
                          <img 
                            key={member.id}
                            src={member.avatar} 
                            alt={member.name}
                            title={member.name}
                            className="w-8 h-8 rounded-full border border-surface-200 dark:border-surface-700 cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                        <button className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-secondary-600 dark:text-secondary-300 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors">
                          <Icon icon={Icons.plus} width="16px" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Labels/Tags */}
                  {task.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        {t('kanban.task_detail.sidebar.labels')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-theme-primary/10 dark:bg-theme-primary/20 text-theme-primary rounded text-sm font-medium hover:bg-theme-primary/20 dark:hover:bg-theme-primary/30 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                        <button className="w-8 h-8 rounded bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-secondary-600 dark:text-secondary-300 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors">
                          <Icon icon={Icons.plus} width="16px" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Priority */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      {t('kanban.priority')}
                    </h3>
                    <div className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-2 ${priorityColor.bg} ${priorityColor.text}`}>
                      <span className={`w-2 h-2 rounded-full ${priorityColor.dot}`} />
                      <span className="capitalize">{task.priority}</span>
                      <Icon icon={Icons.chevronDown} width="14px" className="opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Icon icon={Icons.textAlignLeft} width="24px" className="text-secondary-600 dark:text-secondary-400" />
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('kanban.task_description')}</h3>
                    {!isEditingDesc && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditingDesc(true)}
                      >
                        {t('common.edit')}
                      </Button>
                    )}
                  </div>
                  
                  <div className="pl-10">
                    {isEditingDesc ? (
                      <div className="space-y-2">
                        <FormField label={t('kanban.task_description')}>
                          <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[120px]"
                            placeholder={t('kanban.task_detail.description_placeholder')}
                            autoFocus
                          />
                        </FormField>
                        <div className="flex items-center gap-2">
                          <Button type="button" size="sm" onClick={() => setIsEditingDesc(false)}>
                            {t('common.save')}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setDescription(task.description)
                              setIsEditingDesc(false)
                            }}
                          >
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsEditingDesc(true)}
                        className={`cursor-pointer text-sm leading-relaxed ${description ? 'text-secondary-700 dark:text-secondary-300' : 'p-4 bg-surface-100 dark:bg-surface-800 rounded min-h-[60px] text-secondary-500 italic hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors'}`}
                      >
                        {description || t('kanban.task_detail.description_placeholder')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Checklist Section (Mock) */}
                {task.checklist && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Icon icon={Icons.circleCheck} width="24px" className="text-secondary-600 dark:text-secondary-400" />
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('kanban.task_detail.checklist')}</h3>
                      </div>
                      <Button type="button" variant="secondary" size="sm">
                        {t('kanban.task_detail.hide_completed')}
                      </Button>
                    </div>
                    
                    <div className="pl-10 space-y-3">
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs text-secondary-500 dark:text-secondary-400 w-8 text-right">
                          {Math.round((task.checklist.completed / task.checklist.total) * 100)}%
                        </span>
                        <div className="flex-1 h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-theme-primary rounded-full transition-all duration-500"
                            style={{ width: `${(task.checklist.completed / task.checklist.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklist Items */}
                      <div className="space-y-2">
                        {Array.from({ length: task.checklist.total }).map((_, i) => (
                          <div key={i} className="flex items-start gap-3 group">
                            <Checkbox
                              checked={i < task.checklist!.completed}
                              readOnly
                              className="mt-1 cursor-pointer"
                            />
                            <span className={`text-sm ${i < task.checklist!.completed ? 'text-secondary-400 line-through' : 'text-secondary-700 dark:text-secondary-300'}`}>
                              {i === 0 && "Review requirements"}
                              {i === 1 && "Create wireframes"}
                              {i === 2 && "Draft initial concept"}
                              {i > 2 && "Review with team"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity / Comments */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon icon={Icons.list} width="24px" className="text-secondary-600 dark:text-secondary-400" />
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('kanban.task_detail.activity')}</h3>
                    </div>
                    <Button type="button" variant="secondary" size="sm">
                      {t('kanban.task_detail.show_details')}
                    </Button>
                  </div>

                  <div className="pl-10 space-y-6">
                    {/* Comment Input */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-theme-primary/10 dark:bg-theme-primary/20 items-center justify-center flex text-theme-primary font-bold text-xs">
                        ME
                      </div>
                      <div className="flex-1 space-y-2">
                        <FormField>
                          <Textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={t('kanban.task_detail.write_comment_placeholder')}
                            rows={commentText ? 3 : 1}
                            className="min-h-[40px]"
                          />
                          {commentText && (
                            <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="ghost" size="sm" className="p-1">
                                  <Icon icon={Icons.paperclip} width="16px" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="p-1">
                                  <Icon icon={Icons.image} width="16px" />
                                </Button>
                              </div>
                              <Button type="button" size="sm">
                                {t('common.save')}
                              </Button>
                            </div>
                          )}
                        </FormField>
                      </div>
                    </div>

                    {/* Mocked History/Activity */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 flex-shrink-0 rounded-full bg-info-100 dark:bg-info-900/30 flex items-center justify-center text-info-700 dark:text-info-300 font-bold text-xs uppercase">
                            JS
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm text-secondary-900 dark:text-white">
                              <span className="font-semibold">Jane Smith</span> added this card to <span className="font-medium underline decoration-secondary-300">To Do</span>
                            </p>
                            <p className="text-xs text-secondary-500">Jan 12 at 10:30 PM</p>
                         </div>
                      </div>
                      
                      {task.comments && task.comments > 0 && (
                         <div className="flex gap-3">
                          <img src="/assets/avatars/avatar3.jpg" className="w-8 h-8 flex-shrink-0 rounded-full border border-surface-200 dark:border-surface-700" alt="Sarah Wilson" />
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <span className="font-semibold text-sm text-secondary-900 dark:text-white">Sarah Wilson</span>
                               <span className="text-xs text-secondary-500">Yesterday at 9:41 AM</span>
                             </div>
                             <div className="p-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-secondary-700 dark:text-secondary-300">
                                Can we prioritize the mobile view first? It seems 70% of our traffic is mobile.
                             </div>
                             <div className="flex items-center gap-3">
                               <button className="text-xs text-secondary-500 hover:underline">{t('kanban.task_detail.reply')}</button>
                               <button className="text-xs text-secondary-500 hover:underline">{t('common.edit')}</button>
                             </div>
                          </div>
                       </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column - Sidebar Actions */}
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">{t('kanban.task_detail.add_to_card')}</h4>
                  <SidebarButton icon={Icons.user} label={t('kanban.task_detail.sidebar.members')} />
                  <SidebarButton icon={Icons.tag} label={t('kanban.task_detail.sidebar.labels')} />
                  <SidebarButton icon={Icons.circleCheck} label={t('kanban.task_detail.sidebar.checklist')} />
                  <SidebarButton icon={Icons.calendar} label={t('kanban.task_detail.sidebar.dates')} />
                  <SidebarButton icon={Icons.paperclip} label={t('kanban.task_detail.sidebar.attachment')} />
                  <SidebarButton icon={Icons.image} label={t('kanban.task_detail.sidebar.cover')} />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">{t('common.actions')}</h4>
                  <SidebarButton icon={Icons.arrowRight} label={t('kanban.task_detail.sidebar.move')} />
                  <SidebarButton icon={'solar:copy-linear'} label={t('kanban.task_detail.sidebar.copy')} />
                  <SidebarButton icon={Icons.archive} label={t('kanban.task_detail.sidebar.archive')} />
                  <SidebarButton icon={Icons.share} label={t('kanban.task_detail.sidebar.share')} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarButton({ icon, label }: { icon: string, label: string }) {
  return (
    <Button type="button" variant="secondary" size="sm" fullWidth className="justify-start">
      <Icon icon={icon} width="14px" />
      <span>{label}</span>
    </Button>
  )
}
