import { BASE_URL } from '../env';
import type {
  EventItem,
  EventListResponse,
  EventsHistogramResponse,
  EventFilters
} from "../types";
import { toISOString } from "./utils";


type QueryValue = string | number | boolean | undefined | null | string[];

type EventQuery = {
  q?: string;
  agent?: string | string[];
  status?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
};

async function request<T>(path: string, params?: Record<string, QueryValue>): Promise<T> {
  const url = new URL(path, BASE_URL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        url.searchParams.append(key, String(entry));
      });
      return;
    }
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export const getAgents = async (): Promise<string[]> => {
  return request<string[]>('/agents');
};

export const getEvents = async (
  query: EventQuery = {},
): Promise<EventListResponse> => {
  return request<EventListResponse>("/events", {
    ...query,
    from: toISOString(query.from),
    to: toISOString(query.to),
  });
};

export const getEventById = async (id: string): Promise<EventItem> => {
  return request<EventItem>(`/events/${encodeURIComponent(id)}`);
};

export const getEventsHistogram = async (
  params: EventFilters,
): Promise<EventsHistogramResponse> => {
  return request<EventsHistogramResponse>("/events/histogram", {
    ...params,
    from: toISOString(params.from),
    to: toISOString(params.to),
    status: params.status === "all" ? undefined : params.status,
  });
};