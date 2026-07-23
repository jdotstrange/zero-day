export interface Note {
  id: string
  title: string
  content: string
  category: string
  color: string
  isPinned: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export const noteCategories = [
  'All',
  'Personal',
  'Work',
  'Ideas',
  'Todo',
  'Important',
]

export const noteColors = [
  { name: 'Default', value: 'default', bg: 'bg-white dark:bg-surface-900', border: 'border-surface-200 dark:border-surface-700' },
  { name: 'Red', value: 'red', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { name: 'Green', value: 'green', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800' },
]

export const notesData: Note[] = [
  {
    id: '1',
    title: 'Project Ideas',
    content: 'Build a new dashboard template with modern design patterns. Focus on clean UI, smooth animations, and excellent user experience.',
    category: 'Ideas',
    color: 'blue',
    isPinned: true,
    tags: ['project', 'development', 'ui'],
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discussed Q4 goals and objectives. Team alignment on priorities. Action items: Review budget, Update roadmap, Schedule follow-up.',
    category: 'Work',
    color: 'yellow',
    isPinned: true,
    tags: ['meeting', 'goals', 'q4'],
    createdAt: '2024-12-02T14:30:00Z',
    updatedAt: '2024-12-02T14:30:00Z',
  },
  {
    id: '3',
    title: 'Shopping List',
    content: 'Groceries:\n- Milk\n- Eggs\n- Bread\n- Fresh vegetables\n- Coffee beans\n- Pasta',
    category: 'Personal',
    color: 'green',
    isPinned: false,
    tags: ['shopping', 'groceries'],
    createdAt: '2024-12-03T09:15:00Z',
    updatedAt: '2024-12-03T09:15:00Z',
  },
  {
    id: '4',
    title: 'Code Snippets',
    content: 'Useful React hooks and patterns to remember:\n- useCallback for memoization\n- useMemo for expensive computations\n- Custom hooks for reusable logic',
    category: 'Work',
    color: 'purple',
    isPinned: false,
    tags: ['code', 'react', 'snippets'],
    createdAt: '2024-12-04T11:20:00Z',
    updatedAt: '2024-12-04T11:20:00Z',
  },
  {
    id: '5',
    title: 'Book Recommendations',
    content: 'Must read books:\n1. Clean Code by Robert Martin\n2. The Pragmatic Programmer\n3. Design Patterns\n4. Atomic Habits',
    category: 'Personal',
    color: 'red',
    isPinned: false,
    tags: ['books', 'reading', 'learning'],
    createdAt: '2024-12-05T16:45:00Z',
    updatedAt: '2024-12-05T16:45:00Z',
  },
  {
    id: '6',
    title: 'Important Dates',
    content: 'Dec 15 - Project deadline\nDec 20 - Team meeting\nDec 25 - Holiday\nJan 1 - New Year planning',
    category: 'Important',
    color: 'orange',
    isPinned: true,
    tags: ['dates', 'calendar', 'reminders'],
    createdAt: '2024-12-06T08:00:00Z',
    updatedAt: '2024-12-06T08:00:00Z',
  },
  {
    id: '7',
    title: 'Workout Plan',
    content: 'Weekly routine:\nMon - Chest & Triceps\nTue - Back & Biceps\nWed - Rest\nThu - Legs\nFri - Shoulders\nSat - Cardio\nSun - Rest',
    category: 'Personal',
    color: 'green',
    isPinned: false,
    tags: ['fitness', 'health', 'routine'],
    createdAt: '2024-12-07T07:00:00Z',
    updatedAt: '2024-12-07T07:00:00Z',
  },
  {
    id: '8',
    title: 'API Endpoints',
    content: 'New API routes to implement:\n/api/users - User management\n/api/products - Product CRUD\n/api/orders - Order processing\n/api/analytics - Data insights',
    category: 'Work',
    color: 'blue',
    isPinned: false,
    tags: ['api', 'backend', 'development'],
    createdAt: '2024-12-08T13:30:00Z',
    updatedAt: '2024-12-08T13:30:00Z',
  },
]
