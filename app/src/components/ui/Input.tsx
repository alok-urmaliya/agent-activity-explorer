import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-subtle bg-surface px-3 text-sm text-primary placeholder:text-secondary",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}