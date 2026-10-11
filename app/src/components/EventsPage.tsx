import React from 'react';
import type { EventFilters } from '../types';
import { useEvents } from '../hooks/useEvents';

interface EventsPageProps {
  filters: EventFilters;
  updateFilters: (newFilters: Partial<EventFilters>) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ filters }) => {
  const {
    events,
    loading,
    loadingMore,
    slowNetwork,
    error,
    hasMore,
    loadMore,
  } = useEvents(filters);
  
  return (
    <div className="w-[100vw] h-[100vh] flex-col items-center justify-center text-3xl font-bold">
      <p>
        Agent Activity Explorer -- Events Page.
      </p>

      <div className="w-[100vw] h-[100vh] flex items-center justify-center text-3xl font-bold">
        {loading && <p>Loading events...</p>}
        {error && <p>Error loading events: {error}</p>}
        {!loading && !error && events.length === 0 && <p>No events found.</p>}
        {events && events.length > 0 && (
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.agent}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default EventsPage;
