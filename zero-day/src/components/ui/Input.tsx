import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { fieldClasses } from './tokens'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  error?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error = false, inputSize = 'md', prefix, suffix, ...props },
  ref,
) {
  const sizeKey = inputSize === 'md' ? undefined : inputSize
  const inputClassName = cn(
    fieldClasses('input', { size: sizeKey, error }),
    prefix != null && 'input-has-prefix',
    suffix != null && 'input-has-suffix',
    className,
  )

  if (!prefix && !suffix) {
    return (
      <input
        ref={ref}
        className={inputClassName}
        aria-invalid={error || undefined}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        'input-affix',
        sizeKey && `input-affix-${sizeKey}`,
        error && 'input-affix-error',
      )}
    >
      {prefix != null && <span className="input-prefix">{prefix}</span>}
      <input
        ref={ref}
        className={inputClassName}
        aria-invalid={error || undefined}
        {...props}
      />
      {suffix != null && <span className="input-suffix">{suffix}</span>}
    </div>
  )
})
