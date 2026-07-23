export interface PipelineDeal {
  company: string
  value: string
  contact: string
  days: number
}

export interface PipelineStage {
  stage: string
  color: string
  headerBg: string
  deals: PipelineDeal[]
}

export interface CRMContact {
  name: string
  role: string
  company: string
  avatar: string
  status: 'hot' | 'warm' | 'new'
  email: string
}

export interface Activity {
  type: 'call' | 'email' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  done: boolean
}

export const pipeline: PipelineStage[] = [
  {
    stage: 'Qualified',
    color: 'bg-blue-500',
    headerBg: 'bg-blue-50 dark:bg-blue-900/20',
    deals: [
      { company: 'Acme Corp', value: '$45,000', contact: 'John Doe', days: 12 },
      { company: 'Tech Ltd', value: '$28,000', contact: 'Jane Smith', days: 8 },
      { company: 'StartUp Inc', value: '$18,000', contact: 'Mike Lee', days: 5 },
    ],
  },
  {
    stage: 'Proposal',
    color: 'bg-purple-500',
    headerBg: 'bg-purple-50 dark:bg-purple-900/20',
    deals: [
      { company: 'Global Inc', value: '$65,000', contact: 'Sarah Chen', days: 18 },
      { company: 'Data Systems', value: '$32,000', contact: 'Tom Brown', days: 14 },
    ],
  },
  {
    stage: 'Negotiation',
    color: 'bg-orange-500',
    headerBg: 'bg-orange-50 dark:bg-orange-900/20',
    deals: [
      { company: 'Enterprise Co', value: '$125,000', contact: 'Lisa Wong', days: 25 },
      { company: 'Cloud Nine', value: '$87,000', contact: 'Alex Kim', days: 20 },
    ],
  },
  {
    stage: 'Closed Won',
    color: 'bg-green-500',
    headerBg: 'bg-green-50 dark:bg-green-900/20',
    deals: [
      { company: 'Success Ltd', value: '$95,000', contact: 'Emma Davis', days: 32 },
      { company: 'Winner Corp', value: '$78,000', contact: 'David Park', days: 28 },
    ],
  },
]

export const crmContacts: CRMContact[] = [
  { name: 'Sarah Johnson', role: 'CEO', company: 'Tech Solutions', avatar: 'SJ', status: 'hot', email: 'sarah@tech.com' },
  { name: 'Michael Chen', role: 'CTO', company: 'Digital Agency', avatar: 'MC', status: 'warm', email: 'mike@digital.com' },
  { name: 'Emily Rodriguez', role: 'VP Sales', company: 'Enterprise Corp', avatar: 'ER', status: 'new', email: 'emily@enterprise.com' },
]

export const activities: Activity[] = [
  { type: 'call', title: 'Call with Acme Corp', description: 'Discuss Q4 budget allocation', time: '10:00 AM', done: true },
  { type: 'email', title: 'Follow up proposal', description: 'Send revised pricing to Global Inc', time: '11:30 AM', done: true },
  { type: 'meeting', title: 'Product demo', description: 'Demo for Enterprise Co team', time: '2:00 PM', done: false },
  { type: 'task', title: 'Prepare quarterly report', description: 'Q3 sales performance review', time: '4:00 PM', done: false },
  { type: 'call', title: 'Contract negotiation', description: 'Final terms with Cloud Nine', time: '5:30 PM', done: false },
]
