import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useEventDetail } from "../hooks/useEventDetail";
import SidePanel from "./ui/Sidepanel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CollapsibleSection from "./ui/Collapsible";

interface EventDetailPanelProps {
  selectedId: string | null
  onClose: () => void
}

const EventDetailPanel = ({
  selectedId,
  onClose,
}: EventDetailPanelProps) => {
  const { data, loading, error } = useEventDetail(selectedId)
  const [expanded, setExpanded] = useState({
    args: true,
    result: true,
  });

  return (
    <SidePanel
      open={Boolean(selectedId)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-subtle pb-4">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-primary">
            Event Details
          </h2>
          <p className="text-sm text-secondary">
            ID: {selectedId || "N/A"}
          </p>
          <p className="text-sm text-secondary">
            Timestamp: {data?.timestamp
              ? new Date(data.timestamp).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close panel"
          className="shrink-0 rounded-md p-2 text-secondary transition-colors hover:bg-hover hover:text-primary cursor-pointer"
        >
          <X size={20}/>
        </button>
      </div>

      <div className="mt-5">
        {loading && (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-secondary">
              Loading event details...
            </p>
          </div>
        )}

        {!loading && (error || !data) && (
          <p className="text-sm text-secondary">
            {error || "Unable to load event details."}
          </p>
        )}

        {!loading && !error && data && (
          <div className="flex flex-col gap-4">
            <div>
              <span
                className={cn(
                  "border px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-lg",
                  data.status === "ok" &&
                    "border-emerald-700/30 bg-emerald-500/8 text-emerald-400",
                  data.status === "blocked" &&
                    "border-amber-700/30 bg-amber-500/8 text-amber-400",
                  data.status === "error" &&
                    "border-rose-700/30 bg-rose-500/8 text-rose-400",
                )}
              >
                {data.status}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex-1 min-w-0 rounded-md border border-panel-header p-4">
                <p className="text-sm text-secondary">Agent</p>
                <p className="text-sm text-primary">{data?.agent || "N/A"}</p>
              </div>

              <div className="flex-1 min-w-0 rounded-md border border-panel-header p-4">
                <p className="text-sm text-secondary">Tool</p>
                <p className="text-sm text-primary">{data?.tool || "N/A"}</p>
              </div>

              <div className="flex-1 min-w-0 rounded-md border border-panel-header p-4">
                <p className="text-sm text-secondary">Latency</p>
                <p className="text-sm text-primary">{data?.latencyMs ?? "N/A"} ms</p>
              </div>
            </div>

            <CollapsibleSection
              title="Arguments"
              open={expanded.args}
              onToggle={() =>
                setExpanded((prev) => ({ ...prev, args: !prev.args }))
              }
            >
              <pre className="whitespace-pre-wrap break-words overflow-x-hidden bg-code-block p-4 font-mono text-xs leading-6 text-syntax-string">
                {JSON.stringify(data?.args ?? {}, null, 2)}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection
              title="Result"
              open={expanded.result}
              onToggle={() =>
                setExpanded((prev) => ({ ...prev, result: !prev.result }))
              }
            >
              <pre className="whitespace-pre-wrap break-words overflow-x-hidden bg-code-block p-4 font-mono text-xs leading-6 text-syntax-string">
                {JSON.stringify(data?.result ?? {}, null, 2)}
              </pre>
            </CollapsibleSection>

            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-sm font-semibold text-primary">Policy Matches</h3>
              </div>
              {data.policyMatches && data.policyMatches.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-red-500/20">
                  <div className="flex items-center justify-between border-b border-red-500/20 bg-red-500/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-400" />
                      <h3 className="text-sm font-semibold text-primary">
                        Fired rules
                      </h3>
                    </div>

                    <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                      {data.policyMatches.length} found
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-4">
                    {data.policyMatches.map((match, index) => (
                      <span
                        key={index}
                        className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-sm text-red-300"
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-subtle p-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <p className="text-sm text-secondary">No policy matches found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  )
}

export default EventDetailPanel;