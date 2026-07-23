/**
 * Semantic CSS class map for UI primitives.
 * React components in Phase 2 will wrap these classes.
 */
export const ui = {
  card: 'card',
  input: 'input',
  select: 'select',
  textarea: 'textarea',
  label: 'label',
  formHint: 'form-hint',
  formError: 'form-error',
  formField: 'form-field',
  checkbox: 'checkbox',
  btn: 'btn',
  btnSm: 'btn btn-sm',
  btnMd: 'btn btn-md',
  btnLg: 'btn btn-lg',
  btnPrimary: 'btn btn-md btn-primary',
  btnOutline: 'btn btn-md btn-outline',
  btnGhost: 'btn btn-md btn-ghost',
  btnDanger: 'btn btn-md btn-danger',
  btnSecondary: 'btn btn-md btn-secondary',
  textAccentBrand: 'text-accent-brand',
} as const

export type UiClassKey = keyof typeof ui

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return `btn btn-${size} btn-${variant}`
}

export function fieldClasses(
  type: 'input' | 'select' | 'textarea' = 'input',
  options?: { size?: 'sm' | 'lg'; error?: boolean },
): string {
  const classes: string[] = [type]
  if (options?.size) classes.push(`${type}-${options.size}`)
  if (options?.error) classes.push(`${type}-error`)
  return classes.join(' ')
}
