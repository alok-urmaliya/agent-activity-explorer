import { useEffect, useState } from "react";
import { getEventsHistogram } from "../lib/api";
import type {
  EventFilters,
  EventsHistogramResponse,
} from "../types";

export function useEventsHistogram(
  filters: EventFilters,
) {
  const [data, setData] = useState<EventsHistogramResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistogram() {
      setLoading(true);
      setError(null);

      try {
        const response = await getEventsHistogram({
          q: filters.q,
          agent: filters.agent,
          status: filters.status,
          from: filters.from,
          to: filters.to,
          bucket: filters.bucket ?? "1m",
        } as EventFilters);

        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            (requestError as Error).message ||
              "Unable to load event histogram.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistogram();

    return () => {
      cancelled = true;
    };
  }, [filters.q, filters.agent, filters.status, filters.bucket, filters.from, filters.to]);

  return {
    buckets: data?.buckets ?? [],
    loading,
    error,
  };
}