import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from './cn'
import { fieldClasses } from './tokens'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error = false, inputSize = 'md', ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        fieldClasses('textarea', {
          size: inputSize === 'md' ? undefined : inputSize,
          error,
        }),
        className,
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  )
})
