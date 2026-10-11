import { Switch as BaseSwitch } from "@base-ui/react/switch"

type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
}: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-secondary">
      {label && <span>{label}</span>}
      <BaseSwitch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-border-strong transition-colors data-[checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <BaseSwitch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-[18px]" />
      </BaseSwitch.Root>
    </label>
  )
}