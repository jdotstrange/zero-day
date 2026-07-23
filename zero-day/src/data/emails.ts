export interface Email {
  id: number
  from: {
    name: string
    email: string
    avatar: string
  }
  to: string
  subject: string
  preview: string
  body: string
  date: string
  time: string
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
  labels: string[]
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'
}

export interface EmailFolder {
  id: string
  label: string
  icon: string
  count: number
}

export interface EmailLabel {
  id: string
  label: string
  color: string
}

// Mock email data
export const emailsData: Email[] = [
  {
    id: 1,
    from: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', avatar: '/assets/avatars/avatar1.jpg' },
    to: 'me@company.com',
    subject: 'Q4 Marketing Strategy Review',
    preview: 'Hi team, I wanted to share the updated marketing strategy for Q4. Please review the attached document and...',
    body: `<p>Hi team,</p>
<p>I wanted to share the updated marketing strategy for Q4. Please review the attached document and let me know your thoughts by end of day Friday.</p>
<p>Key highlights:</p>
<ul>
<li>Increased social media budget by 20%</li>
<li>New influencer partnership program</li>
<li>Email automation improvements</li>
</ul>
<p>Looking forward to your feedback!</p>
<p>Best,<br/>Sarah</p>`,
    date: 'Nov 30',
    time: '10:30 AM',
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    labels: ['work', 'important'],
    folder: 'inbox',
  },
  {
    id: 2,
    from: { name: 'Michael Chen', email: 'michael.chen@techstartup.io', avatar: '/assets/avatars/avatar2.jpg' },
    to: 'me@company.com',
    subject: 'Re: Project Timeline Update',
    preview: 'Thanks for the update. I think we should push the deadline by one week to ensure quality...',
    body: `<p>Thanks for the update.</p>
<p>I think we should push the deadline by one week to ensure quality. The current timeline is too aggressive given the scope changes we discussed yesterday.</p>
<p>Can we schedule a call to discuss?</p>
<p>Thanks,<br/>Michael</p>`,
    date: 'Nov 30',
    time: '9:15 AM',
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    labels: ['work'],
    folder: 'inbox',
  },
  {
    id: 3,
    from: { name: 'Emily Rodriguez', email: 'emily.r@design.co', avatar: '/assets/avatars/avatar3.jpg' },
    to: 'me@company.com',
    subject: 'New Design Mockups Ready',
    preview: 'Hey! The new dashboard mockups are ready for review. I\'ve uploaded them to Figma...',
    body: `<p>Hey!</p>
<p>The new dashboard mockups are ready for review. I've uploaded them to Figma and shared access with the team.</p>
<p>Let me know if you need any revisions!</p>
<p>Cheers,<br/>Emily</p>`,
    date: 'Nov 29',
    time: '4:45 PM',
    isRead: true,
    isStarred: true,
    hasAttachment: true,
    labels: ['design'],
    folder: 'inbox',
  },
  {
    id: 4,
    from: { name: 'LinkedIn', email: 'notifications@linkedin.com', avatar: '/assets/avatars/avatar9.jpg' },
    to: 'me@company.com',
    subject: 'You have 5 new connection requests',
    preview: 'John Smith and 4 others want to connect with you on LinkedIn...',
    body: `<p>You have 5 new connection requests waiting for you.</p>
<p>Click below to view and accept these requests.</p>`,
    date: 'Nov 29',
    time: '2:30 PM',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    labels: ['social'],
    folder: 'inbox',
  },
  {
    id: 5,
    from: { name: 'David Kim', email: 'david.kim@analytics.com', avatar: '/assets/avatars/avatar4.jpg' },
    to: 'me@company.com',
    subject: 'Weekly Analytics Report',
    preview: 'Here\'s this week\'s performance summary. Overall traffic is up 15% compared to last week...',
    body: `<p>Hi,</p>
<p>Here's this week's performance summary:</p>
<ul>
<li>Overall traffic: Up 15%</li>
<li>Conversion rate: 3.2% (+0.5%)</li>
<li>Revenue: $45,230 (+12%)</li>
</ul>
<p>Full report attached.</p>
<p>Best,<br/>David</p>`,
    date: 'Nov 28',
    time: '11:00 AM',
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    labels: ['work', 'reports'],
    folder: 'inbox',
  },
  {
    id: 6,
    from: { name: 'Amanda Foster', email: 'amanda.foster@hr.company.com', avatar: '/assets/avatars/avatar5.jpg' },
    to: 'me@company.com',
    subject: 'Team Building Event - RSVP Required',
    preview: 'Don\'t forget to RSVP for our upcoming team building event next Friday...',
    body: `<p>Hi everyone,</p>
<p>Don't forget to RSVP for our upcoming team building event next Friday at 3 PM.</p>
<p>We'll be doing a fun escape room challenge followed by dinner!</p>
<p>Please respond by Wednesday.</p>
<p>Thanks,<br/>Amanda</p>`,
    date: 'Nov 27',
    time: '3:20 PM',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    labels: ['personal'],
    folder: 'inbox',
  },
  {
    id: 7,
    from: { name: 'Me', email: 'me@company.com', avatar: '/assets/avatars/avatar7.jpg' },
    to: 'team@company.com',
    subject: 'Project Update - Week 48',
    preview: 'Hi team, here\'s our weekly project update with current progress and next steps...',
    body: `<p>Hi team,</p>
<p>Here's our weekly project update:</p>
<p><strong>Completed:</strong></p>
<ul>
<li>User authentication module</li>
<li>Dashboard redesign</li>
</ul>
<p><strong>In Progress:</strong></p>
<ul>
<li>Email integration</li>
<li>Report generation</li>
</ul>
<p>Let me know if you have questions.</p>`,
    date: 'Nov 26',
    time: '5:00 PM',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    labels: ['work'],
    folder: 'sent',
  },
]

// Email labels configuration
export const emailLabels: EmailLabel[] = [
  { id: 'work', label: 'Work', color: 'bg-primary-500' },
  { id: 'personal', label: 'Personal', color: 'bg-success-500' },
  { id: 'important', label: 'Important', color: 'bg-danger-500' },
  { id: 'design', label: 'Design', color: 'bg-purple-500' },
  { id: 'social', label: 'Social', color: 'bg-info-500' },
  { id: 'reports', label: 'Reports', color: 'bg-warning-500' },
]
