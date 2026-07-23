import { type LabelHTMLAttributes } from 'react'
import { cn } from './cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn('label', required && 'label-required', className)}
      {...props}
    >
      {children}
    </label>
  )
}
