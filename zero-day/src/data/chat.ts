/**
 * Chat Mock Data
 * Sample data for the chat application
 */

export interface ChatUser {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen?: string
  role?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'read'
  attachments?: {
    name: string
    url: string
    type: string
    size: string
  }[]
}

export interface ChatConversation {
  id: string
  participants: ChatUser[]
  lastMessage: ChatMessage
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
}

// Current logged in user
export const currentUser: ChatUser = {
  id: 'current-user',
  name: 'John Doe',
  avatar: '/assets/avatars/avatar7.jpg',
  status: 'online',
  role: 'Admin'
}

// Chat users
export const chatUsers: ChatUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Wilson',
    avatar: '/assets/avatars/avatar1.jpg',
    status: 'online',
    role: 'Designer'
  },
  {
    id: 'user-2',
    name: 'Mike Johnson',
    avatar: '/assets/avatars/avatar2.jpg',
    status: 'online',
    role: 'Developer'
  },
  {
    id: 'user-3',
    name: 'Emily Davis',
    avatar: '/assets/avatars/avatar3.jpg',
    status: 'away',
    lastSeen: '10 min ago',
    role: 'Product Manager'
  },
  {
    id: 'user-4',
    name: 'Alex Thompson',
    avatar: '/assets/avatars/avatar4.jpg',
    status: 'busy',
    role: 'Tech Lead'
  },
  {
    id: 'user-5',
    name: 'Jessica Brown',
    avatar: '/assets/avatars/avatar5.jpg',
    status: 'offline',
    lastSeen: '2 hours ago',
    role: 'Marketing'
  },
  {
    id: 'user-6',
    name: 'David Lee',
    avatar: '/assets/avatars/avatar6.jpg',
    status: 'online',
    role: 'DevOps'
  },
  {
    id: 'user-7',
    name: 'Rachel Green',
    avatar: '/assets/avatars/avatar7.jpg',
    status: 'offline',
    lastSeen: 'Yesterday',
    role: 'HR Manager'
  }
]

// Chat messages grouped by conversation
export const chatMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      senderId: 'user-1',
      content: 'Hey! Have you seen the new design mockups?',
      timestamp: '2025-11-30T09:00:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'current-user',
      content: 'Yes, I just reviewed them. They look amazing! 🎨',
      timestamp: '2025-11-30T09:02:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      content: 'Great! I made some updates to the dashboard layout. Can you check if the spacing looks right?',
      timestamp: '2025-11-30T09:05:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-4',
      senderId: 'current-user',
      content: 'Sure, I\'ll take a look right now.',
      timestamp: '2025-11-30T09:06:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-5',
      senderId: 'user-1',
      content: 'Here\'s the updated file',
      timestamp: '2025-11-30T09:10:00',
      type: 'file',
      status: 'read',
      attachments: [
        {
          name: 'dashboard-v2.fig',
          url: '#',
          type: 'figma',
          size: '2.4 MB'
        }
      ]
    },
    {
      id: 'msg-6',
      senderId: 'current-user',
      content: 'The spacing looks perfect now. I love the new sidebar design too!',
      timestamp: '2025-11-30T09:15:00',
      type: 'text',
      status: 'delivered'
    }
  ],
  'conv-2': [
    {
      id: 'msg-7',
      senderId: 'user-2',
      content: 'The API integration is complete. Ready for testing.',
      timestamp: '2025-11-30T08:30:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-8',
      senderId: 'current-user',
      content: 'Awesome! I\'ll start testing right away. Any specific endpoints I should focus on?',
      timestamp: '2025-11-30T08:35:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-9',
      senderId: 'user-2',
      content: 'Start with the user authentication and then move to the dashboard data endpoints.',
      timestamp: '2025-11-30T08:40:00',
      type: 'text',
      status: 'read'
    }
  ],
  'conv-3': [
    {
      id: 'msg-10',
      senderId: 'user-3',
      content: 'Can we schedule a meeting for the sprint planning?',
      timestamp: '2025-11-29T16:00:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-11',
      senderId: 'current-user',
      content: 'Sure! How about tomorrow at 10 AM?',
      timestamp: '2025-11-29T16:05:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-12',
      senderId: 'user-3',
      content: 'Perfect! I\'ll send out the calendar invite.',
      timestamp: '2025-11-29T16:10:00',
      type: 'text',
      status: 'read'
    }
  ],
  'conv-4': [
    {
      id: 'msg-13',
      senderId: 'user-4',
      content: 'We need to discuss the architecture for the new feature.',
      timestamp: '2025-11-29T14:00:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-14',
      senderId: 'current-user',
      content: 'I\'ve been thinking about using a microservices approach. What do you think?',
      timestamp: '2025-11-29T14:10:00',
      type: 'text',
      status: 'read'
    }
  ],
  'conv-group-1': [
    {
      id: 'msg-15',
      senderId: 'user-1',
      content: 'Team, I\'ve pushed the latest designs to Figma.',
      timestamp: '2025-11-30T10:00:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-16',
      senderId: 'user-2',
      content: 'Looking good! I\'ll start implementing the frontend.',
      timestamp: '2025-11-30T10:05:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-17',
      senderId: 'user-4',
      content: 'Great progress everyone! Let\'s aim to have the MVP ready by Friday.',
      timestamp: '2025-11-30T10:10:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-18',
      senderId: 'current-user',
      content: 'I\'ll handle the API integrations. Should be done by Wednesday.',
      timestamp: '2025-11-30T10:15:00',
      type: 'text',
      status: 'delivered'
    }
  ]
}

// Chat conversations
export const chatConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    participants: [chatUsers[0]],
    lastMessage: chatMessages['conv-1'][5],
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 'conv-2',
    participants: [chatUsers[1]],
    lastMessage: chatMessages['conv-2'][2],
    unreadCount: 2,
    isGroup: false
  },
  {
    id: 'conv-3',
    participants: [chatUsers[2]],
    lastMessage: chatMessages['conv-3'][2],
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 'conv-4',
    participants: [chatUsers[3]],
    lastMessage: chatMessages['conv-4'][1],
    unreadCount: 1,
    isGroup: false
  },
  {
    id: 'conv-group-1',
    participants: [chatUsers[0], chatUsers[1], chatUsers[3]],
    lastMessage: chatMessages['conv-group-1'][3],
    unreadCount: 3,
    isGroup: true,
    groupName: 'Project Alpha Team',
    groupAvatar: '/assets/avatars/avatar8.jpg'
  }
]

// Status colors
export const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-secondary-400',
  away: 'bg-warning-500',
  busy: 'bg-danger-500'
}
