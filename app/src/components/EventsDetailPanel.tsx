import React from 'react';
import { useEventDetail } from '../hooks/useEventDetail';


interface EventDetailPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

const EventDetailPanel: React.FC<EventDetailPanelProps> = ({ selectedId, onClose }: EventDetailPanelProps) => {
  const {
    data,
    loading,
    error,
  } = useEventDetail(selectedId);

  if (loading) {
    return (
      <div>Loading event details...</div>
    )
  };

  if (error || !data) {
    return (
      <div>
        <p>Error loading event details: {error}</p>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <div>
      {data.agent}
      {data.timestamp}
    </div>
  )
}

export default EventDetailPanel;
