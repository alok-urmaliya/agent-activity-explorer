import React from 'react';
import type { EventFilters, EventStatus } from '../types';
import { useEvents } from '../hooks/useEvents';
import Switch from './ui/Switch';
import Input from './ui/Input';
import Dropdown from './ui/Dropdown';
import { useAgents } from '@/hooks/useAgents';
import Button from './ui/Button';
import EventsTable from './EventsTable';

interface EventsPageProps {
  filters: EventFilters;
  updateFilters: (newFilters: Partial<EventFilters>) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ filters, updateFilters }) => {
  const [liveMode, setLiveMode] = React.useState(false);

  const {
    agents
  } = useAgents();

  const {
    events,
    loading,
    loadingMore,
    slowNetwork,
    error,
    hasMore,
    loadMore,
  } = useEvents(filters);

  console.log(loading);
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-hidden p-6 text-primary">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold">Events Explorer</h2>
          <p className="text-sm text-secondary">
            Inspect activity across all agents.
          </p>
        </div>

        <Switch
          label="Live mode"
          checked={liveMode}
          onCheckedChange={setLiveMode}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* TODO: Add Timeline */}
        {/* <div className="h-30 shrink-0 rounded-md border border-subtle bg-surface" /> */}

        <div className="flex shrink-0 gap-4">
          <Input
            value={filters.q || ""}
            onChange={(event) => updateFilters({ q: event.target.value })}
            placeholder="Search events, tools, args..."
            className="flex-1"
          />

          <Dropdown
            value={filters.agent || ""}
            onValueChange={(value) =>
              updateFilters({ agent: value || undefined })
            }
            options={[
              { label: "Agent", value: "" },
              ...agents.map((agent) => ({ label: agent, value: agent })),
            ]}
            placeholder="Agent"
            className="!w-40"
          />

          <Dropdown
            value={filters.status === "all" ? "all" : filters.status || "all"}
            onValueChange={(value) =>
              updateFilters({
                status: (value || "all") as EventStatus,
              })
            }
            options={[
              { label: "Status", value: "all" },
              { label: "OK", value: "ok" },
              { label: "Blocked", value: "blocked" },
              { label: "Error", value: "error" },
            ]}
            placeholder="Status"
            className="!w-25"
          />

          <Button
            onClick={() => {
              updateFilters({ q: "", agent: "", status: "all" })
            }}
          >
            Clear Filters
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col h-full w-full items-center justify-center">
            <p className="text-sm text-secondary">Loading events...</p>
            {slowNetwork && (
              <p className="text-xs text-secondary">
                This is taking longer than expected. Please check your network.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-secondary">No events found.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <EventsTable
            events={events}
            updateFilters={updateFilters}
            hasMore={hasMore}
            loadingMore={loadingMore}
            loadMore={loadMore}
          />
        )}
      </div>

    </div>
  );
}

export default EventsPage;
