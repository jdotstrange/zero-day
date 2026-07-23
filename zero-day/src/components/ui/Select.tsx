import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { Icon, Icons } from '@/components/common'
import { cn } from './cn'
import { fieldClasses } from './tokens'

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  error?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

type OptionElementProps = {
  value?: string | number
  disabled?: boolean
  children?: ReactNode
}

function parseOptions(children: ReactNode): SelectOption[] {
  const options: SelectOption[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (child.type === 'option') {
      const props = child.props as OptionElementProps
      options.push({
        value: String(props.value ?? ''),
        label: String(props.children ?? ''),
        disabled: props.disabled,
      })
      return
    }

    if (child.type === 'optgroup') {
      const groupProps = child.props as { children?: ReactNode }
      Children.forEach(groupProps.children, (groupChild) => {
        if (!isValidElement(groupChild) || groupChild.type !== 'option') return
        const optionProps = groupChild.props as OptionElementProps
        options.push({
          value: String(optionProps.value ?? ''),
          label: String(optionProps.children ?? ''),
          disabled: optionProps.disabled,
        })
      })
    }
  })

  return options
}

function createChangeEvent(
  value: string,
  name?: string,
): ChangeEvent<HTMLSelectElement> {
  return {
    target: { value, name } as HTMLSelectElement,
    currentTarget: { value, name } as HTMLSelectElement,
  } as ChangeEvent<HTMLSelectElement>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    error = false,
    inputSize = 'md',
    children,
    value: valueProp,
    defaultValue,
    onChange,
    disabled,
    id,
    name,
    required,
    'aria-invalid': ariaInvalid,
  },
  ref,
) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const options = parseOptions(children)

  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState<string>(
    () => String(defaultValue ?? options.find((o) => !o.disabled)?.value ?? ''),
  )
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const currentValue = isControlled ? String(valueProp) : internalValue
  const selectedOption = options.find((option) => option.value === currentValue)
  const selectedLabel = selectedOption?.label ?? ''
  const isPlaceholder = currentValue === '' || selectedOption?.disabled === true

  const sizeKey = inputSize === 'md' ? undefined : inputSize

  useImperativeHandle(ref, () => {
    const proxy = document.createElement('select')
    Object.defineProperty(proxy, 'value', {
      get: () => currentValue,
      set: (next: string) => {
        if (!isControlled) setInternalValue(next)
        onChange?.(createChangeEvent(next, name))
      },
      configurable: true,
    })
    return proxy as HTMLSelectElement
  }, [currentValue, isControlled, name, onChange])

  const commitValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue)
      onChange?.(createChangeEvent(nextValue, name))
      setOpen(false)
      setFocusedIndex(-1)
      triggerRef.current?.focus()
    },
    [isControlled, name, onChange],
  )

  const enabledOptions = options.filter((option) => !option.disabled)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const selectedIndex = enabledOptions.findIndex((option) => option.value === currentValue)
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, currentValue, enabledOptions])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
        setFocusedIndex((prev) => Math.min(prev + 1, enabledOptions.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
        if (focusedIndex >= 0 && enabledOptions[focusedIndex]) {
          commitValue(enabledOptions[focusedIndex].value)
        }
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        setFocusedIndex(-1)
        break
      case 'Tab':
        setOpen(false)
        setFocusedIndex(-1)
        break
      default:
        break
    }
  }

  return (
    <div ref={containerRef} className={cn('select-field', className)}>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}

      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (error || undefined)}
        aria-required={required || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className={cn(
          fieldClasses('select', { size: sizeKey, error }),
          'select-trigger',
          open && 'select-open',
        )}
        onClick={() => {
          if (disabled) return
          setOpen((prev) => !prev)
        }}
        onKeyDown={handleKeyDown}
      >
        <span
          className={cn('select-value', isPlaceholder && 'select-value-placeholder')}
        >
          {isPlaceholder ? selectedLabel || 'Select…' : selectedLabel}
        </span>
        <Icon icon={Icons.chevronDown} className="select-chevron" aria-hidden />
      </button>

      {open && (
        <ul id={listboxId} role="listbox" className="select-menu scrollbar-thin">
          {options.map((option) => {
            const enabledIndex = enabledOptions.findIndex((item) => item.value === option.value)
            const isSelected = option.value === currentValue
            const isFocused = enabledIndex === focusedIndex

            return (
              <li key={`${option.value}-${option.label}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  className={cn(
                    'select-option',
                    isSelected && 'select-option-selected',
                    isFocused && 'select-option-focused',
                  )}
                  onMouseEnter={() => {
                    if (!option.disabled && enabledIndex >= 0) {
                      setFocusedIndex(enabledIndex)
                    }
                  }}
                  onClick={() => {
                    if (!option.disabled) commitValue(option.value)
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Icon icon={Icons.check} className="select-option-check" aria-hidden />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
})
