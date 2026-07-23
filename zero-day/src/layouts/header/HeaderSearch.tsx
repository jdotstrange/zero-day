import { Icon, Icons } from '@/components/common'
import { Input } from '@/components/ui'

interface HeaderSearchProps {
  placeholder: string
  className?: string
  inputClassName?: string
  autoFocus?: boolean
}

export function HeaderSearch({
  placeholder,
  className,
  inputClassName,
  autoFocus,
}: HeaderSearchProps) {
  return (
    <div className={className ?? 'header-search'}>
      <Input
        type="search"
        placeholder={placeholder}
        autoFocus={autoFocus}
        inputSize="sm"
        className={inputClassName}
        aria-label={placeholder}
        prefix={<Icon icon={Icons.search} className="h-4 w-4" width={16} height={16} />}
      />
    </div>
  )
}
