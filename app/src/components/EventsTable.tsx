import { cn } from "@/lib/utils"
import type { EventItem, EventFilters } from "../types"

type EventsTableProps = {
  events: EventItem[]
  updateFilters: (newFilters: Partial<EventFilters>) => void
}

function formatArgs(args: unknown): string {
  if (typeof args === "string") return args
  if (args == null) return "—"

  try {
    return JSON.stringify(args)
  } catch {
    return String(args)
  }
}

function formatTimestamp(timestamp: string | number | Date): string {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return String(timestamp)

  return date.toLocaleString()
}

export default function EventsTable({
  events,
  updateFilters,
}: EventsTableProps) {
  return (
    <div className="events-table-scroll h-full min-h-0 w-full overflow-auto rounded-md border border-subtle">
      <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
        <colgroup>
          <col className="w-[19%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-[27%]" />
        </colgroup>

        <thead className="sticky top-0 z-10 bg-surface">
          <tr>
            {["Timestamp", "Agent", "Tool", "Status", "Latency", "Args"].map(
              (heading) => (
                <th
                  key={heading}
                  className="border-b border-subtle bg-surface px-6 py-4 font-medium text-secondary"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {events.map((event) => {
            const args = formatArgs(event.argsPreview)

            return (
              <tr
                key={event.id}
                onClick={() => updateFilters({ selectedId: event.id })}
                className="cursor-pointer bg-transparent transition-colors hover:bg-hover"
              >
                <td className="border-b border-subtle px-6 py-4 text-secondary">
                  <span className="block truncate" title={String(event.timestamp)}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                </td>

                <td className="border-b border-subtle px-6 py-4 text-primary">
                  <span className="block truncate" title={event.agent}>
                    {event.agent}
                  </span>
                </td>

                <td className="border-b border-subtle px-6 py-4 text-primary">
                  <span className="block truncate" title={event.tool}>
                    {event.tool}
                  </span>
                </td>

                <td className="border-b border-subtle px-6 py-4">
                  <div className="flex">
                    <span
                      className={cn(
                        "border px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-md",
                        event.status === "ok" &&
                          "border-emerald-700/30 bg-emerald-500/8 text-emerald-400",
                        event.status === "blocked" &&
                          "border-amber-700/30 bg-amber-500/8 text-amber-400",
                        event.status === "error" &&
                          "border-rose-700/30 bg-rose-500/8 text-rose-400",
                      )}
                    >
                      {event.status}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap border-b border-subtle px-6 py-4 text-secondary">
                  {event.latencyMs} ms
                </td>

                <td className="border-b border-subtle px-6 py-4 text-secondary">
                  <div className="truncate" title={args}>
                    {args}
                  </div>
                </td>
              </tr>
            )
          })}

          {events.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="border-b border-subtle px-6 py-12 text-center text-secondary"
              >
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}