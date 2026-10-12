import type { ReactNode } from "react"
import { Drawer } from "@base-ui/react/drawer"
import { cn } from "@/lib/utils"

type SidePanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  className?: string
}

export default function SidePanel({
  open,
  onOpenChange,
  children,
  className,
}: SidePanelProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Drawer.Viewport className="pointer-events-none fixed inset-0 z-50 flex justify-end">
          <Drawer.Popup
            className={cn(
              "pointer-events-auto flex h-full w-full max-w-md flex-col bg-surface text-primary shadow-xl",
              "transition-transform duration-300 ease-out",
              "data-[starting-style]:translate-x-full",
              "data-[ending-style]:translate-x-full",
              className,
            )}
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
};