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
  selectedId: string | null;
};
