import { useEventFilters } from "./hooks/useEventFilters";
import EventsPage from "./components/EventsPage";
import EventDetailPanel from "./components/EventsDetailPanel";
import Switch from "./components/ui/Switch";
import { useState, useEffect } from "react";


const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const { filters, updateFilters } = useEventFilters();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-app">
      <div className="h-15 w-full shrink-0 border-b border-b-subtle bg-surface p-6 !text-primary flex items-center justify-between">
        <h3 className="text-lg font-semibold">Agents Activity Explorer</h3>
        <Switch
          label="Dark mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>
      <EventsPage
        filters={filters}
        updateFilters={updateFilters}
      />
      <EventDetailPanel
        selectedId={filters.selectedId}
        onClose={() => updateFilters({ selectedId: null })}
      />
    </div>
  )
}
export default App;
