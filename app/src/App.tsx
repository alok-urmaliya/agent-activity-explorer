import { useEventFilters } from "./hooks/useEventFilters";
import EventsPage from "./components/EventsPage";
import EventDetailPanel from "./components/EventsDetailPanel";
import './App.css';

const App = () => {
  const { filters, updateFilters } = useEventFilters();
  return (
    <div className="dark w-[100vw] h-[100vh] flex bg-app">
      <div className="w-full h-15 p-5 bg-surface text-primary flex items-center justify-between border-b border-b-subtle">
        <h3 className="text-lg font-semibold">Agents Activity Explorer</h3>
      </div>
      {/* <EventsPage
        filters={filters}
        updateFilters={updateFilters}
      /> */}
      {filters.selectedId && (
        <EventDetailPanel
          selectedId={filters.selectedId}
          onClose={() => updateFilters({ selectedId: null })}
        />
      )}
    </div>
  )
}
export default App;
