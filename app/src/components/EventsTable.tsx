import { cn } from "@/lib/utils"
import type { EventItem, EventFilters } from "../types"

type EventsTableProps = {
  events: EventItem[]
  updateFilters: (newFilters: Partial<EventFilters>) => void
  hasMore: boolean
  loadingMore: boolean
  loadMore: () => void
}

function formatTimestamp(timestamp: string | number | Date): string {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return String(timestamp)

  return date.toLocaleString()
}

export default function EventsTable({
    events,
    updateFilters,
    hasMore,
    loadingMore,
    loadMore,
  }: EventsTableProps) {
  return (
    <div
      className="events-table-scroll h-full min-h-0 w-full overflow-auto rounded-md border border-subtle"
      onScroll={(event) => {
        const element = event.currentTarget
        const distanceToBottom =
          element.scrollHeight - element.scrollTop - element.clientHeight

        if (distanceToBottom < 150 && hasMore && !loadingMore) {
          loadMore()
        }
      }}
    >
      <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
        <colgroup>
          <col className="w-[19%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
        </colgroup>

        <thead className="sticky top-0 z-10 bg-surface">
          <tr>
            {["Timestamp", "Agent", "Tool", "Status", "Latency"].map(
              (heading) => (
                <th
                  key={heading}
                  className="border-b border-subtle bg-surface px-3 py-2 font-medium text-secondary"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {events.map((event) => {
            return (
              <tr
                key={event.id}
                tabIndex={0}
                onClick={() => updateFilters({ selectedId: event.id })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    updateFilters({ selectedId: event.id })
                  }
                }}
                className="cursor-pointer bg-transparent transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
              >
                <td className="border-b border-subtle px-3 py-2 text-secondary">
                  <span className="block truncate" title={String(event.timestamp)}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                </td>

                <td className="border-b border-subtle px-3 py-2 text-primary">
                  <span className="block truncate" title={event.agent}>
                    {event.agent}
                  </span>
                </td>

                <td className="border-b border-subtle px-3 py-2 text-primary">
                  <span className="block truncate" title={event.tool}>
                    {event.tool}
                  </span>
                </td>

                <td className="border-b border-subtle px-3 py-2">
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

                <td className="whitespace-nowrap border-b border-subtle px-3 py-2 text-secondary">
                  {event.latencyMs} ms
                </td>
              </tr>
            )
          })}

          {events.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="border-b border-subtle px-6 py-12 text-center text-secondary"
              >
                No events found.
              </td>
            </tr>
          )}
          {loadingMore && (
            <tr>
              <td colSpan={5} className="px-3 py-2 text-center text-sm text-secondary">
                Loading more events...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}