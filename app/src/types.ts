export type EventStatus = 'ok' | 'blocked' | 'error';

export type EventItem = {
  id: string;
  timestamp: string;
  agent: string;
  tool: string;
  status: EventStatus;
  latencyMs: number;
  argsPreview?: string;
  args?: unknown;
  result?: unknown;
  policyMatches?: string[];
};

export type EventListResponse = {
  items: EventItem[];
  nextCursor?: string | null;
  total: number;
};

export type Agent = {
  name: string;
};

export type EventStatusFilter = 'all' | EventStatus;

export type EventFilters = {
  q: string;
  agent: string;
  status: EventStatusFilter;
  from?: string;
  to?: string;
  selectedId: string | null;
  bucket?: HistogramBucketSize;
};

export type HistogramBucketSize = "1m" | "5m" | "1h";

export interface HistogramBucket {
  t: string;
  count: number;
}

export interface EventsHistogramResponse {
  bucket: HistogramBucketSize;
  buckets: HistogramBucket[];
}
