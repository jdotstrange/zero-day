export interface NavSubItem {
  path: string
  label: string
}

export interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  children?: NavSubItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}
