import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EventFilters } from "../types";
import { useEventsHistogram } from "../hooks/useEventsHistogram";

interface EventsHistogramProps {
  filters: EventFilters;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventsHistogram({
  filters,
}: EventsHistogramProps) {
  const { buckets, loading, error } = useEventsHistogram(filters);

  return (
    <section className="shrink-0 rounded-lg border border-subtle bg-surface p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-primary">
          Event activity
        </h3>
        <p className="text-xs text-secondary">
          Number of events over time
        </p>
      </div>

      {loading && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-secondary">
            Loading histogram...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && buckets.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-secondary">
            No event activity found.
          </p>
        </div>
      )}

      {!loading && !error && buckets.length > 0 && (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={buckets}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="t"
              tickFormatter={formatTime}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              labelFormatter={(label) =>
                new Date(String(label)).toLocaleString()
              }
              formatter={(value) => [value, "Events"]}
              contentStyle={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="count"
              name="Events"
              fill="var(--chart-line)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}