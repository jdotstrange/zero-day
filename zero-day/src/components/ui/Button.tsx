import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { cn } from './cn'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './tokens'

const innerClass = 'inline-flex flex-row flex-nowrap items-center justify-center gap-2'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  iconOnly?: boolean
  asChild?: boolean
  children?: ReactNode
}

function renderInner(content: ReactNode, loading: boolean) {
  return (
    <>
      {loading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </span>
      )}
      <span className={cn(innerClass, loading && 'opacity-0')}>{content}</span>
    </>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconOnly = false,
  asChild = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(
    buttonClasses(variant, size),
    iconOnly && 'btn-icon',
    fullWidth && 'w-full',
    loading && 'relative',
    loading && 'pointer-events-none',
    className,
  )

  const spinnerClass =
    variant === 'primary' || variant === 'danger'
      ? 'border-white/30 border-t-white'
      : 'border-surface-300 border-t-secondary-700 dark:border-surface-600 dark:border-t-surface-200'

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      children: (
        <>
          {loading && (
            <span
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className={cn(
                  'h-4 w-4 animate-spin rounded-full border-2',
                  spinnerClass,
                )}
              />
            </span>
          )}
          <span className={cn(innerClass, loading && 'opacity-0')}>
            {child.props.children}
          </span>
        </>
      ),
    })
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {renderInner(children, loading)}
    </button>
  )
}
