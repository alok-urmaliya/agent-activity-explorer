import { useEffect, useState } from "react";

import { getEventById } from "../lib/api";
import type { EventItem } from "../types";

export function useEventDetail(selectedId: string | null) {
  const [data, setData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    };

    let isCurrent = true;

    const fetchSelectedEvent = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const item = await getEventById(selectedId);

        if (isCurrent) {
          setData(item)
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            (requestError as Error).message ||
              "Unable to load event details.",
          )
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }
    void fetchSelectedEvent()
    return () => {
      isCurrent = false
    }
  }, [selectedId]);

  return {
    data,
    loading,
    error,
  };
};