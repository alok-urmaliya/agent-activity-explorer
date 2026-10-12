import { useCallback, useEffect, useState } from 'react';
import type { EventFilters } from '../types';

export const INITIAL_VALUES: EventFilters = {
  q: '',
  agent: '',
  status: 'all',
  selectedId: null,
  bucket: undefined,
  from: undefined,
  to: undefined,
};

function extractFiltersData(): EventFilters {
  const search = new URLSearchParams(window.location.search);
  const rawStatus = search.get('status');
  const rawBucket = search.get('bucket');

  return {
    q: search.get('q') ?? '',
    agent: search.get('agent') ?? '',
    status:
      rawStatus === 'ok' ||
      rawStatus === 'blocked' ||
      rawStatus === 'error'
        ? rawStatus
        : 'all',
    selectedId: search.get('event') ?? null,
    bucket:
      rawBucket === '1m' || rawBucket === '5m' || rawBucket === '1h'
        ? rawBucket
        : undefined,
    from: search.get('from') ?? undefined,
    to: search.get('to') ?? undefined,
  };
}

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>(() =>
    extractFiltersData(),
  );

  const syncFiltersToUrl = useCallback((nextFilters: EventFilters) => {
    const params = new URLSearchParams();

    if (nextFilters.q) params.set('q', nextFilters.q);
    if (nextFilters.agent) params.set('agent', nextFilters.agent);
    if (nextFilters.status !== 'all') {
      params.set('status', nextFilters.status);
    }
    if (nextFilters.selectedId) {
      params.set('event', nextFilters.selectedId);
    }
    if (nextFilters.bucket) {
      params.set('bucket', nextFilters.bucket);
    }
    if (nextFilters.from) params.set('from', nextFilters.from);
    if (nextFilters.to) params.set('to', nextFilters.to);

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
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    filters,
    updateFilters,
    setFilters,
  };
}