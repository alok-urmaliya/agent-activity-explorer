import { useCallback, useEffect, useState } from 'react';
import type { EventFilters, HistogramBucketSize } from '../types';

export const INITIAL_VALUES: EventFilters = {
  q: '',
  agent: '',
  status: 'all',
  selectedId: null,
  bucket: undefined,
};

function extractFiltersData(): EventFilters {
  const search = new URLSearchParams(window.location.search);
  const rawStatus = search.get('status');

  return {
    q: search.get('q') ?? '',
    agent: search.get('agent') ?? '',
    status: rawStatus === 'ok' || rawStatus === 'blocked' || rawStatus === 'error' ? rawStatus : 'all',
    selectedId: search.get('event') ?? null,
    bucket: search.get("bucket") as HistogramBucketSize ?? undefined,
  };
};

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>(() => extractFiltersData());

  const syncFiltersToUrl = useCallback((nextFilters: EventFilters) => {
    const params = new URLSearchParams();

    if (nextFilters.q) params.set('q', nextFilters.q);
    if (nextFilters.agent) params.set('agent', nextFilters.agent);
    if (nextFilters.status !== 'all') params.set('status', nextFilters.status);
    if (nextFilters.selectedId) params.set('event', nextFilters.selectedId);
    if (nextFilters.bucket) params.set("bucket", nextFilters.bucket);

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
  }, []);

  const updateFilters = useCallback(
    (next: Partial<EventFilters>) => {
      setFilters((current) => {
        const merged = { ...current, ...next };
        syncFiltersToUrl(merged);
        return merged;
      });
    },
    [syncFiltersToUrl],
  );

  useEffect(() => {
    const handlePopState = () => {
      setFilters(extractFiltersData());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return {
    filters,
    updateFilters,
    setFilters,
  };
}
