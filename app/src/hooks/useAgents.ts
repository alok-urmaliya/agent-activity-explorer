import { useEffect, useState } from "react"
import { getAgents } from "../lib/api";

export function useAgents() {
  const [agents, setAgents] = useState<string[]>([]);

  useEffect(() => {
    let isCurrent = true;
    const fetchAgents = async () => {
      try {
        const response = await getAgents();
        if (isCurrent) {
          setAgents(response.map((agent) => agent));
        }
      } catch {
        if (isCurrent) {
          setAgents([]);
        }
      }
    }
    void fetchAgents();
    return () => {
      isCurrent = false;
    }
  }, []);

  return { agents };
}