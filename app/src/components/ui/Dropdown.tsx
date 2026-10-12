import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type DropdownOption = {
  label: string
  value: string
}

type DropdownProps = {
  value: string | null
  onValueChange: (value: string | null) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  ariaLabel?: string
}

export default function Dropdown({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
  ariaLabel,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        aria-label={ariaLabel}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-9 items-center justify-between gap-2 rounded-md border border-subtle bg-surface px-3 text-sm text-secondary",
          "transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full w-max z-50 mt-2 overflow-hidden rounded-md border border-subtle bg-surface p-1 text-primary shadow-lg"
        >
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  "flex h-min px-2 py-1 mb-1 cursor-pointer w-full items-center justify-between gap-2 whitespace-nowrap rounded text-left text-sm text-primary outline-none",
                  "hover:bg-hover focus-visible:bg-hover",
                  selected && "bg-hover",
                )}
              >
                <span>{option.label}</span>
                {selected && <Check size={12} className="shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}