import { type InputHTMLAttributes } from 'react'
import { Icon, Icons } from '@/components/common'
import { Input } from '@/components/ui'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  inputClassName?: string
}

export function SearchField({
  className,
  inputClassName,
  placeholder,
  ...props
}: SearchFieldProps) {
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder={placeholder}
        inputSize="sm"
        className={inputClassName}
        prefix={<Icon icon={Icons.search} className="h-4 w-4" width={16} height={16} />}
        {...props}
      />
    </div>
  )
}
