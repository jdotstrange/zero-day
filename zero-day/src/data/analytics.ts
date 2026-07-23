export interface TopPage {
  path: string
  title: string
  views: number
  unique: number
  avgTime: string
  bounce: string
}

export interface BrowserStat {
  name: string
  value: number
  color: string
}

export interface CountryStat {
  flag: string
  name: string
  sessions: string
  percentage: number
}

export const topPages: TopPage[] = [
  { path: '/', title: 'Homepage', views: 45280, unique: 32450, avgTime: '2:45', bounce: '28%' },
  { path: '/products', title: 'Products', views: 32150, unique: 24320, avgTime: '3:12', bounce: '34%' },
  { path: '/blog/getting-started', title: 'Getting Started Guide', views: 24890, unique: 18420, avgTime: '4:32', bounce: '22%' },
  { path: '/pricing', title: 'Pricing', views: 18420, unique: 14280, avgTime: '1:58', bounce: '45%' },
  { path: '/about', title: 'About Us', views: 12350, unique: 9840, avgTime: '1:24', bounce: '52%' },
  { path: '/contact', title: 'Contact', views: 8920, unique: 7120, avgTime: '1:12', bounce: '38%' },
]

export const browserStats: BrowserStat[] = [
  { name: 'Chrome', value: 64.2, color: '#4285F4' },
  { name: 'Safari', value: 18.5, color: '#006CFF' },
  { name: 'Firefox', value: 10.1, color: '#FF7139' },
  { name: 'Edge', value: 7.2, color: '#0078D7' },
]

export const countries: CountryStat[] = [
  { flag: '🇺🇸', name: 'United States', sessions: '32,450', percentage: 42 },
  { flag: '🇬🇧', name: 'United Kingdom', sessions: '12,830', percentage: 18 },
  { flag: '🇩🇪', name: 'Germany', sessions: '8,540', percentage: 12 },
  { flag: '🇫🇷', name: 'France', sessions: '6,210', percentage: 8 },
  { flag: '🇨🇦', name: 'Canada', sessions: '4,890', percentage: 6 },
]
