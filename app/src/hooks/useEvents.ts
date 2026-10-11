import { useCallback, useEffect, useRef, useState } from "react"

import { getEvents } from "../api"
import type { EventItem, EventFilters } from "../types"

const PAGE_SIZE = 50

export function useEvents(filters: EventFilters) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [slowNetwork, setSlowNetwork] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const nextCursorRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)
  const loadingMoreRef = useRef(false)

  const loadEvents = useCallback(
    async (append = false) => {
      if (append && (loadingMoreRef.current || !nextCursorRef.current)) {
        return
      }

      const requestId = ++requestIdRef.current

      const query = {
        q: filters.q || undefined,
        agent: filters.agent || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        limit: PAGE_SIZE,
        cursor: append ? nextCursorRef.current ?? undefined : undefined,
      }

      if (append) {
        loadingMoreRef.current = true
        setLoadingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      try {
        const response = await getEvents(query)

        if (requestId !== requestIdRef.current) {
          return
        }

        const nextItems = response.items ?? []
        const cursor = response.nextCursor ?? null

        setEvents((current) =>
          append ? [...current, ...nextItems] : nextItems,
        )

        nextCursorRef.current = cursor
        setNextCursor(cursor)
      } catch (requestError) {
        if (requestId === requestIdRef.current) {
          setError(
            (requestError as Error).message || "Unable to load events.",
          )
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
          setLoadingMore(false)
          loadingMoreRef.current = false
        }
      }
    },
    [filters.agent, filters.q, filters.status],
  )

  useEffect(() => {
    nextCursorRef.current = null
    setNextCursor(null)
    setEvents([])
    loadingMoreRef.current = false

    void loadEvents()

    return () => {
      requestIdRef.current++
    }
  }, [loadEvents])

  useEffect(() => {
    if (!(loading || loadingMore)) {
      setSlowNetwork(false)
      return
    }

    const timer = window.setTimeout(() => {
      setSlowNetwork(true)
    }, 900)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loading, loadingMore])

  const loadMore = useCallback(() => {
    void loadEvents(true)
  }, [loadEvents])

  return {
    events,
    loading,
    loadingMore,
    slowNetwork,
    error,
    nextCursor,
    hasMore: Boolean(nextCursor),
    loadMore,
  }
}