/**
 * Kanban Board Data
 * Mock data for the kanban board module
 */

export interface KanbanTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignees: {
    id: string
    name: string
    avatar: string
  }[]
  tags: string[]
  dueDate?: string
  attachments?: number
  comments?: number
  checklist?: {
    completed: number
    total: number
  }
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  tasks: KanbanTask[]
}

export const kanbanColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-secondary-500',
    tasks: [
      {
        id: 'task-1',
        title: 'Design new landing page',
        description: 'Create mockups for the new landing page redesign',
        priority: 'high',
        assignees: [
          {
            id: '1',
            name: 'John Doe',
            avatar: '/assets/avatars/avatar7.jpg',
          },
          {
            id: '2',
            name: 'Jane Smith',
            avatar: '/assets/avatars/avatar1.jpg',
          },
        ],
        tags: ['design', 'ui/ux'],
        dueDate: '2024-12-15',
        attachments: 3,
        comments: 5,
        checklist: {
          completed: 2,
          total: 5,
        },
      },
      {
        id: 'task-2',
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        priority: 'medium',
        assignees: [
          {
            id: '3',
            name: 'Mike Johnson',
            avatar: '/assets/avatars/avatar2.jpg',
          },
        ],
        tags: ['documentation'],
        dueDate: '2024-12-18',
        comments: 2,
      },
      {
        id: 'task-3',
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated deployment pipeline',
        priority: 'high',
        assignees: [
          {
            id: '4',
            name: 'Sarah Wilson',
            avatar: '/assets/avatars/avatar3.jpg',
          },
        ],
        tags: ['devops', 'automation'],
        dueDate: '2024-12-20',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-info-500',
    tasks: [
      {
        id: 'task-4',
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system',
        priority: 'high',
        assignees: [
          {
            id: '5',
            name: 'Tom Brown',
            avatar: '/assets/avatars/avatar4.jpg',
          },
        ],
        tags: ['backend', 'security'],
        dueDate: '2024-12-14',
        comments: 8,
        checklist: {
          completed: 3,
          total: 6,
        },
      },
      {
        id: 'task-5',
        title: 'Create dashboard charts',
        description: 'Implement analytics charts using Chart.js',
        priority: 'medium',
        assignees: [
          {
            id: '1',
            name: 'John Doe',
            avatar: '/assets/avatars/avatar7.jpg',
          },
        ],
        tags: ['frontend', 'charts'],
        dueDate: '2024-12-16',
        attachments: 2,
        comments: 4,
        checklist: {
          completed: 4,
          total: 7,
        },
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-warning-500',
    tasks: [
      {
        id: 'task-6',
        title: 'Code review - Payment module',
        description: 'Review pull request for payment integration',
        priority: 'high',
        assignees: [
          {
            id: '2',
            name: 'Jane Smith',
            avatar: '/assets/avatars/avatar1.jpg',
          },
          {
            id: '3',
            name: 'Mike Johnson',
            avatar: '/assets/avatars/avatar2.jpg',
          },
        ],
        tags: ['code-review', 'backend'],
        dueDate: '2024-12-13',
        comments: 12,
      },
      {
        id: 'task-7',
        title: 'Test mobile responsiveness',
        description: 'QA testing for mobile devices',
        priority: 'medium',
        assignees: [
          {
            id: '4',
            name: 'Sarah Wilson',
            avatar: '/assets/avatars/avatar3.jpg',
          },
        ],
        tags: ['testing', 'mobile'],
        dueDate: '2024-12-15',
        checklist: {
          completed: 5,
          total: 8,
        },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-success-500',
    tasks: [
      {
        id: 'task-8',
        title: 'Setup project repository',
        description: 'Initialize Git repository and add team members',
        priority: 'low',
        assignees: [
          {
            id: '5',
            name: 'Tom Brown',
            avatar: '/assets/avatars/avatar4.jpg',
          },
        ],
        tags: ['setup'],
        comments: 3,
      },
      {
        id: 'task-9',
        title: 'Create project roadmap',
        description: 'Define project milestones and timeline',
        priority: 'medium',
        assignees: [
          {
            id: '1',
            name: 'John Doe',
            avatar: '/assets/avatars/avatar7.jpg',
          },
          {
            id: '2',
            name: 'Jane Smith',
            avatar: '/assets/avatars/avatar1.jpg',
          },
        ],
        tags: ['planning'],
        attachments: 5,
        comments: 7,
      },
    ],
  },
]

export const priorityColors = {
  low: {
    bg: 'bg-secondary-100 dark:bg-secondary-900/30',
    text: 'text-secondary-700 dark:text-secondary-300',
    dot: 'bg-secondary-500',
  },
  medium: {
    bg: 'bg-warning-100 dark:bg-warning-900/30',
    text: 'text-warning-700 dark:text-warning-300',
    dot: 'bg-warning-500',
  },
  high: {
    bg: 'bg-danger-100 dark:bg-danger-900/30',
    text: 'text-danger-700 dark:text-danger-300',
    dot: 'bg-danger-500',
  },
}
