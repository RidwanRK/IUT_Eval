'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/storage';

interface State<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Runs an async service call, tracks loading and error, and quietly reloads whenever
 * stored data changes (for example after the demo date changes). Components use this
 * instead of touching storage.
 */
export function useService<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  const runId = useRef(0);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const run = useCallback(async (showLoading: boolean) => {
    const id = ++runId.current;
    if (showLoading) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      if (id === runId.current) setState({ data, error: null, loading: false });
    } catch (err) {
      if (id === runId.current) {
        setState({
          data: null,
          error: err instanceof Error ? err : new Error('Unknown error'),
          loading: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void run(true);
    return storage.subscribe(() => void run(false));
  }, [run]);

  const reload = useCallback(() => run(true), [run]);

  return { ...state, reload };
}
