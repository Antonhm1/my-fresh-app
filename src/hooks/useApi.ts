import { useState, useEffect, useCallback } from 'react';
import { ApiError, getEvents, getInfo, getBanners } from '../utils/api';
import type { EventsResponse, InfoResponse, BannersResponse } from '../types/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error occurred';

      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [apiCall]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    refetch: execute,
  };
}

// Hook specifically for events
export function useEvents(options?: {
  featured?: boolean;
  limit?: number;
  immediate?: boolean;
}) {
  const apiCall = useCallback(async () => {
    return getEvents({
      featured: options?.featured,
      limit: options?.limit,
    });
  }, [options?.featured, options?.limit]);

  return useApi(apiCall, { immediate: options?.immediate ?? true });
}

// Hook specifically for info/news
export function useInfo(options?: {
  featured?: boolean;
  type?: 'news' | 'announcement' | 'general';
  limit?: number;
  immediate?: boolean;
}) {
  const apiCall = useCallback(async () => {
    return getInfo({
      featured: options?.featured,
      type: options?.type,
      limit: options?.limit,
    });
  }, [options?.featured, options?.type, options?.limit]);

  return useApi(apiCall, { immediate: options?.immediate ?? true });
}

// Hook specifically for banners
export function useBanners(options?: {
  limit?: number;
  immediate?: boolean;
}) {
  const apiCall = useCallback(async () => {
    return getBanners({ limit: options?.limit });
  }, [options?.limit]);

  return useApi(apiCall, { immediate: options?.immediate ?? true });
}

// Generic hook for async operations with loading states
export function useAsyncAction<T extends unknown[], R>(
  action: (...args: T) => Promise<R>
): {
  execute: (...args: T) => Promise<R>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: T): Promise<R> => {
    setLoading(true);
    setError(null);

    try {
      const result = await action(...args);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
        ? err.message
        : 'Unknown error occurred';

      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [action]);

  return { execute, loading, error };
}