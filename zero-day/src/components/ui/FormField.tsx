import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { Label } from './Label'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('form-field', className)} {...props}>
      {label != null && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint != null && !error && <p className="form-hint">{hint}</p>}
      {error != null && <p className="form-error">{error}</p>}
    </div>
  )
}
